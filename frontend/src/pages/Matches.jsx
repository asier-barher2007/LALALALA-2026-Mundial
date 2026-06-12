import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "@/lib/api";
import { MatchCard, SectionHeader } from "@/components/Shared";
import { SkeletonMatchRow } from "@/components/Skeleton";
import SEO from "@/components/SEO";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Matches = () => {
  const [tab, setTab] = useState("all");
  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches-all"],
    queryFn: () => fetchMatches(),
    refetchInterval: (q) => {
      const any = (q?.state?.data || []).some(m => m.status === "LIVE");
      return any ? 10_000 : 60_000;
    },
  });

  const filtered = (matches || []).filter(m => tab === "all" || m.status === tab);

  return (
    <div className="section-pad py-12" data-testid="page-matches">
      <SEO title="Partidos" description="Centro de partidos del Mundial 2026 — calendario completo, en vivo y resultados." />
      <SectionHeader kicker="CENTRO DE PARTIDOS" title="Todos los partidos" />

      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start gap-6 p-0 h-auto overflow-x-auto">
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
              className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon data-[state=active]:bg-transparent text-xs uppercase tracking-[0.2em] px-0 pb-3 whitespace-nowrap"
            >
              {t.l}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4" data-testid="loading">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonMatchRow key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-zinc-500 text-sm py-12 text-center border border-dashed border-white/10" data-testid="empty-matches">
              {tab === "LIVE" ? "No hay partidos en vivo en este momento." : "Sin partidos en este estado."}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Matches;
