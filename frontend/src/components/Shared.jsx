import React from "react";
import { Link } from "react-router-dom";
import Flag from "@/components/Flag";

export const LiveBadge = () => (
  <div className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
    <span className="w-2 h-2 rounded-full bg-red-500 live-dot" />
    LIVE
  </div>
);

const renderKickoff = (date) =>
  date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const MatchCard = ({ match, testId }) => {
  const home = match.home_team;
  const away = match.away_team;
  const isLive = match.status === "LIVE";
  const isFt = match.status === "FT";
  const date = match.kickoff ? new Date(match.kickoff) : null;

  const renderStatusBadge = () => {
    if (isLive) return <LiveBadge />;
    if (isFt) return <span className="text-zinc-400">FT</span>;
    return <span className="font-mono">{date ? renderKickoff(date) : "TBD"}</span>;
  };

  const renderScore = () => {
    if (match.status === "SCHEDULED") return "vs";
    return `${match.score_home} - ${match.score_away}`;
  };

  return (
    <Link
      to={`/matches/${match.id}`}
      data-testid={testId || `match-card-${match.id}`}
      className="block bg-card border border-white/10 p-5 hover-glow transition-all"
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
        <span>{match.phase}{match.group ? ` · Grupo ${match.group}` : ""}</span>
        {renderStatusBadge()}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Flag iso={home?.iso2} size="md" title={home?.name} />
          <span className="font-display font-bold uppercase tracking-tight text-sm sm:text-base truncate">{home?.name}</span>
        </div>
        <div className="font-mono text-2xl sm:text-3xl text-white px-4 whitespace-nowrap">
          {renderScore()}
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="font-display font-bold uppercase tracking-tight text-sm sm:text-base text-right truncate">{away?.name}</span>
          <Flag iso={away?.iso2} size="md" title={away?.name} />
        </div>
      </div>
      {isLive && (
        <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-red-500 font-mono">
          MIN {match.minute}&apos;
        </div>
      )}
      <div className="mt-3 text-xs text-zinc-500 font-mono truncate">
        {match.stadium_info?.name} · {match.stadium_info?.city}
      </div>
    </Link>
  );
};

export const SectionHeader = ({ kicker, title, action, testId }) => (
  <div className="flex items-end justify-between mb-8 gap-4 flex-wrap" data-testid={testId}>
    <div>
      {kicker && <div className="text-[10px] tracking-[0.3em] uppercase text-neon mb-2 font-bold">{kicker}</div>}
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight uppercase">{title}</h2>
    </div>
    {action}
  </div>
);
