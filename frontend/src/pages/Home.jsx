import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchNextMatch, fetchMatches, fetchTopScorers, fetchStatsOverview } from "@/lib/api";
import Countdown from "@/components/Countdown";
import { MatchCard, LiveBadge, SectionHeader } from "@/components/Shared";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Map, Activity, Trophy } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const HERO_BG = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=2000&q=80";

const STATS_STRIP = [
  { id: "played", label: "PARTIDOS JUGADOS", key: "total_matches_played", icon: Trophy },
  { id: "goals", label: "GOLES TOTALES", key: "total_goals", icon: Sparkles },
  { id: "live", label: "EN VIVO", key: "total_matches_live", icon: Activity, accent: true },
  { id: "scheduled", label: "POR JUGAR", key: "total_matches_scheduled", icon: Map },
];

const FEATURES = [
  { id: "feature-simulator", to: "/simulator", title: "Simulador IA", desc: "Simula partidos completos con Claude AI basado en estadísticas reales.", icon: Sparkles },
  { id: "feature-rivality", to: "/rivality", title: "Rivality Explorer", desc: "Comparador histórico entre dos selecciones con análisis IA.", icon: Activity },
  { id: "feature-stadiums", to: "/stadiums", title: "Mapa interactivo", desc: "Estadios, ciudades y datos históricos de cada sede.", icon: Map },
];

const Home = () => {
  const { t } = useI18n();
  const { data: nextMatch } = useQuery({ queryKey: ["next-match"], queryFn: fetchNextMatch, refetchInterval: 5000 });
  const { data: matches } = useQuery({ queryKey: ["matches"], queryFn: () => fetchMatches() });
  const { data: scorers } = useQuery({ queryKey: ["scorers"], queryFn: fetchTopScorers });
  const { data: overview } = useQuery({ queryKey: ["overview"], queryFn: fetchStatsOverview });

  const featuredMatches = useMemo(
    () => (matches || []).filter(m => m.status !== "FT").slice(0, 4),
    [matches]
  );
  const topScorers = useMemo(() => (scorers || []).slice(0, 8), [scorers]);

  const isLive = nextMatch?.status === "LIVE";

  return (
    <div data-testid="page-home">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 grain" data-testid="hero">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="relative section-pad py-16 md:py-24 lg:py-32">
          <div className="text-[10px] tracking-[0.4em] uppercase text-neon mb-4 font-bold fade-in-up">
            FIFA WORLD CUP 2026 · USA · CANADÁ · MÉXICO
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.95] mb-4 fade-in-up" data-testid="hero-title">
            {t("hero.tagline")}
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-xl mb-10 fade-in-up">{t("hero.subtitle")}</p>

          {nextMatch && (
            <div className="bg-black/60 border border-white/10 backdrop-blur-xl p-6 md:p-8 max-w-4xl fade-in-up" data-testid="hero-match">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-zinc-400 mb-6">
                <span>{isLive ? t("common.live") : t("hero.next")}</span>
                {isLive ? <LiveBadge /> : <span className="font-mono text-neon">{new Date(nextMatch.kickoff).toLocaleString(undefined, { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
              </div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 flex flex-col items-center md:items-start gap-2">
                  <span className="text-5xl md:text-7xl">{nextMatch.home_team?.flag}</span>
                  <span className="font-display font-bold text-xl md:text-2xl uppercase tracking-tight">{nextMatch.home_team?.name}</span>
                </div>
                <div className="font-mono text-3xl md:text-5xl">
                  {isLive ? `${nextMatch.score_home} - ${nextMatch.score_away}` : "VS"}
                </div>
                <div className="flex-1 flex flex-col items-center md:items-end gap-2">
                  <span className="text-5xl md:text-7xl">{nextMatch.away_team?.flag}</span>
                  <span className="font-display font-bold text-xl md:text-2xl uppercase tracking-tight">{nextMatch.away_team?.name}</span>
                </div>
              </div>
              {isLive ? (
                <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                  <div className="font-mono text-red-500 text-xl">MIN {nextMatch.minute}&apos;</div>
                  <Link to={`/matches/${nextMatch.id}`}>
                    <Button data-testid="hero-watch-live" className="bg-neon text-black hover:bg-cyan-300 uppercase tracking-widest text-xs rounded-none">
                      Ver en directo <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <Countdown target={nextMatch.kickoff} testId="hero-countdown" />
                  <div className="text-xs text-zinc-400 font-mono">
                    <div>{nextMatch.stadium_info?.name}</div>
                    <div>{nextMatch.stadium_info?.city}, {nextMatch.stadium_info?.country}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* OVERVIEW STATS */}
      {overview && (
        <section className="section-pad py-12 border-b border-white/10" data-testid="stats-strip">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {STATS_STRIP.map((s) => (
              <div key={s.id} className="bg-card p-6 flex items-center gap-4" data-testid={`stat-${s.id}`}>
                <s.icon size={24} className={s.accent ? "text-red-500" : "text-neon"} strokeWidth={1.5} />
                <div>
                  <div className="font-mono text-3xl font-bold">{overview[s.key]}</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MATCHES */}
      <section className="section-pad py-16" data-testid="home-matches">
        <SectionHeader
          kicker="CENTRO DE PARTIDOS"
          title="Próximos & en vivo"
          action={<Link to="/matches"><Button variant="outline" size="sm" className="rounded-none uppercase tracking-widest text-xs" data-testid="view-all-matches">{t("common.viewAll")} <ArrowRight size={14} className="ml-2" /></Button></Link>}
        />
        <div className="grid md:grid-cols-2 gap-4">
          {featuredMatches.map(m => (
            <MatchCard key={m.id} match={m} testId={`home-match-${m.id}`} />
          ))}
        </div>
      </section>

      {/* TOP SCORERS PREVIEW */}
      <section className="section-pad py-16 border-t border-white/10" data-testid="home-scorers">
        <SectionHeader
          kicker="ESTADÍSTICAS"
          title="Goleadores del Mundial"
          action={<Link to="/stats"><Button variant="outline" size="sm" className="rounded-none uppercase tracking-widest text-xs" data-testid="view-all-stats">{t("common.viewAll")} <ArrowRight size={14} className="ml-2" /></Button></Link>}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {topScorers.map((s, i) => (
            <div key={s.player} className="bg-card p-5" data-testid={`scorer-${s.player}`}>
              <div className="font-mono text-xs text-zinc-500 mb-2">#{i + 1}</div>
              <div className="font-display text-lg uppercase tracking-tight font-semibold">{s.player}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                <span>{s.team_info?.flag}</span><span>{s.team_info?.name}</span>
              </div>
              <div className="mt-4 flex items-end gap-3">
                <div>
                  <div className="font-mono text-3xl text-neon">{s.goals}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">GOLES</div>
                </div>
                <div>
                  <div className="font-mono text-xl text-white">{s.assists}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">ASIST.</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES CTA */}
      <section className="section-pad py-16 border-t border-white/10" data-testid="features-grid">
        <SectionHeader kicker="INNOVACIÓN" title="Lo que solo encontrarás aquí" />
        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <Link key={f.id} to={f.to} className="bg-card border border-white/10 p-6 hover-glow group" data-testid={f.id}>
              <f.icon size={28} className="text-neon mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-xl uppercase tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-neon flex items-center gap-2">
                Explorar <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
