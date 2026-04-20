"use client";

import { getCrowdColor } from "@/lib/data";
import type { RouteOption } from "@/lib/data";
import { Navigation, Clock, Users } from "lucide-react";

interface SmartNavigationProps {
  routes: RouteOption[];
}

export default function SmartNavigation({ routes }: SmartNavigationProps) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Navigation className="h-5 w-5 text-black" />
        <h2 className="text-lg font-semibold">Smart Routes</h2>
      </div>
      <p className="mb-4 text-xs text-neutral-500">
        AI-optimized paths from your current location
      </p>

      <div className="space-y-3">
        {routes.map((route, idx) => (
          <div
            key={route.id}
            className={`rounded-lg border p-3 ${
              idx === 0
                ? "border-black/20 bg-neutral-50"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {idx === 0 && (
              <span className="badge badge-green mb-2">Recommended</span>
            )}
            <p className="text-sm font-medium">{route.to}</p>
            <p className="mt-1 text-xs text-neutral-500">{route.description}</p>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-neutral-600">
                <Clock className="h-3 w-3" /> {route.estimatedMinutes} min
              </span>
              <span className="flex items-center gap-1" style={{ color: getCrowdColor(route.crowdLevel) }}>
                <Users className="h-3 w-3" /> {route.crowdLevel} traffic
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
