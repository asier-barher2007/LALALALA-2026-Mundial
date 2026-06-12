import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "@/lib/api";
import { MatchCard, SectionHeader } from "@/components/Shared";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Matches = () => {
  const [tab, setTab] = useState("all");
  const { data: matches, isLoading } = useQuery({ queryKey: ["matches-all"], queryFn: () => fetchMatches(), refetchInterval: 8000 });

  const filtered = (matches || []).filter(m => tab === "all" || m.status === tab);

  return (
    <div className="section-pad py-12" data-testid="page-matches">
      <SectionHeader kicker="CENTRO DE PARTIDOS" title="Todos los partidos" />

      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start gap-6 p-0 h-auto">
          {[
            { v: "all", l: "Todos" },
            { v: "LIVE", l: "En vivo" },
            { v: "SCHEDULED", l: "Próximos" },
            { v: "FT", l: "Finalizados" },
          ].map(t => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              data-testid={`tab-${t.v.toLowerCase()}`}
              className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon data-[state=active]:bg-transparent text-xs uppercase tracking-[0.2em] px-0 pb-3"
            >
              {t.l}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <div className="text-zinc-500 text-sm" data-testid="loading">Cargando…</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(m => <MatchCard key={m.id} match={m} />)}
      </div>
      {!isLoading && filtered.length === 0 && (
        <div className="text-zinc-500 text-sm py-12" data-testid="empty-matches">Sin partidos en este estado.</div>
      )}
    </div>
  );
};

export default Matches;
