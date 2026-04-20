"use client";

import { MapPin, UtensilsCrossed, ShieldAlert, Ticket, Phone, HelpCircle } from "lucide-react";
import { useState } from "react";

const actions = [
  { icon: MapPin, label: "Nearest Restroom", desc: "Restroom Block B — 2 min away" },
  { icon: UtensilsCrossed, label: "Order to Seat", desc: "Browse food menu and get it delivered" },
  { icon: ShieldAlert, label: "Report Issue", desc: "Flag safety or facility problems" },
  { icon: Ticket, label: "Seat Upgrade", desc: "Check available premium seats" },
  { icon: Phone, label: "Contact Staff", desc: "Reach venue support directly" },
  { icon: HelpCircle, label: "Venue Info", desc: "WiFi, rules, first aid locations" },
];

export default function QuickActions() {
  const [tapped, setTapped] = useState<string | null>(null);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => setTapped(tapped === a.label ? null : a.label)}
            className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors ${
              tapped === a.label
                ? "border-black bg-neutral-50"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <a.icon className="h-4 w-4 mt-0.5 text-black flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-black">{a.label}</p>
              <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">{a.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
