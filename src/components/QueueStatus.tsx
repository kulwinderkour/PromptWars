"use client";

import { getQueueTypeIcon } from "@/lib/data";
import type { QueuePoint } from "@/lib/data";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type FilterType = "all" | "food" | "restroom" | "entry" | "merchandise";

interface QueueStatusProps {
  queues: QueuePoint[];
}

export default function QueueStatus({ queues }: QueueStatusProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? queues : queues.filter((q) => q.type === filter);
  const sorted = [...filtered].sort((a, b) => a.waitMinutes - b.waitMinutes);

  function getTrendIcon(trend: string) {
    if (trend === "rising") return <TrendingUp className="h-3.5 w-3.5 text-black" />;
    if (trend === "falling") return <TrendingDown className="h-3.5 w-3.5 text-neutral-400" />;
    return <Minus className="h-3.5 w-3.5 text-neutral-300" />;
  }

  function getWaitBadge(minutes: number) {
    if (minutes <= 5) return "badge-green";
    if (minutes <= 10) return "badge-yellow";
    return "badge-red";
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "food", label: "Food" },
    { key: "restroom", label: "Restrooms" },
    { key: "entry", label: "Gates" },
    { key: "merchandise", label: "Shops" },
  ];

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Queue Wait Times</h2>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Queue list */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {sorted.map((q) => (
          <div
            key={q.id}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 border border-neutral-100 hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{getQueueTypeIcon(q.type)}</span>
              <div>
                <p className="text-sm font-medium text-black">{q.name}</p>
                <p className="text-xs text-neutral-500">{q.zone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(q.trend)}
              <span className={`badge ${getWaitBadge(q.waitMinutes)}`}>
                {q.waitMinutes} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
