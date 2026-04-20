"use client";

import { Users, Timer, MapPin, Zap } from "lucide-react";

interface StatsBarProps {
  totalAttendees: number;
  avgWait: number;
  activeZones: number;
  totalZones: number;
  alertCount: number;
}

export default function StatsBar({ totalAttendees, avgWait, activeZones, totalZones, alertCount }: StatsBarProps) {
  const stats = [
    { icon: Users, label: "In Venue", value: totalAttendees.toLocaleString() },
    { icon: Timer, label: "Avg Wait", value: `${avgWait} min` },
    { icon: MapPin, label: "Active Zones", value: `${activeZones}/${totalZones}` },
    { icon: Zap, label: "Alerts Active", value: String(alertCount) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card flex items-center gap-3 !p-4">
          <div className="rounded-lg bg-neutral-100 p-2 text-black">
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className="text-lg font-bold text-black">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
