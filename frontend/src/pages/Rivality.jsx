import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTeams, aiRivality } from "@/lib/api";
import { SectionHeader } from "@/components/Shared";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Swords } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Rivality = () => {
  const { t } = useI18n();
  const { data: teams } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);

  const mut = useMutation({
    mutationFn: () => aiRivality(a, b),
    onSuccess: setResult,
  });

  const ta = teams?.find(x => x.id === a);
  const tb = teams?.find(x => x.id === b);

  return (
    <div className="section-pad py-12" data-testid="page-rivality">
      <SectionHeader kicker="HEAD TO HEAD" title={t("rivality.title")} />
      <p className="text-zinc-400 mb-8 max-w-2xl">{t("rivality.subtitle")}</p>

      <div className="bg-card border border-white/10 p-6 mb-8">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <Select value={a} onValueChange={setA}>
            <SelectTrigger data-testid="riv-a-select" className="rounded-none bg-black border-white/20">
              <SelectValue placeholder="Selección A" />
            </SelectTrigger>
            <SelectContent>
              {(teams || []).map(team => (<SelectItem key={team.id} value={team.id} data-testid={`riv-a-${team.id}`}>{team.flag} {team.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Swords size={32} className="text-neon mx-auto" />
          <Select value={b} onValueChange={setB}>
            <SelectTrigger data-testid="riv-b-select" className="rounded-none bg-black border-white/20">
              <SelectValue placeholder="Selección B" />
            </SelectTrigger>
            <SelectContent>
              {(teams || []).map(team => (<SelectItem key={team.id} value={team.id} data-testid={`riv-b-${team.id}`}>{team.flag} {team.name}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-6 flex justify-center">
          <Button disabled={!a || !b || a === b || mut.isPending} onClick={() => mut.mutate()} data-testid="riv-run-btn"
            className="bg-neon text-black hover:bg-cyan-300 rounded-none uppercase tracking-widest text-xs px-8">
            {mut.isPending ? "Analizando con IA…" : t("rivality.run")}
          </Button>
        </div>
      </div>

      {result && (
        <div className="bg-card border border-white/10 p-8 fade-in-up space-y-6" data-testid="riv-result">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl">{ta?.flag}</span>
              <span className="font-display text-xl uppercase mt-2">{ta?.name}</span>
              <div className="font-mono text-4xl text-neon mt-2">{result.result.wins_a}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">VICTORIAS</div>
            </div>
            <div className="text-center px-6">
              <div className="font-mono text-2xl text-white">{result.result.draws}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">EMPATES</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-3">{result.result.total_matches} ENFRENTAMIENTOS</div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl">{tb?.flag}</span>
              <span className="font-display text-xl uppercase mt-2">{tb?.name}</span>
              <div className="font-mono text-4xl text-red-500 mt-2">{result.result.wins_b}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">VICTORIAS</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
            <div className="bg-black p-4 text-center"><div className="font-mono text-3xl text-neon">{result.result.goals_a}</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">GOLES {ta?.code}</div></div>
            <div className="bg-black p-4 text-center"><div className="font-mono text-3xl text-red-500">{result.result.goals_b}</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">GOLES {tb?.code}</div></div>
          </div>

          {result.result.historic_matches?.length > 0 && (
            <div>
              <h4 className="font-display text-lg uppercase mb-3">Partidos históricos</h4>
              <div className="space-y-2">
                {result.result.historic_matches.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm border-b border-white/5 py-2">
                    <span className="font-mono text-neon w-16">{h.year}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 w-24">{h.stage}</span>
                    <span className="font-mono text-white flex-1">{h.result}</span>
                    <span className="text-xs text-zinc-400">{h.winner}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10">
            <div className="bg-black p-4 text-center"><div className="font-mono text-2xl text-neon">{Math.round((result.result.prob_a || 0) * 100)}%</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">PROB. {ta?.code}</div></div>
            <div className="bg-black p-4 text-center"><div className="font-mono text-2xl text-white">{Math.round((result.result.prob_draw || 0) * 100)}%</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">EMPATE</div></div>
            <div className="bg-black p-4 text-center"><div className="font-mono text-2xl text-red-500">{Math.round((result.result.prob_b || 0) * 100)}%</div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">PROB. {tb?.code}</div></div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neon mb-2">ANÁLISIS IA</div>
            <p className="text-zinc-300 leading-relaxed">{result.result.analysis}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rivality;
