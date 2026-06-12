import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTeam, aiStory, fetchFanDashboard } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Calendar, Users } from "lucide-react";
import { MatchCard } from "@/components/Shared";
import Flag from "@/components/Flag";
import SEO from "@/components/SEO";

const TeamDetail = () => {
  const { id } = useParams();
  const { data: team } = useQuery({ queryKey: ["team", id], queryFn: () => fetchTeam(id), refetchInterval: 60_000 });
  const { data: fan } = useQuery({ queryKey: ["fan", id], queryFn: () => fetchFanDashboard(id), refetchInterval: 60_000 });

  const [story, setStory] = useState(null);
  const storyMut = useMutation({ mutationFn: () => aiStory(id), onSuccess: setStory });

  if (!team) return <div className="section-pad py-12 text-zinc-500" data-testid="loading">Cargando…</div>;

  const stats = [
    { id: "group", l: "Grupo", v: team.group || "—", icon: Trophy },
    { id: "code", l: "FIFA", v: team.fifa_code || "—", icon: Calendar },
    { id: "played", l: "Jugados", v: team.history?.played ?? 0, icon: Sparkles },
    { id: "players", l: "Jugadores", v: team.players?.length || 0, icon: Users },
  ];

  return (
    <div data-testid="page-team-detail">
      <SEO title={team.name} description={`Ficha de ${team.name} en el Mundial 2026.`} />
      {/* Hero */}
      <section className="relative border-b border-white/10 grain">
        <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${team.color}, transparent)` }} />
        <div className="relative section-pad py-12">
          <div className="flex items-center gap-6 flex-wrap">
            <Flag iso={team.iso2} size="2xl" title={team.name} />
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-neon font-bold mb-2">{team.fifa_code} · Grupo {team.group}</div>
              <h1 className="font-display font-bold text-4xl sm:text-6xl uppercase tracking-tighter">{team.name}</h1>
              <div className="text-zinc-400 mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm font-mono">
                <span>{team.name_fa}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 mt-10">
            {stats.map((s) => (
              <div key={s.id} className="bg-card p-4">
                <s.icon size={16} className="text-neon mb-2" />
                <div className="font-mono text-2xl">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-pad py-12">
        <Tabs defaultValue="history">
          <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start gap-6 p-0 h-auto mb-8 overflow-x-auto">
            {[
              { v: "history", l: "Historia" },
              { v: "story", l: "Story Mode IA" },
              { v: "calendar", l: "Calendario" },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v} data-testid={`tab-${t.v}`}
                className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon text-xs uppercase tracking-[0.2em] px-0 pb-3 whitespace-nowrap">
                {t.l}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="history" data-testid="content-history">
            <div className="bg-card border border-white/10 p-6">
              <h3 className="font-display text-2xl uppercase mb-4">Récord en este Mundial</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/10 border border-white/10">
                {[
                  { id: "wins", l: "Victorias", v: team.history?.wins },
                  { id: "draws", l: "Empates", v: team.history?.draws },
                  { id: "losses", l: "Derrotas", v: team.history?.losses },
                  { id: "gf", l: "GF", v: team.history?.goals_for },
                  { id: "ga", l: "GC", v: team.history?.goals_against },
                ].map((s) => (
                  <div key={s.id} className="bg-card p-4">
                    <div className="font-mono text-2xl text-white">{s.v ?? 0}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="story" data-testid="content-story">
            <div className="bg-card border border-white/10 p-8">
              <Sparkles size={32} className="text-neon mb-4" />
              <h3 className="font-display text-2xl uppercase mb-2">World Cup Story Mode</h3>
              <p className="text-zinc-400 text-sm mb-6">Narrativa visual inmersiva generada por Claude AI</p>
              {!story && (
                <Button data-testid="btn-story" onClick={() => storyMut.mutate()} disabled={storyMut.isPending}
                  className="bg-neon text-black hover:bg-cyan-300 rounded-none uppercase tracking-widest text-xs">
                  {storyMut.isPending ? "Generando historia…" : "Generar Story Mode con IA"}
                </Button>
              )}
              {story && (
                <div data-testid="story-result">
                  {story.tagline && <div className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-neon mb-8">&ldquo;{story.tagline}&rdquo;</div>}
                  <div className="space-y-6">
                    {(story.chapters || []).map((c) => (
                      <div key={`${c.year}-${c.title}`} className="border-l-2 border-neon pl-6 py-2">
                        <div className="font-mono text-xs text-zinc-500">{c.year}</div>
                        <h4 className="font-display text-xl uppercase tracking-tight mt-1">{c.title}</h4>
                        <p className="text-zinc-300 mt-2 leading-relaxed">{c.narrative}</p>
                      </div>
                    ))}
                  </div>
                  {story.iconic_moment && (
                    <div className="mt-8 bg-black/40 border border-white/10 p-6">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-neon mb-2">MOMENTO ICÓNICO</div>
                      <p className="text-zinc-200">{story.iconic_moment}</p>
                    </div>
                  )}
                  {story.legends?.length > 0 && (
                    <div className="mt-6">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">LEYENDAS</div>
                      <div className="flex flex-wrap gap-2">
                        {story.legends.map((l) => (
                          <span key={l} className="border border-white/20 px-3 py-1 text-sm uppercase tracking-wide">{l}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" data-testid="content-calendar">
            <div className="space-y-3">
              {[...(fan?.live || []), ...(fan?.upcoming || []), ...(fan?.recent || [])].map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
              {(!fan || (fan.live?.length === 0 && fan.upcoming?.length === 0 && fan.recent?.length === 0)) && (
                <div className="text-zinc-500 text-sm border border-dashed border-white/10 p-8 text-center">Sin partidos en el calendario.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamDetail;
