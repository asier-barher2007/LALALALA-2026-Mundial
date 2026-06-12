"""AI service using Emergent LLM (Claude Sonnet 4.5)."""
import os
import json
import uuid
from emergentintegrations.llm.chat import LlmChat, UserMessage

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-sonnet-4-5-20250929"


def _new_chat(system_message: str) -> LlmChat:
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"wcn-{uuid.uuid4().hex[:8]}",
        system_message=system_message,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)


def _extract_json(text: str):
    """Try to extract a JSON object from text."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        try:
            return json.loads(text[start:end + 1])
        except Exception:
            pass
    return None


async def simulate_match(home: dict, away: dict) -> dict:
    """Simulate a single match using stats."""
    system = (
        "Eres un analista deportivo experto en simulaciones del Mundial de Fútbol. "
        "Devuelves SIEMPRE únicamente un objeto JSON válido, sin texto extra."
    )
    prompt = f"""
Simula el resultado de este partido del Mundial 2026 utilizando los datos:

LOCAL: {home['name']} | Ranking FIFA: {home['ranking']} | Títulos: {home['titles']} | Confederación: {home['confederation']}
VISITANTE: {away['name']} | Ranking FIFA: {away['ranking']} | Títulos: {away['titles']} | Confederación: {away['confederation']}

Devuelve un JSON exacto con este formato:
{{
  "score_home": <int>,
  "score_away": <int>,
  "prob_home": <float 0-1>,
  "prob_draw": <float 0-1>,
  "prob_away": <float 0-1>,
  "xg_home": <float>,
  "xg_away": <float>,
  "scorers_home": ["jugador 1", "jugador 2"],
  "scorers_away": ["jugador 1"],
  "mvp": "Nombre del jugador",
  "narrative": "Resumen del partido en 2-3 frases en español"
}}
Las probabilidades deben sumar 1.0.
""".strip()

    chat = _new_chat(system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = _extract_json(resp if isinstance(resp, str) else str(resp))
    if not data:
        # Fallback deterministic
        diff = away["ranking"] - home["ranking"]
        return {
            "score_home": max(0, 1 + (1 if diff > 0 else 0)),
            "score_away": max(0, 1 + (1 if diff < 0 else 0)),
            "prob_home": 0.4, "prob_draw": 0.3, "prob_away": 0.3,
            "xg_home": 1.5, "xg_away": 1.2,
            "scorers_home": [], "scorers_away": [],
            "mvp": "Jugador destacado",
            "narrative": "Simulación generada con base estadística.",
        }
    return data


async def predict_match(home: dict, away: dict) -> dict:
    """Pre-match prediction."""
    system = "Eres un analista de datos del Mundial. Respondes SOLO con JSON válido."
    prompt = f"""
Analiza este partido próximo del Mundial 2026:
{home['name']} (Ranking {home['ranking']}, {home['titles']} títulos) vs {away['name']} (Ranking {away['ranking']}, {away['titles']} títulos)

Devuelve JSON:
{{
  "prob_home": <float 0-1>,
  "prob_draw": <float 0-1>,
  "prob_away": <float 0-1>,
  "expected_goals_home": <float>,
  "expected_goals_away": <float>,
  "key_players_home": ["jugador 1", "jugador 2"],
  "key_players_away": ["jugador 1", "jugador 2"],
  "form_home": "1 frase sobre forma reciente",
  "form_away": "1 frase sobre forma reciente",
  "analysis": "Análisis táctico breve en español, 3-4 frases."
}}
Probabilidades deben sumar 1.0.
""".strip()
    chat = _new_chat(system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = _extract_json(resp if isinstance(resp, str) else str(resp))
    if not data:
        return {
            "prob_home": 0.4, "prob_draw": 0.3, "prob_away": 0.3,
            "expected_goals_home": 1.4, "expected_goals_away": 1.2,
            "key_players_home": [], "key_players_away": [],
            "form_home": "Equipo en evolución.",
            "form_away": "Equipo en evolución.",
            "analysis": "Partido equilibrado según métricas históricas.",
        }
    return data


async def story_mode(team: dict) -> dict:
    """Generate narrative for team Story Mode."""
    system = "Eres un narrador deportivo. Respondes SOLO con JSON válido."
    prompt = f"""
