"""WorldCup Nexus backend tests."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://worldcup-nexus.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
TIMEOUT = 90


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Core ----------
def test_root(client):
    r = client.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["name"] == "WorldCup Nexus"
    assert d["edition"] == "2026"


def test_teams_list(client):
    r = client.get(f"{API}/teams", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert len(d) == 16
    assert all("flag" in t and "ranking" in t and "titles" in t for t in d)


def test_team_detail_arg(client):
    r = client.get(f"{API}/teams/arg", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["id"] == "arg"
    assert "players" in d and len(d["players"]) >= 5
    assert "history" in d and "wins" in d["history"]


def test_team_not_found(client):
    r = client.get(f"{API}/teams/xxx", timeout=30)
    assert r.status_code == 404


# ---------- Matches ----------
def test_matches_list(client):
    r = client.get(f"{API}/matches", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert len(d) == 12
    m = d[0]
    assert m["home_team"] and m["away_team"] and m["stadium_info"]


def test_matches_next_live(client):
    r = client.get(f"{API}/matches/next", timeout=30)
    assert r.status_code == 200
    d = r.json()
    # Live match m6 should be returned
    assert d["id"] == "m6"
    assert d["home"] == "ned" and d["away"] == "usa"


def test_match_m6_live(client):
    r = client.get(f"{API}/matches/m6", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["status"] == "LIVE"
    assert "live" in d
    live = d["live"]
    for k in ("possession", "xg", "shots", "events", "momentum"):
        assert k in live, f"missing {k}"
    assert isinstance(live["momentum"], list) and len(live["momentum"]) > 0


# ---------- Stadiums ----------
def test_stadiums_list(client):
    r = client.get(f"{API}/stadiums", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert len(d) == 8
    assert all("lat" in s and "lng" in s and "capacity" in s and "image" in s for s in d)


def test_stadium_detail(client):
    r = client.get(f"{API}/stadiums/azteca", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["id"] == "azteca"
    assert "matches" in d


# ---------- Stats ----------
def test_top_scorers(client):
    r = client.get(f"{API}/stats/top-scorers", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert len(d) >= 5
    assert d[0]["team_info"] is not None


def test_top_assists(client):
    r = client.get(f"{API}/stats/top-assists", timeout=30)
    assert r.status_code == 200
    assert len(r.json()) >= 3


def test_stats_overview(client):
    r = client.get(f"{API}/stats/overview", timeout=30)
    assert r.status_code == 200
    d = r.json()
    for k in ("total_matches_played", "total_goals", "team_radar"):
        assert k in d


# ---------- Timeline ----------
def test_timeline(client):
    r = client.get(f"{API}/timeline", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert len(d) == 22
    assert d[0]["year"] == 1930
    assert d[-1]["year"] == 2026


# ---------- Fan ----------
def test_fan_dashboard(client):
    r = client.get(f"{API}/fan/arg", timeout=30)
    assert r.status_code == 200
    d = r.json()
    for k in ("team", "upcoming", "recent", "live", "next_rivals"):
        assert k in d


# ---------- AI ----------
def test_ai_predict(client):
    r = client.post(f"{API}/ai/predict-match", json={"home_id": "arg", "away_id": "fra"}, timeout=TIMEOUT)
    assert r.status_code == 200, r.text
    d = r.json()
    for k in ("prob_home", "prob_draw", "prob_away", "analysis"):
        assert k in d, f"missing {k}"


def test_ai_simulate(client):
    r = client.post(f"{API}/ai/simulate-match", json={"home_id": "bra", "away_id": "esp"}, timeout=TIMEOUT)
    assert r.status_code == 200, r.text
    d = r.json()
    assert "result" in d
    res = d["result"]
    for k in ("score_home", "score_away", "mvp", "narrative"):
        assert k in res, f"missing {k}"


def test_ai_story(client):
    r = client.get(f"{API}/ai/story/arg", timeout=TIMEOUT)
    assert r.status_code == 200, r.text
    d = r.json()
    for k in ("chapters", "legends", "iconic_moment", "tagline"):
        assert k in d, f"missing {k}"


def test_ai_rivality(client):
    r = client.post(f"{API}/ai/rivality", json={"team_a": "arg", "team_b": "bra"}, timeout=TIMEOUT)
    assert r.status_code == 200, r.text
    d = r.json()
    assert "result" in d
    res = d["result"]
    for k in ("wins_a", "draws", "wins_b", "analysis", "historic_matches"):
        assert k in res, f"missing {k}"
