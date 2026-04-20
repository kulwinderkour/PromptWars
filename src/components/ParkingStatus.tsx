"use client";

import type { ParkingZone } from "@/lib/data";
import { Car, Clock } from "lucide-react";

interface ParkingStatusProps {
  zones: ParkingZone[];
}

export default function ParkingStatus({ zones }: ParkingStatusProps) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Car className="h-5 w-5 text-black" />
        <h2 className="text-lg font-semibold">Parking Status</h2>
      </div>
      <p className="mb-4 text-xs text-neutral-500">
        Plan your exit — estimated drive-out times based on current fill
      </p>

      <div className="space-y-3">
        {zones.map((zone) => {
          const pct = Math.round((zone.occupied / zone.capacity) * 100);
          const isFull = pct >= 95;

          return (
            <div key={zone.id} className="rounded-lg border border-neutral-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-black">{zone.name}</p>
                  <p className="text-xs text-neutral-500">{zone.distance}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-neutral-600">
                    <Clock className="h-3 w-3" />
                    <span>Exit: {zone.exitTime}</span>
                  </div>
                  {isFull && <span className="badge badge-red mt-1">Full</span>}
                </div>
              </div>

              {/* Fill bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 90 ? "bg-black" : pct >= 60 ? "bg-neutral-500" : "bg-blue-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 min-w-[3rem] text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
