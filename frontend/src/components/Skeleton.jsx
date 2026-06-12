import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} aria-busy="true" aria-live="polite" />
);

export const SkeletonCard = ({ rows = 3 }) => (
  <div className="bg-card border border-white/10 p-5 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-3/4" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-3 w-full" />
    ))}
  </div>
);

export const SkeletonMatchRow = () => (
  <div className="bg-card border border-white/10 p-5">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-6 w-12" />
      <Skeleton className="h-8 w-32" />
    </div>
  </div>
);
