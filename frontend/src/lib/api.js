import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const fetchTeams = () => api.get("/teams").then(r => r.data);
export const fetchTeam = (id) => api.get(`/teams/${id}`).then(r => r.data);
export const fetchMatches = (status) => api.get("/matches", { params: status ? { status } : {} }).then(r => r.data);
export const fetchNextMatch = () => api.get("/matches/next").then(r => r.data);
export const fetchMatch = (id) => api.get(`/matches/${id}`).then(r => r.data);
export const fetchStadiums = () => api.get("/stadiums").then(r => r.data);
export const fetchStadium = (id) => api.get(`/stadiums/${id}`).then(r => r.data);
export const fetchTopScorers = () => api.get("/stats/top-scorers").then(r => r.data);
export const fetchTopAssists = () => api.get("/stats/top-assists").then(r => r.data);
export const fetchStatsOverview = () => api.get("/stats/overview").then(r => r.data);
export const fetchTimeline = () => api.get("/timeline").then(r => r.data);
export const fetchFanDashboard = (id) => api.get(`/fan/${id}`).then(r => r.data);

export const aiSimulateMatch = (home_id, away_id) => api.post("/ai/simulate-match", { home_id, away_id }).then(r => r.data);
export const aiPredictMatch = (home_id, away_id) => api.post("/ai/predict-match", { home_id, away_id }).then(r => r.data);
export const aiStory = (team_id) => api.get(`/ai/story/${team_id}`).then(r => r.data);
export const aiRivality = (team_a, team_b) => api.post("/ai/rivality", { team_a, team_b }).then(r => r.data);
export const aiSimulateGroup = (team_ids) => api.post("/ai/simulate-group", { team_ids }).then(r => r.data);
