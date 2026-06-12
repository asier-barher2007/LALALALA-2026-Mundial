from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
import os
import logging
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from data import (
    TEAMS, TEAM_BY_ID, STADIUMS, STADIUM_BY_ID,
    MATCHES, MATCH_BY_ID, LIVE_STATS, TOP_SCORERS, TOP_ASSISTS,
    TIMELINE, players_for, WORLD_CUP_EDITION, WORLD_CUP_NAME,
)
from ai_service import (
    simulate_match, predict_match, story_mode,
    rivality_analysis, simulate_group,
)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="WorldCup Nexus API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ---------------- Health ----------------
@api.get("/")
async def root():
    return {"name": "WorldCup Nexus", "edition": WORLD_CUP_EDITION, "status": "ok"}


# ---------------- Teams ----------------
@api.get("/teams")
async def list_teams():
    return TEAMS


@api.get("/teams/{team_id}")
async def get_team(team_id: str):
    team = TEAM_BY_ID.get(team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    return {
        **team,
        "players": players_for(team_id),
        "history": {
            "wins": team["appearances"] * 3 + team["titles"] * 2,
            "draws": team["appearances"] * 2,
            "losses": team["appearances"] * 2,
            "goals_for": team["appearances"] * 8 + team["titles"] * 5,
            "goals_against": team["appearances"] * 6,
        },
    }


# ---------------- Stadiums ----------------
@api.get("/stadiums")
async def list_stadiums():
    return STADIUMS


@api.get("/stadiums/{stadium_id}")
async def get_stadium(stadium_id: str):
    s = STADIUM_BY_ID.get(stadium_id)
    if not s:
        raise HTTPException(404, "Stadium not found")
    matches = [m for m in MATCHES if m["stadium"] == stadium_id]
    return {**s, "matches": matches}


# ---------------- Matches ----------------
def _enrich_match(m: dict) -> dict:
    return {
        **m,
        "home_team": TEAM_BY_ID.get(m["home"]),
        "away_team": TEAM_BY_ID.get(m["away"]),
        "stadium_info": STADIUM_BY_ID.get(m["stadium"]),
    }


@api.get("/matches")
async def list_matches(status: Optional[str] = None):
    items = MATCHES
    if status:
        items = [m for m in items if m["status"] == status]
    return [_enrich_match(m) for m in items]


@api.get("/matches/next")
async def next_match():
    now = datetime.now(timezone.utc)
    # First any LIVE
    live = [m for m in MATCHES if m["status"] == "LIVE"]
    if live:
        return _enrich_match(live[0])
    upcoming = [m for m in MATCHES if m["status"] == "SCHEDULED"]
    upcoming.sort(key=lambda m: m["kickoff"])
    if not upcoming:
        raise HTTPException(404, "No upcoming match")
    return _enrich_match(upcoming[0])


@api.get("/matches/{match_id}")
async def get_match(match_id: str):
    m = MATCH_BY_ID.get(match_id)
    if not m:
        raise HTTPException(404, "Match not found")
    out = _enrich_match(m)
    if m["status"] == "LIVE":
        out["live"] = LIVE_STATS.get(match_id, {})
        # Simulate slight live variance for momentum
        if "live" in out and "momentum" in out["live"]:
            base = list(out["live"]["momentum"])
            if base:
                base[-1] = max(-100, min(100, base[-1] + random.randint(-8, 8)))
            out["live"] = {**out["live"], "momentum": base}
    return out


# ---------------- Stats ----------------
@api.get("/stats/top-scorers")
async def get_top_scorers():
    return [{**s, "team_info": TEAM_BY_ID.get(s["team"])} for s in TOP_SCORERS]


@api.get("/stats/top-assists")
async def get_top_assists():
    return [{**s, "team_info": TEAM_BY_ID.get(s["team"])} for s in TOP_ASSISTS]


@api.get("/stats/overview")
async def get_stats_overview():
    return {
        "total_matches_played": sum(1 for m in MATCHES if m["status"] == "FT"),
        "total_matches_scheduled": sum(1 for m in MATCHES if m["status"] == "SCHEDULED"),
        "total_matches_live": sum(1 for m in MATCHES if m["status"] == "LIVE"),
        "total_goals": sum(m["score_home"] + m["score_away"] for m in MATCHES if m["status"] == "FT"),
        "avg_xg": 2.4,
        "avg_possession": 50,
        "clean_sheets": [
            {"team": "fra", "team_info": TEAM_BY_ID["fra"], "count": 3},
            {"team": "esp", "team_info": TEAM_BY_ID["esp"], "count": 2},
            {"team": "arg", "team_info": TEAM_BY_ID["arg"], "count": 2},
        ],
        "team_radar": {
            "fra": {"attack": 92, "defense": 86, "possession": 78, "speed": 90, "creativity": 85},
            "arg": {"attack": 90, "defense": 84, "possession": 82, "speed": 80, "creativity": 92},
            "bra": {"attack": 91, "defense": 80, "possession": 84, "speed": 88, "creativity": 90},
            "esp": {"attack": 86, "defense": 82, "possession": 92, "speed": 75, "creativity": 88},
        },
    }


# ---------------- Timeline ----------------
@api.get("/timeline")
async def get_timeline():
    out = []
    for t in TIMELINE:
        item = {**t}
        if t.get("champion"):
            item["champion_info"] = TEAM_BY_ID.get(t["champion"])
        if t.get("runnerup"):
            item["runnerup_info"] = TEAM_BY_ID.get(t["runnerup"])
        out.append(item)
    return out


# ---------------- AI Endpoints ----------------
class SimulatePayload(BaseModel):
    home_id: str
    away_id: str


@api.post("/ai/simulate-match")
async def ai_simulate(payload: SimulatePayload):
    home = TEAM_BY_ID.get(payload.home_id)
    away = TEAM_BY_ID.get(payload.away_id)
    if not home or not away:
        raise HTTPException(404, "Team not found")
    result = await simulate_match(home, away)
    return {"home": home, "away": away, "result": result}


@api.post("/ai/predict-match")
async def ai_predict(payload: SimulatePayload):
    home = TEAM_BY_ID.get(payload.home_id)
    away = TEAM_BY_ID.get(payload.away_id)
    if not home or not away:
        raise HTTPException(404, "Team not found")
    return await predict_match(home, away)


@api.get("/ai/story/{team_id}")
async def ai_story(team_id: str):
    team = TEAM_BY_ID.get(team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    return await story_mode(team)


class RivalityPayload(BaseModel):
    team_a: str
    team_b: str


@api.post("/ai/rivality")
async def ai_rivality(payload: RivalityPayload):
    a = TEAM_BY_ID.get(payload.team_a)
    b = TEAM_BY_ID.get(payload.team_b)
    if not a or not b:
        raise HTTPException(404, "Team not found")
    result = await rivality_analysis(a, b)
    return {"team_a": a, "team_b": b, "result": result}


class GroupPayload(BaseModel):
    team_ids: list[str]


@api.post("/ai/simulate-group")
async def ai_group(payload: GroupPayload):
    teams = [TEAM_BY_ID[t] for t in payload.team_ids if t in TEAM_BY_ID]
    if len(teams) < 2:
        raise HTTPException(400, "Need at least 2 teams")
    return await simulate_group(teams)


# ---------------- Fan Dashboard ----------------
@api.get("/fan/{team_id}")
async def fan_dashboard(team_id: str):
    team = TEAM_BY_ID.get(team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    team_matches = [m for m in MATCHES if m["home"] == team_id or m["away"] == team_id]
    upcoming = [_enrich_match(m) for m in team_matches if m["status"] == "SCHEDULED"]
    recent = [_enrich_match(m) for m in team_matches if m["status"] == "FT"]
    return {
        "team": team,
        "upcoming": upcoming,
        "recent": recent,
        "live": [_enrich_match(m) for m in team_matches if m["status"] == "LIVE"],
        "next_rivals": [_enrich_match(m) for m in team_matches if m["status"] == "SCHEDULED"][:3],
    }


# ---------------- Notifications (mock) ----------------
class NotificationSub(BaseModel):
    user_id: str
    match_id: str
    reminders: list[str]  # ["24h", "1h", "15m", "start"]


@api.post("/notifications/subscribe")
async def subscribe_notifications(sub: NotificationSub):
    doc = sub.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.notifications.insert_one(doc)
    return {"ok": True, "subscribed": True, **doc}


@api.get("/notifications/{user_id}")
async def list_notifications(user_id: str):
    items = await db.notifications.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return items


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
