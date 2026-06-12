import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopScorers, fetchTopAssists, fetchStatsOverview } from "@/lib/api";
import { SectionHeader } from "@/components/Shared";
import Flag from "@/components/Flag";
import SEO from "@/components/SEO";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const PALETTE = ["#00E5FF", "#FF2A54", "#FFB800", "#8B5CF6", "#10B981"];
const RADAR_STATS = ["attack", "defense", "possession", "speed", "creativity"];
const AXIS_TICK = { fill: "#888", fontSize: 11 };
const RADIUS_TICK = { fill: "#666", fontSize: 10 };
const BAR_AXIS_TICK = { fontSize: 10 };
const CHART_TOOLTIP_STYLE = { background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 };
const LEGEND_STYLE = { fontSize: 11 };

const Stats = () => {
  const { data: scorers } = useQuery({ queryKey: ["scorers"], queryFn: fetchTopScorers, refetchInterval: 120_000 });
  const { data: assists } = useQuery({ queryKey: ["assists"], queryFn: fetchTopAssists, refetchInterval: 120_000 });
  const { data: overview } = useQuery({ queryKey: ["overview"], queryFn: fetchStatsOverview, refetchInterval: 120_000 });

  const radarTeams = overview?.team_radar ? Object.entries(overview.team_radar) : [];
  const radarData = RADAR_STATS.map(k => {
    const row = { stat: k.toUpperCase() };
    radarTeams.forEach(([id, data]) => { row[id] = data[k]; });
    return row;
  });

  const scorerBar = (scorers || []).slice(0, 8).map(s => ({ name: s.player.split(" ").slice(-1)[0], goals: s.goals, xg: s.xg }));

  return (
    <div className="section-pad py-12" data-testid="page-stats">
      <SEO title="Estadísticas" description="Centro de estadísticas avanzadas del Mundial 2026." />
      <SectionHeader kicker="ANÁLISIS" title="Centro de estadísticas" />

      {/* Radar */}
      <div className="bg-card border border-white/10 p-6 mb-8" data-testid="radar-card">
        <h3 className="font-display text-xl uppercase tracking-tight mb-1">Comparador radar de selecciones</h3>
        <p className="text-xs text-zinc-500 mb-4">Métricas avanzadas por selección</p>
        <div className="h-80 min-h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#222" />
              <PolarAngleAxis dataKey="stat" tick={AXIS_TICK} />
              <PolarRadiusAxis stroke="#333" tick={RADIUS_TICK} />
              {radarTeams.map(([id], i) => (
                <Radar key={id} name={id.toUpperCase()} dataKey={id} stroke={PALETTE[i]} fill={PALETTE[i]} fillOpacity={0.2} strokeWidth={2} />
              ))}
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend wrapperStyle={LEGEND_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals + xG bar */}
      <div className="bg-card border border-white/10 p-6 mb-8" data-testid="scorer-chart">
        <h3 className="font-display text-xl uppercase tracking-tight mb-1">Goleadores: Goles vs xG</h3>
        <p className="text-xs text-zinc-500 mb-4">Quién está superando su expectativa</p>
        <div className="h-72 min-h-[288px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={288}>
            <BarChart data={scorerBar}>
              <XAxis dataKey="name" stroke="#888" tick={BAR_AXIS_TICK} />
              <YAxis stroke="#888" tick={BAR_AXIS_TICK} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend wrapperStyle={LEGEND_STYLE} />
              <Bar dataKey="goals" fill="#00E5FF" />
              <Bar dataKey="xg" fill="#FF2A54" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lists */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-white/10" data-testid="scorers-list">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-display text-lg uppercase">Goleadores</h3>
          </div>
          {(scorers || []).map((s, i) => (
            <div key={`${s.player}-${s.team}`} className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0">
              <span className="font-mono text-xs text-zinc-500 w-6">{i + 1}</span>
              <Flag iso={s.team_info?.iso2} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{s.player}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-[0.1em] truncate">{s.team_info?.name}</div>
              </div>
              <div className="font-mono text-neon">{s.goals}</div>
            </div>
          ))}
          {(!scorers || scorers.length === 0) && (
            <div className="p-8 text-center text-zinc-500 text-sm">Aún no hay goles registrados.</div>
          )}
        </div>
        <div className="bg-card border border-white/10" data-testid="assists-list">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-display text-lg uppercase">Asistencias</h3>
          </div>
          {(assists || []).map((s, i) => (
            <div key={`${s.player}-${s.team}`} className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0">
              <span className="font-mono text-xs text-zinc-500 w-6">{i + 1}</span>
              <Flag iso={s.team_info?.iso2} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{s.player}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-[0.1em] truncate">{s.team_info?.name}</div>
              </div>
              <div className="font-mono text-neon">{s.assists}</div>
            </div>
          ))}
          {(!assists || assists.length === 0) && (
            <div className="p-8 text-center text-zinc-500 text-sm">Datos de asistencias no disponibles en la fuente pública.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
