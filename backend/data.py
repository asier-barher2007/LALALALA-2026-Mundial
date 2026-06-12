"""Mock data for WorldCup Nexus - World Cup 2026 (USA/Canada/Mexico)."""
from datetime import datetime, timezone, timedelta

WORLD_CUP_EDITION = "2026"
WORLD_CUP_NAME = "FIFA World Cup 2026"

# ---------------- TEAMS ----------------
# Code, name (es/en), federation, confederation, coach, ranking, group, colors, flagEmoji
TEAMS = [
    {"id": "arg", "code": "ARG", "name": "Argentina", "flag": "🇦🇷", "confederation": "CONMEBOL", "federation": "AFA", "coach": "Lionel Scaloni", "ranking": 1, "group": "A", "color": "#75AADB", "titles": 3, "appearances": 18, "best": "Campeón (1978, 1986, 2022)", "debut": 1930},
    {"id": "fra", "code": "FRA", "name": "Francia", "name_en": "France", "flag": "🇫🇷", "confederation": "UEFA", "federation": "FFF", "coach": "Didier Deschamps", "ranking": 2, "group": "B", "color": "#0055A4", "titles": 2, "appearances": 16, "best": "Campeón (1998, 2018)", "debut": 1930},
    {"id": "esp", "code": "ESP", "name": "España", "name_en": "Spain", "flag": "🇪🇸", "confederation": "UEFA", "federation": "RFEF", "coach": "Luis de la Fuente", "ranking": 3, "group": "C", "color": "#C60B1E", "titles": 1, "appearances": 16, "best": "Campeón (2010)", "debut": 1934},
    {"id": "eng", "code": "ENG", "name": "Inglaterra", "name_en": "England", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "confederation": "UEFA", "federation": "FA", "coach": "Thomas Tuchel", "ranking": 4, "group": "D", "color": "#FFFFFF", "titles": 1, "appearances": 16, "best": "Campeón (1966)", "debut": 1950},
    {"id": "bra", "code": "BRA", "name": "Brasil", "name_en": "Brazil", "flag": "🇧🇷", "confederation": "CONMEBOL", "federation": "CBF", "coach": "Carlo Ancelotti", "ranking": 5, "group": "E", "color": "#FEDF00", "titles": 5, "appearances": 22, "best": "Campeón (1958, 1962, 1970, 1994, 2002)", "debut": 1930},
    {"id": "ned", "code": "NED", "name": "Países Bajos", "name_en": "Netherlands", "flag": "🇳🇱", "confederation": "UEFA", "federation": "KNVB", "coach": "Ronald Koeman", "ranking": 6, "group": "F", "color": "#FF6600", "titles": 0, "appearances": 11, "best": "Subcampeón (1974, 1978, 2010)", "debut": 1934},
    {"id": "por", "code": "POR", "name": "Portugal", "flag": "🇵🇹", "confederation": "UEFA", "federation": "FPF", "coach": "Roberto Martínez", "ranking": 7, "group": "G", "color": "#006600", "titles": 0, "appearances": 8, "best": "Tercer lugar (1966)", "debut": 1966},
    {"id": "ger", "code": "GER", "name": "Alemania", "name_en": "Germany", "flag": "🇩🇪", "confederation": "UEFA", "federation": "DFB", "coach": "Julian Nagelsmann", "ranking": 8, "group": "H", "color": "#000000", "titles": 4, "appearances": 21, "best": "Campeón (1954, 1974, 1990, 2014)", "debut": 1934},
    {"id": "ita", "code": "ITA", "name": "Italia", "name_en": "Italy", "flag": "🇮🇹", "confederation": "UEFA", "federation": "FIGC", "coach": "Gennaro Gattuso", "ranking": 9, "group": "A", "color": "#0072B5", "titles": 4, "appearances": 18, "best": "Campeón (1934, 1938, 1982, 2006)", "debut": 1934},
    {"id": "uru", "code": "URU", "name": "Uruguay", "flag": "🇺🇾", "confederation": "CONMEBOL", "federation": "AUF", "coach": "Marcelo Bielsa", "ranking": 10, "group": "B", "color": "#5CBFEB", "titles": 2, "appearances": 14, "best": "Campeón (1930, 1950)", "debut": 1930},
    {"id": "bel", "code": "BEL", "name": "Bélgica", "name_en": "Belgium", "flag": "🇧🇪", "confederation": "UEFA", "federation": "URBSFA", "coach": "Domenico Tedesco", "ranking": 11, "group": "C", "color": "#FFD700", "titles": 0, "appearances": 14, "best": "Tercer lugar (2018)", "debut": 1930},
    {"id": "cro", "code": "CRO", "name": "Croacia", "name_en": "Croatia", "flag": "🇭🇷", "confederation": "UEFA", "federation": "HNS", "coach": "Zlatko Dalić", "ranking": 12, "group": "D", "color": "#FF0000", "titles": 0, "appearances": 6, "best": "Subcampeón (2018)", "debut": 1998},
    {"id": "mex", "code": "MEX", "name": "México", "name_en": "Mexico", "flag": "🇲🇽", "confederation": "CONCACAF", "federation": "FMF", "coach": "Javier Aguirre", "ranking": 13, "group": "E", "color": "#006847", "titles": 0, "appearances": 17, "best": "Cuartos (1970, 1986)", "debut": 1930},
    {"id": "usa", "code": "USA", "name": "Estados Unidos", "name_en": "United States", "flag": "🇺🇸", "confederation": "CONCACAF", "federation": "USSF", "coach": "Mauricio Pochettino", "ranking": 14, "group": "F", "color": "#B22234", "titles": 0, "appearances": 11, "best": "Tercer lugar (1930)", "debut": 1930},
    {"id": "jpn", "code": "JPN", "name": "Japón", "name_en": "Japan", "flag": "🇯🇵", "confederation": "AFC", "federation": "JFA", "coach": "Hajime Moriyasu", "ranking": 15, "group": "G", "color": "#BC002D", "titles": 0, "appearances": 7, "best": "Octavos (2002, 2010, 2018, 2022)", "debut": 1998},
    {"id": "mar", "code": "MAR", "name": "Marruecos", "name_en": "Morocco", "flag": "🇲🇦", "confederation": "CAF", "federation": "FRMF", "coach": "Walid Regragui", "ranking": 16, "group": "H", "color": "#C1272D", "titles": 0, "appearances": 6, "best": "Cuarto lugar (2022)", "debut": 1970},
]

