import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStadiums } from "@/lib/api";
import { SectionHeader } from "@/components/Shared";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Stadiums = () => {
  const { data: stadiums } = useQuery({ queryKey: ["stadiums"], queryFn: fetchStadiums });
  const [selected, setSelected] = useState(null);

  // Project lat/lng to viewbox 0-1000 x 0-500 (rough equirectangular)
  const project = (lat, lng) => ({
    x: ((lng + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  });

  return (
    <div className="section-pad py-12" data-testid="page-stadiums">
      <SectionHeader kicker="MAPA INTERACTIVO" title="Estadios del Mundial" />

      {/* World map */}
      <div className="bg-card border border-white/10 p-4 mb-8 overflow-hidden" data-testid="map-svg-container">
        <svg viewBox="0 0 1000 500" className="w-full h-auto bg-black">
          {/* Continent silhouettes (simplified) */}
          <rect x="0" y="0" width="1000" height="500" fill="#050505" />
          {/* Americas */}
          <path d="M 180 80 L 250 70 L 280 140 L 260 220 L 310 280 L 290 360 L 230 430 L 180 410 L 170 340 L 150 270 L 130 200 L 140 130 Z" fill="#101418" stroke="#1a1f24" strokeWidth="0.5" />
          {/* Europe + Africa */}
          <path d="M 450 100 L 540 90 L 580 130 L 600 200 L 590 290 L 560 380 L 510 420 L 470 380 L 450 290 L 440 200 L 445 140 Z" fill="#101418" stroke="#1a1f24" strokeWidth="0.5" />
          {/* Asia */}
          <path d="M 620 80 L 800 70 L 850 140 L 870 200 L 850 260 L 800 290 L 750 280 L 700 240 L 660 180 L 630 120 Z" fill="#101418" stroke="#1a1f24" strokeWidth="0.5" />
          {/* Oceania */}
          <path d="M 800 340 L 880 340 L 900 380 L 850 410 L 800 390 Z" fill="#101418" stroke="#1a1f24" strokeWidth="0.5" />

          {/* Grid lines subtle */}
          {[100, 200, 300, 400].map(y => <line key={y} x1="0" x2="1000" y1={y} y2={y} stroke="#0d0d0d" strokeWidth="0.5" />)}
          {[200, 400, 600, 800].map(x => <line key={x} x1={x} x2={x} y1="0" y2="500" stroke="#0d0d0d" strokeWidth="0.5" />)}

          {/* Stadium markers */}
          {(stadiums || []).map(s => {
            const { x, y } = project(s.lat, s.lng);
            return (
              <g key={s.id} onClick={() => setSelected(s)} style={{ cursor: "pointer" }} data-testid={`map-marker-${s.id}`}>
                <circle cx={x} cy={y} r="10" fill="#00E5FF" opacity="0.2">
                  <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={x} cy={y} r="5" fill="#00E5FF" stroke="#fff" strokeWidth="1" />
                <text x={x + 8} y={y - 8} fontSize="10" fill="#fff" fontFamily="monospace">{s.city}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stadium grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {(stadiums || []).map(s => (
          <button key={s.id} onClick={() => setSelected(s)} className="bg-card text-left hover-glow transition-all" data-testid={`stadium-card-${s.id}`}>
            <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="p-5">
              <div className="font-display text-lg uppercase tracking-tight">{s.name}</div>
              <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1"><MapPin size={12} /> {s.city}, {s.country}</div>
              <div className="font-mono text-neon text-sm mt-3">{s.capacity.toLocaleString()} <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">capacidad</span></div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-card border-white/10 max-w-2xl" data-testid="stadium-dialog">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-3xl uppercase tracking-tight">{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${selected.image})` }} />
              <div className="grid grid-cols-3 gap-2">
                <div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">CIUDAD</div><div>{selected.city}</div></div>
                <div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">PAÍS</div><div>{selected.country}</div></div>
                <div><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">CAPACIDAD</div><div className="font-mono text-neon">{selected.capacity.toLocaleString()}</div></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stadiums;