Crea una narrativa visual de la historia de {team['name']} en el Mundial.
Datos: Confederación {team['confederation']}, {team['titles']} títulos, {team['appearances']} participaciones, mejor: {team['best']}, debut {team['debut']}.

Devuelve JSON:
{{
  "chapters": [
    {{"title": "Capítulo 1: Los orígenes", "year": <int>, "narrative": "2-3 frases evocadoras en español"}},
    {{"title": "Capítulo 2: ...", "year": <int>, "narrative": "..."}},
    {{"title": "Capítulo 3: ...", "year": <int>, "narrative": "..."}},
    {{"title": "Capítulo 4: La actualidad", "year": 2026, "narrative": "..."}}
  ],
  "legends": ["Leyenda 1", "Leyenda 2", "Leyenda 3"],
  "iconic_moment": "Descripción del momento más icónico en 2 frases.",
  "tagline": "Frase impactante de 6-10 palabras sobre la selección"
}}
""".strip()
    chat = _new_chat(system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = _extract_json(resp if isinstance(resp, str) else str(resp))
    if not data:
        return {
            "chapters": [{"title": "Historia", "year": team["debut"], "narrative": f"{team['name']} debutó en {team['debut']}."}],
            "legends": [], "iconic_moment": "", "tagline": team["name"].upper(),
        }
    return data


async def rivality_analysis(team_a: dict, team_b: dict) -> dict:
    """Head-to-head analysis."""
    system = "Eres un historiador del fútbol. Respondes SOLO con JSON válido."
    prompt = f"""
Compara históricamente a {team_a['name']} y {team_b['name']} en el Mundial.
{team_a['name']}: {team_a['titles']} títulos, {team_a['appearances']} participaciones.
{team_b['name']}: {team_b['titles']} títulos, {team_b['appearances']} participaciones.

Devuelve JSON:
{{
  "total_matches": <int estimado>,
  "wins_a": <int>,
  "draws": <int>,
  "wins_b": <int>,
  "goals_a": <int>,
  "goals_b": <int>,
  "historic_matches": [
    {{"year": <int>, "stage": "Final/Semifinal/etc", "result": "X-Y", "winner": "{team_a['name']}/{team_b['name']}/Empate"}}
  ],
  "key_players": {{"a": ["jugador"], "b": ["jugador"]}},
  "prob_a": <float 0-1>,
  "prob_draw": <float 0-1>,
  "prob_b": <float 0-1>,
  "analysis": "Análisis histórico en 3-4 frases en español"
}}
""".strip()
    chat = _new_chat(system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = _extract_json(resp if isinstance(resp, str) else str(resp))
    if not data:
        return {
            "total_matches": 0, "wins_a": 0, "draws": 0, "wins_b": 0,
            "goals_a": 0, "goals_b": 0, "historic_matches": [],
            "key_players": {"a": [], "b": []},
            "prob_a": 0.4, "prob_draw": 0.3, "prob_b": 0.3,
            "analysis": "Sin datos suficientes.",
        }
    return data


async def simulate_group(teams: list) -> dict:
    """Simulate full group standings."""
    system = "Eres un analista del Mundial. Respondes SOLO con JSON válido."
    names = [t["name"] for t in teams]
    prompt = f"""
Simula la fase de grupos con estos 4 equipos: {', '.join(names)}.
Datos de ranking: {', '.join([f"{t['name']}={t['ranking']}" for t in teams])}.

Devuelve JSON:
{{
  "standings": [
    {{"team": "nombre", "played": 3, "wins": <int>, "draws": <int>, "losses": <int>, "gf": <int>, "ga": <int>, "points": <int>}}
  ],
  "qualified": ["nombre1", "nombre2"],
  "analysis": "Resumen del grupo en 2-3 frases en español"
}}
Ordena standings por puntos desc.
""".strip()
    chat = _new_chat(system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = _extract_json(resp if isinstance(resp, str) else str(resp))
    return data or {"standings": [], "qualified": [], "analysis": "Sin datos."}
