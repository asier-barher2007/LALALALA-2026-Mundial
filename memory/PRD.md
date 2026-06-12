# WorldCup Nexus - PRD

## Problem Statement (original, condensed)
Premium World Cup tracking platform: hero with live/next match + countdown, match center (pre/live/post with xG, possession, momentum), 16 selecciones with squads + history + AI Story Mode, advanced stats dashboards (radar, scorers vs xG), interactive world stadium map, Mundial timeline 1930-2026, AI Match Simulator, Rivality Explorer (head-to-head), Fan Intelligence Dashboard, multi-idioma ES/EN, dark/light theme.

## Stack (adapted)
- Frontend: React 19 + react-router-dom 7 + Tailwind + shadcn/ui + Recharts + framer-motion + lucide-react
- Backend: FastAPI + Motor (MongoDB)
- AI: Emergent LLM Key with `claude-sonnet-4-5-20250929` via `emergentintegrations.llm.chat.LlmChat`
- Fonts: Oswald (display), JetBrains Mono (data), Manrope (body)

## User Personas
- **Aficionado**: sigue partidos en vivo, su selección favorita, próximos rivales
- **Estadístico**: explora dashboards de goleadores, xG, radar comparativo
- **Curioso/IA**: simula partidos, compara rivalidades, lee Story Mode generado por IA

## Core Requirements (static)
1. Home premium con hero + countdown + live ticker + stats strip
2. Centro de partidos (lista + detalle live/preview/summary con momentum engine)
3. Selecciones (lista + ficha completa con plantilla, historia, Story Mode IA, calendario)
4. Centro estadísticas (radar, scorers, asistencias, xG)
5. Mapa interactivo SVG con 8 estadios sede
6. Timeline 1930-2026
7. AI Simulator (partido individual)
8. Rivality Explorer (head-to-head IA)
9. Multi-idioma ES/EN, dark/light theme

## Implementation Status (2026-02)
- [x] Backend: 18 endpoints (teams, matches, stadiums, stats, timeline, fan, notifications, AI: predict/simulate/story/rivality/simulate-group)
- [x] Mock data: 16 selecciones, 8 estadios, 12 partidos (1 LIVE, 5 FT, 6 SCHEDULED), 22 ediciones timeline, top scorers/assists
- [x] Frontend: 10 routes con layout glassmorphism, premium dark-first theme
- [x] AI real con Claude Sonnet 4.5 (no mock)
- [x] i18n context ES/EN
- [x] Theme toggle dark/light
- [x] Match Momentum Engine con recharts
- [x] Testing agent: 18/18 backend pass, 100% frontend pass

## Backlog (P0 → P2)
- P1: WebSocket para actualizaciones live reales (ahora usa polling cada 5s)
- P1: Notificaciones Web Push (endpoint mock existe; falta Service Worker + VAPID keys)
- P1: PWA manifest + service worker offline
- P2: Mapa de calor de jugadores (heatmap real con coordenadas)
- P2: Simulador de grupos/eliminatorias completas (endpoint existe, falta UI)
- P2: SEO avanzado: sitemap.xml, JSON-LD por equipo/partido, metadata dinámica por ruta
- P2: PostgreSQL + Prisma + Redis (si se quiere migrar del MVP Mongo)
- P3: Selección favorita persistente con dashboard personalizado
- P3: Integración real API-Football si el usuario obtiene clave
