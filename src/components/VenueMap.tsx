"use client";

import { getCrowdColor } from "@/lib/data";
import type { Zone } from "@/lib/data";
import { useState } from "react";

interface VenueMapProps {
  zones: Zone[];
}

export default function VenueMap({ zones }: VenueMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="card col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Venue Density Map</h2>
        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-300" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-700" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-black" /> Critical
          </span>
        </div>
      </div>

      {/* Stylized venue map */}
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-white border border-neutral-200">
        {/* Field outline */}
        <div className="absolute inset-[15%] rounded-xl border-2 border-neutral-200" />
        <div className="absolute inset-[25%] rounded-lg border border-neutral-150" />
        <div className="absolute left-1/2 top-[15%] bottom-[15%] w-px bg-neutral-200" />
        <div className="absolute top-1/2 left-[15%] right-[15%] h-px bg-neutral-200" />

        {/* Zone indicators */}
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHoveredZone(zone.id)}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: getCrowdColor(zone.crowdLevel) + "25", border: `2px solid ${getCrowdColor(zone.crowdLevel)}` }}
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getCrowdColor(zone.crowdLevel) }}
              />
            </div>
            {hoveredZone === zone.id && (
              <div className="absolute -bottom-12 z-10 whitespace-nowrap rounded-md bg-white px-3 py-1.5 text-xs shadow-sm border border-neutral-200">
                <p className="font-medium text-black">{zone.name}</p>
                <p className="text-neutral-500">{zone.occupancy}% capacity</p>
              </div>
            )}
          </div>
        ))}

        {/* Your position indicator */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: "65%", top: "55%", transform: "translate(-50%, -50%)" }}
        >
          <div className="h-4 w-4 rounded-full bg-black ring-4 ring-black/10" />
          <span className="mt-1 text-[10px] font-medium text-black">You</span>
        </div>
      </div>
    </div>
  );
}
