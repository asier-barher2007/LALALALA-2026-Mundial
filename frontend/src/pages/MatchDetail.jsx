import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchMatch, aiPredictMatch } from "@/lib/api";
import { LiveBadge } from "@/components/Shared";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, ResponsiveContainer, ReferenceLine, XAxis, YAxis, Tooltip } from "recharts";
import { Sparkles, MapPin, User } from "lucide-react";

const CHART_AXIS_TICK = { fontSize: 10 };
const MOMENTUM_DOMAIN = [-100, 100];
const CHART_TOOLTIP_STYLE = { background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 };

const EVENT_BADGE_STYLE = {
  goal: "bg-neon text-black",
  yellow: "bg-yellow-500/20 text-yellow-500",
};
const EVENT_LABEL = {
  goal: "GOL",
  yellow: "TA",
  substitution: "CAMBIO",
};

const formatEventBadge = (type) => EVENT_BADGE_STYLE[type] || "bg-white/10 text-zinc-300";
const formatEventLabel = (type) => EVENT_LABEL[type] || type;

const getDefaultTab = (status) => {
  if (status === "LIVE") return "live";
  if (status === "SCHEDULED") return "preview";
  return "summary";
};

const StatBar = ({ label, home, away, format = (v) => v, testId }) => {
  const total = (Number(home) + Number(away)) || 1;
  const homePct = (Number(home) / total) * 100;
  return (
    <div className="space-y-2" data-testid={testId}>
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="font-mono">{format(home)}</span>
        <span className="uppercase tracking-[0.2em] text-[10px] text-zinc-500">{label}</span>
        <span className="font-mono">{format(away)}</span>
      </div>
      <div className="h-1 bg-white/10 flex overflow-hidden">
        <div className="bg-neon" style={{ width: `${homePct}%` }} />
        <div className="bg-red-500" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  );
};

