import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTeams, aiSimulateMatch } from "@/lib/api";
import { SectionHeader } from "@/components/Shared";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Trophy } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Simulator = () => {
  const { t } = useI18n();
  const { data: teams } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [result, setResult] = useState(null);

  const simMut = useMutation({
    mutationFn: () => aiSimulateMatch(home, away),
    onSuccess: (data) => setResult(data),
  });

  const homeTeam = teams?.find(x => x.id === home);
  const awayTeam = teams?.find(x => x.id === away);
  const canRun = home && away && home !== away;

  return (
    <div className="section-pad py-12" data-testid="page-simulator">
      <SectionHeader kicker="LABORATORIO IA" title={t("sim.title")} />
      <p className="text-zinc-400 mb-8 max-w-2xl">{t("sim.subtitle")}</p>

      <div className="bg-card border border-white/10 p-6 mb-8">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-neon mb-2">LOCAL</div>
            <Select value={home} onValueChange={setHome}>
              <SelectTrigger data-testid="sim-home-select" className="rounded-none bg-black border-white/20">
                <SelectValue placeholder="Selecciona equipo local" />
              </SelectTrigger>
              <SelectContent>
                {(teams || []).map(team => (
                  <SelectItem key={team.id} value={team.id} data-testid={`sim-home-${team.id}`}>
                    {team.flag} {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="font-mono text-3xl text-zinc-600 text-center">VS</div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-red-500 mb-2">VISITANTE</div>
            <Select value={away} onValueChange={setAway}>
              <SelectTrigger data-testid="sim-away-select" className="rounded-none bg-black border-white/20">
                <SelectValue placeholder="Selecciona equipo visitante" />
              </SelectTrigger>
              <SelectContent>
                {(teams || []).map(team => (
                  <SelectItem key={team.id} value={team.id} data-testid={`sim-away-${team.id}`}>
                    {team.flag} {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            disabled={!canRun || simMut.isPending}
            onClick={() => simMut.mutate()}
            data-testid="sim-run-btn"
            className="bg-neon text-black hover:bg-cyan-300 rounded-none uppercase tracking-widest text-xs px-8"
          >
            <Sparkles size={14} className="mr-2" />
            {simMut.isPending ? t("sim.running") : t("sim.run")}
          </Button>
        </div>
      </div>

      {result && (
        <div className="bg-card border border-white/10 p-8 fade-in-up" data-testid="sim-result">
          <div className="text-center mb-8">
            <div className="text-[10px] uppercase tracking-[0.3em] text-neon mb-3">RESULTADO IA</div>
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-6xl">{homeTeam?.flag}</span>
                <span className="font-display text-xl uppercase mt-2">{homeTeam?.name}</span>
              </div>
              <div className="font-mono text-7xl font-bold text-white">
                {result.result.score_home} - {result.result.score_away}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl">{awayTeam?.flag}</span>
                <span className="font-display text-xl uppercase mt-2">{awayTeam?.name}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 mb-6">
            <div className="bg-black p-4 text-center"><div className="font-mono text-2xl text-neon">{Math.round((result.result.prob_home || 0) * 100)}%</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">PROB. LOCAL</div></div>
            <div className="bg-black p-4 text-center"><div className="font-mono text-2xl text-white">{Math.round((result.result.prob_draw || 0) * 100)}%</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">EMPATE</div></div>
            <div className="bg-black p-4 text-center"><div className="font-mono text-2xl text-red-500">{Math.round((result.result.prob_away || 0) * 100)}%</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">PROB. VISITANTE</div></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">xG</div>
              <div className="font-mono text-xl">{result.result.xg_home} - {result.result.xg_away}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">MVP</div>
              <div className="font-display text-lg uppercase">{result.result.mvp}</div>
            </div>
            {result.result.scorers_home?.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">GOLEADORES {homeTeam?.code}</div>
                <div>{result.result.scorers_home.join(", ")}</div>
              </div>
            )}
            {result.result.scorers_away?.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">GOLEADORES {awayTeam?.code}</div>
                <div>{result.result.scorers_away.join(", ")}</div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neon mb-2 flex items-center gap-2"><Trophy size={12} /> NARRATIVA IA</div>
            <p className="text-zinc-300 leading-relaxed">{result.result.narrative}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;