TEAM_BY_ID = {t["id"]: t for t in TEAMS}

# ---------------- STADIUMS ----------------
STADIUMS = [
    {"id": "azteca", "name": "Estadio Azteca", "city": "Ciudad de México", "country": "México", "lat": 19.3029, "lng": -99.1505, "capacity": 87000, "image": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80"},
    {"id": "metlife", "name": "MetLife Stadium", "city": "New Jersey", "country": "Estados Unidos", "lat": 40.8135, "lng": -74.0744, "capacity": 82500, "image": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80"},
    {"id": "sofi", "name": "SoFi Stadium", "city": "Los Angeles", "country": "Estados Unidos", "lat": 33.9535, "lng": -118.3392, "capacity": 70240, "image": "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80"},
    {"id": "att", "name": "AT&T Stadium", "city": "Dallas", "country": "Estados Unidos", "lat": 32.7473, "lng": -97.0945, "capacity": 80000, "image": "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80"},
    {"id": "bmo", "name": "BMO Field", "city": "Toronto", "country": "Canadá", "lat": 43.6332, "lng": -79.4185, "capacity": 45000, "image": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80"},
    {"id": "bcplace", "name": "BC Place", "city": "Vancouver", "country": "Canadá", "lat": 49.2768, "lng": -123.1119, "capacity": 54500, "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80"},
    {"id": "akron", "name": "Estadio Akron", "city": "Guadalajara", "country": "México", "lat": 20.6817, "lng": -103.4626, "capacity": 49850, "image": "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=80"},
    {"id": "mercedes", "name": "Mercedes-Benz Stadium", "city": "Atlanta", "country": "Estados Unidos", "lat": 33.7553, "lng": -84.4006, "capacity": 71000, "image": "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80"},
]

STADIUM_BY_ID = {s["id"]: s for s in STADIUMS}

# ---------------- MATCHES ----------------
# Generate sample fixtures
def _now():
    return datetime.now(timezone.utc)

_BASE = _now()

def _match(mid, home, away, hours_offset, stadium, group, phase="Fase de grupos", status=None, score=(0, 0), minute=None, referee="Daniele Orsato"):
    kickoff = _BASE + timedelta(hours=hours_offset)
    if status is None:
        if hours_offset < -2:
            status = "FT"
        elif -2 <= hours_offset <= 0:
            status = "LIVE"
        else:
            status = "SCHEDULED"
    return {
        "id": mid,
        "home": home,
        "away": away,
        "kickoff": kickoff.isoformat(),
        "stadium": stadium,
        "group": group,
        "phase": phase,
        "status": status,
        "score_home": score[0],
        "score_away": score[1],
        "minute": minute,
        "referee": referee,
    }

MATCHES = [
    # Past
    _match("m1", "arg", "ita", -120, "azteca", "A", score=(2, 1), referee="Anthony Taylor"),
    _match("m2", "fra", "uru", -96, "metlife", "B", score=(1, 1), referee="Szymon Marciniak"),
    _match("m3", "esp", "bel", -72, "sofi", "C", score=(3, 0), referee="Felix Zwayer"),
    _match("m4", "eng", "cro", -48, "att", "D", score=(2, 2), referee="Clement Turpin"),
    _match("m5", "bra", "mex", -24, "akron", "E", score=(2, 0), referee="Mateu Lahoz"),
    # Live (right now)
    _match("m6", "ned", "usa", -1, "bmo", "F", status="LIVE", score=(1, 1), minute=67, referee="Daniele Orsato"),
    # Upcoming (next is m7 - in a few hours)
    _match("m7", "por", "jpn", 4, "bcplace", "G"),
    _match("m8", "ger", "mar", 28, "mercedes", "H"),
    _match("m9", "arg", "fra", 52, "metlife", "A", phase="Octavos de final"),
    _match("m10", "esp", "bra", 76, "sofi", "C", phase="Octavos de final"),
    _match("m11", "eng", "por", 100, "att", "D", phase="Octavos de final"),
    _match("m12", "ger", "ned", 124, "azteca", "H", phase="Octavos de final"),
]

MATCH_BY_ID = {m["id"]: m for m in MATCHES}

# Live stats for live matches
LIVE_STATS = {
    "m6": {
        "possession": {"home": 58, "away": 42},
        "shots": {"home": 12, "away": 7},
        "shots_on_target": {"home": 5, "away": 3},
        "xg": {"home": 1.8, "away": 1.2},
        "passes": {"home": 412, "away": 298},
        "pass_accuracy": {"home": 89, "away": 81},
        "corners": {"home": 6, "away": 3},
        "fouls": {"home": 8, "away": 11},
        "yellow_cards": {"home": 1, "away": 2},
        "red_cards": {"home": 0, "away": 0},
        "events": [
            {"minute": 14, "type": "goal", "team": "home", "player": "Cody Gakpo", "detail": "Tiro derecha"},
            {"minute": 23, "type": "yellow", "team": "away", "player": "Tyler Adams"},
            {"minute": 41, "type": "goal", "team": "away", "player": "Christian Pulisic", "detail": "Penalti"},
            {"minute": 56, "type": "yellow", "team": "away", "player": "Weston McKennie"},
            {"minute": 63, "type": "substitution", "team": "home", "player": "Memphis Depay", "detail": "Sale Gakpo"},
        ],
        # Per-minute momentum: -100 (away) to +100 (home)
        "momentum": [0, 10, 25, 35, 60, 70, 65, 50, 30, 10, -10, -20, -10, 0, 20, 40, 55, 60, 70, 65, 50, 35, 25, 20, 10, 5, -5, -20, -30, -50, -60, -55, -40, -30, -20, -10, 5, 15, 25, 35, 40, 45, 30, 20, 10, 0, -10, -15, 0, 10, 20, 30, 35, 40, 50, 55, 40, 30, 25, 20, 15, 10, 30, 45, 60, 55, 50],
    }
}

# Sample players per team (top 5)
PLAYERS = {
    "arg": [
        {"name": "Lionel Messi", "pos": "Delantero", "age": 38, "club": "Inter Miami", "value": "€20M", "caps": 191, "goals": 112},
        {"name": "Lautaro Martínez", "pos": "Delantero", "age": 28, "club": "Inter de Milán", "value": "€110M", "caps": 73, "goals": 32},
        {"name": "Rodrigo De Paul", "pos": "Mediocampo", "age": 31, "club": "Atlético de Madrid", "value": "€32M", "caps": 76, "goals": 5},
        {"name": "Emiliano Martínez", "pos": "Portero", "age": 33, "club": "Aston Villa", "value": "€25M", "caps": 47, "goals": 0},
        {"name": "Cristian Romero", "pos": "Defensa", "age": 27, "club": "Tottenham", "value": "€55M", "caps": 49, "goals": 3},
    ],
    "fra": [
        {"name": "Kylian Mbappé", "pos": "Delantero", "age": 27, "club": "Real Madrid", "value": "€180M", "caps": 86, "goals": 51},
        {"name": "Antoine Griezmann", "pos": "Mediocampo", "age": 34, "club": "Atlético de Madrid", "value": "€25M", "caps": 137, "goals": 44},
        {"name": "Aurélien Tchouaméni", "pos": "Mediocampo", "age": 26, "club": "Real Madrid", "value": "€90M", "caps": 35, "goals": 1},
        {"name": "William Saliba", "pos": "Defensa", "age": 25, "club": "Arsenal", "value": "€80M", "caps": 22, "goals": 1},
        {"name": "Mike Maignan", "pos": "Portero", "age": 30, "club": "AC Milan", "value": "€35M", "caps": 18, "goals": 0},
    ],
}

def players_for(team_id):
    return PLAYERS.get(team_id, [
        {"name": f"Jugador {i+1}", "pos": ["Portero", "Defensa", "Mediocampo", "Delantero"][i % 4], "age": 24 + i, "club": "Club FC", "value": f"€{20+i*5}M", "caps": 30 + i*3, "goals": 5 + i}
        for i in range(5)
    ])

# ---------------- TOP SCORERS ----------------
TOP_SCORERS = [
    {"player": "Kylian Mbappé", "team": "fra", "goals": 6, "assists": 3, "matches": 5, "xg": 5.8},
    {"player": "Lionel Messi", "team": "arg", "goals": 5, "assists": 4, "matches": 5, "xg": 4.5},
    {"player": "Vinícius Júnior", "team": "bra", "goals": 5, "assists": 2, "matches": 5, "xg": 4.2},
    {"player": "Harry Kane", "team": "eng", "goals": 4, "assists": 1, "matches": 4, "xg": 4.0},
    {"player": "Lautaro Martínez", "team": "arg", "goals": 4, "assists": 0, "matches": 5, "xg": 3.5},
    {"player": "Cody Gakpo", "team": "ned", "goals": 3, "assists": 2, "matches": 4, "xg": 3.2},
    {"player": "Lamine Yamal", "team": "esp", "goals": 3, "assists": 3, "matches": 4, "xg": 2.9},
    {"player": "Cristiano Ronaldo", "team": "por", "goals": 3, "assists": 0, "matches": 3, "xg": 2.6},
]

TOP_ASSISTS = [
    {"player": "Lionel Messi", "team": "arg", "assists": 4, "goals": 5, "matches": 5},
    {"player": "Bruno Fernandes", "team": "por", "assists": 4, "goals": 1, "matches": 3},
    {"player": "Lamine Yamal", "team": "esp", "assists": 3, "goals": 3, "matches": 4},
    {"player": "Kylian Mbappé", "team": "fra", "assists": 3, "goals": 6, "matches": 5},
    {"player": "Jude Bellingham", "team": "eng", "assists": 3, "goals": 2, "matches": 4},
]

# ---------------- HISTORICAL TIMELINE ----------------
TIMELINE = [
    {"year": 1930, "host": "Uruguay", "champion": "uru", "runnerup": "arg", "top_scorer": "Guillermo Stábile (8)", "fact": "Primer Mundial. Uruguay levanta el trofeo en casa."},
    {"year": 1934, "host": "Italia", "champion": "ita", "runnerup": "cze", "top_scorer": "Oldřich Nejedlý (5)", "fact": "Italia gana en casa. Uruguay no participa."},
    {"year": 1950, "host": "Brasil", "champion": "uru", "runnerup": "bra", "top_scorer": "Ademir (8)", "fact": "El Maracanazo. Uruguay sorprende en Brasil."},
    {"year": 1954, "host": "Suiza", "champion": "ger", "runnerup": "hun", "top_scorer": "Sándor Kocsis (11)", "fact": "El Milagro de Berna. Alemania remonta a Hungría."},
    {"year": 1958, "host": "Suecia", "champion": "bra", "runnerup": "swe", "top_scorer": "Just Fontaine (13)", "fact": "Debut histórico de Pelé con 17 años."},
    {"year": 1962, "host": "Chile", "champion": "bra", "runnerup": "cze", "top_scorer": "Múltiples (4)", "fact": "Garrincha brilla y Brasil revalida."},
    {"year": 1966, "host": "Inglaterra", "champion": "eng", "runnerup": "ger", "top_scorer": "Eusébio (9)", "fact": "Único título inglés. El gol fantasma."},
    {"year": 1970, "host": "México", "champion": "bra", "runnerup": "ita", "top_scorer": "Gerd Müller (10)", "fact": "Pelé y el mejor Brasil de la historia."},
    {"year": 1974, "host": "Alemania Occ.", "champion": "ger", "runnerup": "ned", "top_scorer": "Grzegorz Lato (7)", "fact": "Cruyff y la Naranja Mecánica."},
    {"year": 1978, "host": "Argentina", "champion": "arg", "runnerup": "ned", "top_scorer": "Mario Kempes (6)", "fact": "Primer título argentino en casa."},
    {"year": 1982, "host": "España", "champion": "ita", "runnerup": "ger", "top_scorer": "Paolo Rossi (6)", "fact": "El renacer de Paolo Rossi."},
    {"year": 1986, "host": "México", "champion": "arg", "runnerup": "ger", "top_scorer": "Gary Lineker (6)", "fact": "Maradona, la Mano de Dios y el gol del siglo."},
    {"year": 1990, "host": "Italia", "champion": "ger", "runnerup": "arg", "top_scorer": "Salvatore Schillaci (6)", "fact": "Notti Magiche. Alemania toma revancha."},
    {"year": 1994, "host": "USA", "champion": "bra", "runnerup": "ita", "top_scorer": "Múltiples (6)", "fact": "Penales decisivos. Brasil tetracampeón."},
    {"year": 1998, "host": "Francia", "champion": "fra", "runnerup": "bra", "top_scorer": "Davor Šuker (6)", "fact": "Zidane y el primer título francés."},
    {"year": 2002, "host": "Corea/Japón", "champion": "bra", "runnerup": "ger", "top_scorer": "Ronaldo (8)", "fact": "Brasil pentacampeón. Ronaldo se redime."},
    {"year": 2006, "host": "Alemania", "champion": "ita", "runnerup": "fra", "top_scorer": "Miroslav Klose (5)", "fact": "El cabezazo de Zidane y la Azzurra."},
    {"year": 2010, "host": "Sudáfrica", "champion": "esp", "runnerup": "ned", "top_scorer": "Múltiples (5)", "fact": "Iniesta y el primer título español."},
    {"year": 2014, "host": "Brasil", "champion": "ger", "runnerup": "arg", "top_scorer": "James Rodríguez (6)", "fact": "El 7-1 a Brasil. Götze lo decide."},
    {"year": 2018, "host": "Rusia", "champion": "fra", "runnerup": "cro", "top_scorer": "Harry Kane (6)", "fact": "Mbappé deslumbra. Francia bicampeona."},
    {"year": 2022, "host": "Qatar", "champion": "arg", "runnerup": "fra", "top_scorer": "Kylian Mbappé (8)", "fact": "Messi corona su carrera tras 36 años."},
    {"year": 2026, "host": "USA/Canadá/México", "champion": None, "runnerup": None, "top_scorer": None, "fact": "Primer Mundial con 48 selecciones."},
]
