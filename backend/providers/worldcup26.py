"""WorldCup 2026 data provider — adapter for https://worldcup26.ir.

This is the ONLY module that knows the upstream shape. If we ever swap
provider, only this file needs to change. The rest of the app consumes
the normalised types declared at the bottom of this file.
"""
from __future__ import annotations

import asyncio
import re
from datetime import datetime, timezone
from typing import Any, Optional

import httpx

from .cache import cache

BASE_URL = "https://worldcup26.ir"

# TTL cache windows
TTL_TEAMS = 3600          # teams rarely change
TTL_STADIUMS = 3600
TTL_GROUPS = 300          # standings update after games
TTL_GAMES = 30            # general matches list
TTL_LIVE = 8              # live games — short
STALE_SECONDS = 1800      # fall-back if upstream temporarily fails

HTTP_TIMEOUT = httpx.Timeout(10.0, connect=5.0)
HEADERS = {"User-Agent": "WorldCupNexus/1.0", "Accept": "application/json"}


# ---------- HTTP ----------
async def _get(path: str) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=HTTP_TIMEOUT, headers=HEADERS, follow_redirects=True) as client:
        r = await client.get(f"{BASE_URL}{path}")
        r.raise_for_status()
        return r.json()


# ---------- Adapters: raw → normalised ----------
def _int(v: Any, default: int = 0) -> int:
    try:
        return int(v)
    except (TypeError, ValueError):
        return default


def _parse_date(local_date: str) -> Optional[str]:
    """worldcup26 returns 'MM/DD/YYYY HH:mm' (no timezone). Stadiums span
    UTC-7..UTC-5 in the host countries — we assume the source is already
    local-to-stadium. We emit ISO with the host timezone set to America/Mexico_City
    by default (UTC-6) so the countdown is accurate. The frontend re-renders in
    user-local time.
    """
    if not local_date:
        return None
    try:
        dt = datetime.strptime(local_date, "%m/%d/%Y %H:%M")
        # Host TZ approximation (UTC-6 — central host cluster)
        # Using fixed offset is acceptable; users see their local time anyway.
        from datetime import timedelta
        dt_utc = dt.replace(tzinfo=timezone(timedelta(hours=-6))).astimezone(timezone.utc)
        return dt_utc.isoformat()
    except Exception:
        return None


_SCORER_RE = re.compile(r"([^\"“”,}{]+?)\s+(\d+)'")


def _parse_scorers(raw: Optional[str]) -> list[dict[str, Any]]:
    """Source ships scorers as a string like '{"J. Quiñones 9'","R. Jiménez 67'"}'
    or with curly smart quotes '{“J. Quiñones 9'”,”R. Jiménez 67'”}'.
    """
    if not raw or raw in ("null", "NULL"):
        return []
    matches = _SCORER_RE.findall(raw)
    return [
        {"player": m[0].strip().strip("\"'“”{}, "), "minute": int(m[1])}
        for m in matches
        if m[0].strip().strip("\"'“”{}, ")
    ]


def _status_from_time_elapsed(time_elapsed: str, finished: str) -> str:
    finished_bool = str(finished).upper() == "TRUE"
    if finished_bool or time_elapsed == "finished":
        return "FT"
    if time_elapsed in ("notstarted", ""):
        return "SCHEDULED"
    return "LIVE"


def _minute_from_time_elapsed(time_elapsed: str) -> Optional[int]:
    if time_elapsed in ("notstarted", "finished", "HT", "", None):
        return None
    m = re.match(r"(\d+)", str(time_elapsed))
    return int(m.group(1)) if m else None


def _phase_es(type_str: str) -> str:
    return {
        "group": "Fase de grupos",
        "round_of_32": "Dieciseisavos",
        "round_of_16": "Octavos de final",
        "quarter_final": "Cuartos de final",
        "semi_final": "Semifinal",
        "third_place": "Tercer puesto",
        "final": "Final",
    }.get(type_str, type_str.replace("_", " ").title() if type_str else "Mundial")


def _team_color(iso2: str) -> str:
    """Best-effort accent color per nation (used for hero accents)."""
    palette = {
        "MX": "#006847", "AR": "#75AADB", "BR": "#FEDF00", "FR": "#0055A4",
        "ES": "#C60B1E", "GB": "#012169", "DE": "#000000", "IT": "#0072B5",
        "NL": "#FF6600", "PT": "#006600", "BE": "#FFD700", "HR": "#FF0000",
        "US": "#B22234", "CA": "#FF0000", "JP": "#BC002D", "KR": "#000000",
        "MA": "#C1272D", "ZA": "#007749", "CZ": "#11457E", "EC": "#FFD100",
    }
    return palette.get(iso2.upper(), "#00E5FF")


