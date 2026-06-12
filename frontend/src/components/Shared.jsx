import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export const TeamFlag = ({ team, size = "md", showName = true, testId }) => {
  if (!team) return null;
  const sizes = { sm: "text-base", md: "text-2xl", lg: "text-4xl", xl: "text-6xl" };
  return (
    <div className="flex items-center gap-2" data-testid={testId}>
      <span className={sizes[size]}>{team.flag}</span>
      {showName && <span className="font-display uppercase font-semibold tracking-tight">{team.code}</span>}
    </div>
  );
};

export const LiveBadge = () => (
  <div className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
    <span className="w-2 h-2 rounded-full bg-red-500 live-dot" />
    LIVE
  </div>
);

export const MatchCard = ({ match, testId }) => {
  const home = match.home_team;
  const away = match.away_team;
  const isLive = match.status === "LIVE";
  const isFt = match.status === "FT";
  const date = new Date(match.kickoff);
  return (
    <Link
      to={`/matches/${match.id}`}
      data-testid={testId || `match-card-${match.id}`}
      className="block bg-card border border-white/10 p-5 hover-glow transition-all"
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
        <span>{match.phase} · {match.group ? `Grupo ${match.group}` : ""}</span>
        {isLive ? <LiveBadge /> : isFt ? <span className="text-zinc-400">FT</span> : <span className="font-mono">{date.toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">{home?.flag}</span>
          <span className="font-display font-bold uppercase tracking-tight text-sm sm:text-base">{home?.name}</span>
        </div>
        <div className="font-mono text-2xl sm:text-3xl text-white px-4">
          {match.status === "SCHEDULED" ? "vs" : `${match.score_home} - ${match.score_away}`}
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="font-display font-bold uppercase tracking-tight text-sm sm:text-base text-right">{away?.name}</span>
          <span className="text-3xl">{away?.flag}</span>
        </div>
      </div>
      {isLive && (
        <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-red-500 font-mono">
          MIN {match.minute}'
        </div>
      )}
      <div className="mt-3 text-xs text-zinc-500 font-mono">
        {match.stadium_info?.name} · {match.stadium_info?.city}
      </div>
    </Link>
  );
};

export const SectionHeader = ({ kicker, title, action, testId }) => {
  return (
    <div className="flex items-end justify-between mb-8" data-testid={testId}>
      <div>
        {kicker && <div className="text-[10px] tracking-[0.3em] uppercase text-neon mb-2 font-bold">{kicker}</div>}
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight uppercase">{title}</h2>
      </div>
      {action}
    </div>
  );
};
