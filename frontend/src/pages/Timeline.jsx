import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "@/lib/api";
import { SectionHeader } from "@/components/Shared";

const Timeline = () => {
  const { data: timeline } = useQuery({ queryKey: ["timeline"], queryFn: fetchTimeline });

  return (
    <div className="section-pad py-12" data-testid="page-timeline">
      <SectionHeader kicker="HISTORIA" title="Mundial Timeline" />
      <p className="text-zinc-400 mb-8 max-w-2xl">Recorre la historia del Mundial desde 1930 hasta 2026: campeones, sedes, máximos goleadores y récords.</p>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-8">
          {(timeline || []).map((t, idx) => {
            const isRight = idx % 2 === 0;
            return (
              <div key={t.year} className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${isRight ? "" : "md:[direction:rtl]"}`} data-testid={`timeline-item-${t.year}`}>
                <div className={`md:[direction:ltr] ${isRight ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <div className="absolute left-2 md:left-1/2 top-2 -translate-x-1/2 w-4 h-4 bg-neon border-2 border-black" />
                  <div className="font-mono text-4xl text-neon font-bold">{t.year}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">SEDE</div>
                  <div className="font-display text-xl uppercase">{t.host}</div>
                </div>
                <div className={`md:[direction:ltr] bg-card border border-white/10 p-5 mt-3 md:mt-0 ${isRight ? "" : ""}`}>
                  {t.champion_info ? (
                    <>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">CAMPEÓN</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">{t.champion_info?.flag}</span>
                        <span className="font-display text-lg uppercase tracking-tight">{t.champion_info?.name}</span>
                      </div>
                      {t.runnerup_info && (
                        <div className="text-xs text-zinc-400 mt-2">
                          Subcampeón: {t.runnerup_info.flag} {t.runnerup_info.name}
                        </div>
                      )}
                      {t.top_scorer && <div className="text-xs text-zinc-400 mt-1">Pichichi: {t.top_scorer}</div>}
                      <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{t.fact}</p>
                    </>
                  ) : (
                    <>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-red-500">PRÓXIMA EDICIÓN</div>
                      <p className="text-sm text-zinc-300 mt-2">{t.fact}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
