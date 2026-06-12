import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/lib/api";
import { SectionHeader } from "@/components/Shared";
import { Skeleton } from "@/components/Skeleton";
import Flag from "@/components/Flag";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";

const Teams = () => {
  const [q, setQ] = useState("");
  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    refetchInterval: 600_000,
  });

  const filtered = useMemo(() => {
    const arr = teams || [];
    if (!q) return arr;
    const needle = q.toLowerCase();
    return arr.filter(t =>
      (t.name || "").toLowerCase().includes(needle)
      || (t.code || "").toLowerCase().includes(needle)
      || (t.group || "").toLowerCase().includes(needle)
    );
  }, [teams, q]);

  return (
    <div className="section-pad py-12" data-testid="page-teams">
      <SEO title="Selecciones" description="48 selecciones del Mundial 2026: fichas, plantilla y estadísticas." />
      <SectionHeader
        kicker="SELECCIONES"
        title={`${teams?.length || 0} selecciones`}
        action={
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar selección, código o grupo…"
            className="rounded-none bg-black border-white/20 w-full sm:w-80"
            data-testid="teams-search"
          />
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="bg-card p-6 space-y-3">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {filtered.map(team => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="bg-card p-6 hover-glow transition-all"
              data-testid={`team-card-${team.id}`}
            >
              <Flag iso={team.iso2} size="lg" title={team.name} />
              <h3 className="font-display text-xl uppercase tracking-tight font-bold mt-3">{team.name}</h3>
              <div className="text-xs text-zinc-500 mt-1">Grupo {team.group} · {team.fifa_code}</div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="bg-card p-12 text-center text-zinc-500 col-span-full text-sm" data-testid="teams-empty">
              Sin resultados para “{q}”.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Teams;