const MatchDetail = () => {
  const { id } = useParams();
  const { data: match, isLoading } = useQuery({
    queryKey: ["match", id],
    queryFn: () => fetchMatch(id),
    refetchInterval: 5000,
  });

  const [prediction, setPrediction] = useState(null);
  const predictMut = useMutation({
    mutationFn: () => aiPredictMatch(match.home, match.away),
    onSuccess: setPrediction,
  });

  if (isLoading || !match) return <div className="section-pad py-12 text-zinc-500" data-testid="loading">Cargando…</div>;

  const isLive = match.status === "LIVE";
  const isFt = match.status === "FT";
  const isScheduled = match.status === "SCHEDULED";
  const live = match.live || {};
  const momentumData = (live.momentum || []).map((v, i) => ({ minute: i + 1, value: v }));

  return (
    <div data-testid="page-match-detail">
      {/* Header */}
      <section className="relative border-b border-white/10 overflow-hidden grain">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${match.stadium_info?.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="relative section-pad py-12">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-zinc-400 mb-6">
            <span>{match.phase} {match.group && `· Grupo ${match.group}`}</span>
            {isLive ? <LiveBadge /> : <span className="font-mono text-neon">{new Date(match.kickoff).toLocaleString(undefined, { weekday: "long", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex flex-col items-center md:items-start gap-3" data-testid="match-home">
              <span className="text-6xl md:text-8xl">{match.home_team?.flag}</span>
              <h1 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">{match.home_team?.name}</h1>
            </div>
            <div className="font-mono text-5xl md:text-7xl font-bold">
              {isScheduled ? "VS" : `${match.score_home} - ${match.score_away}`}
            </div>
            <div className="flex-1 flex flex-col items-center md:items-end gap-3" data-testid="match-away">
              <span className="text-6xl md:text-8xl">{match.away_team?.flag}</span>
              <h1 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">{match.away_team?.name}</h1>
            </div>
          </div>
          {isLive && <div className="text-center mt-6 font-mono text-red-500 text-xl">MIN {match.minute}&apos;</div>}
          <div className="mt-8 flex flex-wrap gap-6 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-2"><MapPin size={14} /> {match.stadium_info?.name}, {match.stadium_info?.city}</span>
            <span className="flex items-center gap-2"><User size={14} /> Árbitro: {match.referee}</span>
          </div>
        </div>
      </section>

      <div className="section-pad py-12">
        <Tabs defaultValue={getDefaultTab(match.status)}>
          <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start gap-6 p-0 h-auto mb-8">
            {isScheduled && <TabsTrigger value="preview" data-testid="tab-preview" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon text-xs uppercase tracking-[0.2em] px-0 pb-3">Vista previa</TabsTrigger>}
            {isLive && <TabsTrigger value="live" data-testid="tab-live" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon text-xs uppercase tracking-[0.2em] px-0 pb-3">En vivo</TabsTrigger>}
            {isFt && <TabsTrigger value="summary" data-testid="tab-summary" className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon text-xs uppercase tracking-[0.2em] px-0 pb-3">Resumen</TabsTrigger>}
          </TabsList>

          {isScheduled && (
            <TabsContent value="preview" data-testid="content-preview">
              <div className="bg-card border border-white/10 p-8 text-center">
                <Sparkles size={32} className="text-neon mx-auto mb-4" />
                <h3 className="font-display text-2xl uppercase mb-2">Predicción con IA</h3>
                <p className="text-zinc-400 text-sm mb-6">Análisis con Claude Sonnet basado en estadísticas reales</p>
                <Button
                  data-testid="btn-predict"
                  onClick={() => predictMut.mutate()}
                  disabled={predictMut.isPending}
                  className="bg-neon text-black hover:bg-cyan-300 rounded-none uppercase tracking-widest text-xs"
                >
                  {predictMut.isPending ? "Analizando con IA…" : "Generar predicción IA"}
                </Button>
              </div>
              {prediction && (
                <div className="mt-6 bg-card border border-white/10 p-6 space-y-4" data-testid="prediction-result">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: match.home_team?.code, value: prediction.prob_home, accentClass: "text-neon" },
                      { label: "EMPATE", value: prediction.prob_draw, accentClass: "text-white" },
                      { label: match.away_team?.code, value: prediction.prob_away, accentClass: "text-red-500" },
                    ].map((p) => (
                      <div key={p.label} className="bg-black/40 border border-white/10 p-4">
                        <div className={`font-mono text-3xl ${p.accentClass}`}>
                          {Math.round((p.value || 0) * 100)}%
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{p.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">xG ESTIMADO</div>
                      <div className="font-mono text-xl">{prediction.expected_goals_home} - {prediction.expected_goals_away}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">JUGADORES CLAVE</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-neon">{match.home_team?.code}:</span> {(prediction.key_players_home || []).join(", ")}</div>
                      <div><span className="text-red-500">{match.away_team?.code}:</span> {(prediction.key_players_away || []).join(", ")}</div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed border-t border-white/10 pt-4">{prediction.analysis}</p>
                </div>
              )}
            </TabsContent>
          )}

          {isLive && (
            <TabsContent value="live" data-testid="content-live" className="space-y-8">
              {/* Match Momentum Engine */}
              <div className="bg-card border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg uppercase tracking-tight">Match Momentum Engine</h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Quién domina, minuto a minuto</span>
                </div>
                <div className="h-48 min-h-[192px] w-full" data-testid="momentum-chart">
                  <ResponsiveContainer width="100%" height="100%" minHeight={192}>
                    <LineChart data={momentumData}>
                      <XAxis dataKey="minute" stroke="#666" tick={CHART_AXIS_TICK} />
                      <YAxis domain={MOMENTUM_DOMAIN} stroke="#666" tick={CHART_AXIS_TICK} />
                      <ReferenceLine y={0} stroke="#444" />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                      <Line type="monotone" dataKey="value" stroke="#00E5FF" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-2">
                  <span className="text-red-500">← {match.away_team?.code}</span>
                  <span className="text-neon">{match.home_team?.code} →</span>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-card border border-white/10 p-6 space-y-5" data-testid="live-stats">
                <h3 className="font-display text-lg uppercase tracking-tight mb-4">Estadísticas</h3>
                <StatBar testId="stat-possession" label="Posesión" home={live.possession?.home || 0} away={live.possession?.away || 0} format={(v) => `${v}%`} />
                <StatBar testId="stat-xg" label="xG" home={live.xg?.home || 0} away={live.xg?.away || 0} format={(v) => v.toFixed(1)} />
                <StatBar testId="stat-shots" label="Tiros" home={live.shots?.home || 0} away={live.shots?.away || 0} />
                <StatBar testId="stat-shots-on" label="A puerta" home={live.shots_on_target?.home || 0} away={live.shots_on_target?.away || 0} />
                <StatBar testId="stat-passes" label="Pases" home={live.passes?.home || 0} away={live.passes?.away || 0} />
                <StatBar testId="stat-pass-acc" label="Precisión" home={live.pass_accuracy?.home || 0} away={live.pass_accuracy?.away || 0} format={(v) => `${v}%`} />
                <StatBar testId="stat-corners" label="Córners" home={live.corners?.home || 0} away={live.corners?.away || 0} />
                <StatBar testId="stat-yellow" label="Amarillas" home={live.yellow_cards?.home || 0} away={live.yellow_cards?.away || 0} />
              </div>

              {/* Events */}
              <div className="bg-card border border-white/10 p-6">
                <h3 className="font-display text-lg uppercase tracking-tight mb-4">Eventos del partido</h3>
                <div className="space-y-3" data-testid="live-events">
                  {(live.events || []).map((e) => (
                    <div key={`${e.minute}-${e.type}-${e.player}`} className="flex items-center gap-4 text-sm border-b border-white/5 pb-3 last:border-0">
                      <span className="font-mono text-zinc-500 w-12">{e.minute}&apos;</span>
                      <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${formatEventBadge(e.type)}`}>
                        {formatEventLabel(e.type)}
                      </span>
                      <span className="text-zinc-300">{e.player}</span>
                      {e.detail && <span className="text-zinc-500 text-xs">— {e.detail}</span>}
                      <span className="ml-auto text-xs">{e.team === "home" ? match.home_team?.flag : match.away_team?.flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {isFt && (
            <TabsContent value="summary" data-testid="content-summary">
              <div className="bg-card border border-white/10 p-8 text-center">
                <h3 className="font-display text-2xl uppercase mb-4">Resumen del partido</h3>
                <div className="font-mono text-5xl text-neon mb-4">{match.score_home} - {match.score_away}</div>
                <p className="text-zinc-400">Partido finalizado en {match.stadium_info?.name}.</p>
                <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto text-sm">
                  <div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">MVP</div><div className="font-display mt-1">Por definir</div></div>
                  <div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Asistencia</div><div className="font-mono mt-1">{match.stadium_info?.capacity?.toLocaleString()}</div></div>
                  <div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Fase</div><div className="font-display mt-1">{match.phase}</div></div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MatchDetail;
