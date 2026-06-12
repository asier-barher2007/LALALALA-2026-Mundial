import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/lib/api";
import { SectionHeader } from "@/components/Shared";

const Teams = () => {
  const { data: teams } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  return (
    <div className="section-pad py-12" data-testid="page-teams">
      <SectionHeader kicker="SELECCIONES" title={`${teams?.length || 0} selecciones`} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {(teams || []).map(team => (
          <Link key={team.id} to={`/teams/${team.id}`} className="bg-card p-6 hover-glow transition-all" data-testid={`team-card-${team.id}`}>
            <div className="text-5xl mb-3">{team.flag}</div>
            <h3 className="font-display text-xl uppercase tracking-tight font-bold">{team.name}</h3>
            <div className="text-xs text-zinc-500 mt-1">{team.confederation}</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="font-mono text-lg text-neon">#{team.ranking}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">FIFA</div>
              </div>
              <div>
                <div className="font-mono text-lg">{team.titles}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Títulos</div>
              </div>
              <div>
                <div className="font-mono text-lg">{team.appearances}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Mundi.</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Teams;