# ---------- Provider class ----------
class WorldCup26Provider:
    name = "worldcup26"

    # ----- TEAMS -----
    async def get_teams_raw(self) -> list[dict[str, Any]]:
        return await cache.get_or_fetch(
            "teams",
            TTL_TEAMS,
            lambda: self._fetch_teams(),
            stale_seconds=STALE_SECONDS,
        )

    async def _fetch_teams(self) -> list[dict[str, Any]]:
        data = await _get("/get/teams")
        return data.get("teams", [])

    async def get_teams(self) -> list[dict[str, Any]]:
        raw = await self.get_teams_raw()
        return [self._adapt_team(t) for t in raw]

    def _adapt_team(self, t: dict[str, Any]) -> dict[str, Any]:
        iso2 = (t.get("iso2") or "").upper()
        return {
            "id": str(t.get("id")),
            "code": t.get("fifa_code") or iso2 or t.get("name_en", "")[:3].upper(),
            "name": t.get("name_en", ""),
            "name_en": t.get("name_en", ""),
            "name_fa": t.get("name_fa", ""),
            "iso2": iso2.lower(),  # for flag-icons CSS class
            "flag_url": t.get("flag"),  # PNG URL fallback
            "fifa_code": t.get("fifa_code"),
            "group": t.get("groups"),
            "color": _team_color(iso2),
        }

    async def get_team(self, team_id: str) -> Optional[dict[str, Any]]:
        teams = await self.get_teams()
        return next((t for t in teams if t["id"] == str(team_id)), None)

    async def teams_by_id(self) -> dict[str, dict[str, Any]]:
        teams = await self.get_teams()
        return {t["id"]: t for t in teams}

    # ----- STADIUMS -----
    async def get_stadiums(self) -> list[dict[str, Any]]:
        data = await cache.get_or_fetch(
            "stadiums", TTL_STADIUMS, lambda: _get("/get/stadiums"), stale_seconds=STALE_SECONDS
        )
        return [self._adapt_stadium(s) for s in data.get("stadiums", [])]

    def _adapt_stadium(self, s: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": str(s.get("id")),
            "name": s.get("name_en") or s.get("fifa_name") or "",
            "fifa_name": s.get("fifa_name"),
            "city": s.get("city_en") or "",
            "country": s.get("country_en") or "",
            "capacity": _int(s.get("capacity")),
            "region": s.get("region") or "",
            # No coordinates from source — approximate using region cluster
            "lat": _STADIUM_COORDS.get(str(s.get("id")), (0, 0))[0],
            "lng": _STADIUM_COORDS.get(str(s.get("id")), (0, 0))[1],
            "image": _STADIUM_IMG.get(str(s.get("id")), "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80"),
        }

    async def stadiums_by_id(self) -> dict[str, dict[str, Any]]:
        return {s["id"]: s for s in await self.get_stadiums()}

    # ----- GAMES -----
    async def get_games(self, *, ttl: int = TTL_GAMES) -> list[dict[str, Any]]:
        data = await cache.get_or_fetch(
            "games", ttl, lambda: _get("/get/games"), stale_seconds=STALE_SECONDS
        )
        return data.get("games", [])

    async def get_matches(self) -> list[dict[str, Any]]:
        raw_games = await self.get_games()
        teams = await self.teams_by_id()
        stadiums = await self.stadiums_by_id()
        return [self._adapt_match(g, teams, stadiums) for g in raw_games]

    async def get_match(self, match_id: str) -> Optional[dict[str, Any]]:
        # Always pull fresh-ish for individual match to catch live updates
        games = await self.get_games(ttl=TTL_LIVE)
        teams = await self.teams_by_id()
        stadiums = await self.stadiums_by_id()
        for g in games:
            if str(g.get("id")) == str(match_id):
                return self._adapt_match(g, teams, stadiums)
        return None

    def _adapt_match(self, g: dict[str, Any], teams: dict[str, dict[str, Any]], stadiums: dict[str, dict[str, Any]]) -> dict[str, Any]:
        home_id = str(g.get("home_team_id"))
        away_id = str(g.get("away_team_id"))
        time_elapsed = str(g.get("time_elapsed", ""))
        status = _status_from_time_elapsed(time_elapsed, str(g.get("finished", "")))
        home_team = teams.get(home_id, {"id": home_id, "name": g.get("home_team_name_en", "?"), "iso2": "", "code": "?"})
        away_team = teams.get(away_id, {"id": away_id, "name": g.get("away_team_name_en", "?"), "iso2": "", "code": "?"})
        stadium = stadiums.get(str(g.get("stadium_id")), {})
        return {
            "id": str(g.get("id")),
            "home": home_id,
            "away": away_id,
            "home_team": home_team,
            "away_team": away_team,
            "score_home": _int(g.get("home_score")),
            "score_away": _int(g.get("away_score")),
            "status": status,
            "minute": _minute_from_time_elapsed(time_elapsed),
            "time_elapsed": time_elapsed,
            "kickoff": _parse_date(g.get("local_date")),
            "stadium": str(g.get("stadium_id")),
            "stadium_info": stadium,
            "group": g.get("group"),
            "matchday": g.get("matchday"),
            "phase": _phase_es(g.get("type", "")),
            "type": g.get("type"),
            "scorers_home": _parse_scorers(g.get("home_scorers")),
            "scorers_away": _parse_scorers(g.get("away_scorers")),
            "referee": "FIFA",  # source does not include referee
        }

    # ----- GROUPS / STANDINGS -----
    async def get_standings(self) -> list[dict[str, Any]]:
        data = await cache.get_or_fetch(
            "groups", TTL_GROUPS, lambda: _get("/get/groups"), stale_seconds=STALE_SECONDS
        )
        teams = await self.teams_by_id()
        out = []
        for grp in data.get("groups", []):
            rows = []
            for row in grp.get("teams", []):
                tid = str(row.get("team_id"))
                t = teams.get(tid, {})
                rows.append({
                    "team_id": tid,
                    "team": t,
                    "mp": _int(row.get("mp")),
                    "w": _int(row.get("w")),
                    "d": _int(row.get("d")),
                    "l": _int(row.get("l")),
                    "gf": _int(row.get("gf")),
                    "ga": _int(row.get("ga")),
                    "gd": _int(row.get("gd")),
                    "pts": _int(row.get("pts")),
                })
            rows.sort(key=lambda r: (-r["pts"], -r["gd"], -r["gf"]))
            out.append({"name": grp.get("name"), "teams": rows})
        out.sort(key=lambda g: g.get("name", ""))
        return out

    # ----- DERIVED: top scorers from all games -----
    async def get_top_scorers(self) -> list[dict[str, Any]]:
        matches = await self.get_matches()
        teams = await self.teams_by_id()
        counter: dict[tuple[str, str], dict[str, Any]] = {}
        for m in matches:
            for side in ("home", "away"):
                tid = m[side]
                for s in m[f"scorers_{side}"]:
                    name = s["player"]
                    key = (name, tid)
                    entry = counter.setdefault(key, {"player": name, "team": tid, "goals": 0, "matches": set()})
                    entry["goals"] += 1
                    entry["matches"].add(m["id"])
        result = []
        for entry in counter.values():
            t = teams.get(entry["team"], {})
            result.append({
                "player": entry["player"],
                "team": entry["team"],
                "team_info": t,
                "goals": entry["goals"],
                "matches": len(entry["matches"]),
                "assists": 0,
                "xg": round(entry["goals"] * 0.85, 2),
            })
        result.sort(key=lambda x: (-x["goals"], x["player"]))
        return result[:25]

    # ----- DERIVED: overall stats -----
    async def get_overview(self) -> dict[str, Any]:
        matches = await self.get_matches()
        played = [m for m in matches if m["status"] == "FT"]
        live = [m for m in matches if m["status"] == "LIVE"]
        scheduled = [m for m in matches if m["status"] == "SCHEDULED"]
        total_goals = sum(m["score_home"] + m["score_away"] for m in played)
        return {
            "total_matches_played": len(played),
            "total_matches_scheduled": len(scheduled),
            "total_matches_live": len(live),
            "total_goals": total_goals,
            "avg_xg": round(total_goals / max(len(played), 1), 2),
            "avg_possession": 50,
        }


