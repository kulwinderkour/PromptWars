"use client";

import type { MatchScore } from "@/lib/data";

interface MatchScoreCardProps {
  score: MatchScore;
}

export default function MatchScoreCard({ score }: MatchScoreCardProps) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Score</h2>
        <span className="badge badge-red">{score.period} &middot; {score.minute}&apos;</span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-center gap-6 py-4">
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-500">{score.homeTeam}</p>
          <p className="text-4xl font-bold text-black">{score.homeScore}</p>
        </div>
        <span className="text-lg text-neutral-300">—</span>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-500">{score.awayTeam}</p>
          <p className="text-4xl font-bold text-black">{score.awayScore}</p>
        </div>
      </div>

      {/* Stats bars */}
      <div className="mt-4 space-y-3">
        <StatRow label="Possession" home={score.possession.home} away={score.possession.away} unit="%" />
        <StatRow label="Shots" home={score.shots.home} away={score.shots.away} />
        <StatRow label="Corners" home={score.corners.home} away={score.corners.away} />
      </div>
    </div>
  );
}

function StatRow({ label, home, away, unit = "" }: { label: string; home: number; away: number; unit?: string }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
        <span>{home}{unit}</span>
        <span className="font-medium text-neutral-700">{label}</span>
        <span>{away}{unit}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div className="bg-black rounded-l-full transition-all duration-500" style={{ width: `${homePct}%` }} />
        <div className="bg-neutral-300 rounded-r-full flex-1" />
      </div>
    </div>
  );
}