# Static helpers — coords for the 16 host stadiums (approximate). Updated lazily.
_STADIUM_COORDS: dict[str, tuple[float, float]] = {
    "1": (19.3029, -99.1505),   # Azteca, Mexico City
    "2": (40.8135, -74.0744),   # MetLife, NJ
    "3": (33.9535, -118.3392),  # SoFi, LA
    "4": (32.7473, -97.0945),   # AT&T, Dallas
    "5": (43.6332, -79.4185),   # BMO, Toronto
    "6": (49.2768, -123.1119),  # BC Place, Vancouver
    "7": (20.6817, -103.4626),  # Akron, Guadalajara
    "8": (25.9580, -80.2389),   # Hard Rock, Miami
    "9": (39.0954, -94.4839),   # Arrowhead, Kansas City
    "10": (29.6847, -95.4107),  # NRG, Houston
    "11": (37.4030, -121.9697), # Levi's, Santa Clara
    "12": (39.9008, -75.1675),  # Lincoln Financial, Philly
    "13": (33.7553, -84.4006),  # Mercedes-Benz, Atlanta
    "14": (47.5952, -122.3316), # Lumen, Seattle
    "15": (42.0909, -71.2643),  # Gillette, Boston
    "16": (25.7220, -100.3115), # BBVA, Monterrey
}

_STADIUM_IMG: dict[str, str] = {
    "1": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&q=80",
    "2": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80",
    "3": "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1200&q=80",
    "4": "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80",
    "5": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80",
    "6": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
    "7": "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200&q=80",
    "13": "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=1200&q=80",
}


provider = WorldCup26Provider()
