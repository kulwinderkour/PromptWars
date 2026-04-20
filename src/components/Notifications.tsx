"use client";

import type { VenueNotification } from "@/lib/data";
import { Bell, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

function getIcon(type: string) {
  switch (type) {
    case "info":
      return <Info className="h-4 w-4 text-neutral-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-neutral-700" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-neutral-500" />;
    case "alert":
      return <AlertCircle className="h-4 w-4 text-black" />;
    default:
      return <Info className="h-4 w-4 text-neutral-400" />;
  }
}

function getBorderColor(type: string) {
  switch (type) {
    case "info":
      return "border-l-neutral-300";
    case "warning":
      return "border-l-neutral-500";
    case "success":
      return "border-l-neutral-300";
    case "alert":
      return "border-l-black";
    default:
      return "border-l-neutral-200";
  }
}

interface NotificationsProps {
  notifications: VenueNotification[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-black" />
        <h2 className="text-lg font-semibold">Live Alerts</h2>
        <span className="badge badge-red ml-auto">{notifications.length}</span>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-lg border-l-2 bg-neutral-50 p-3 ${getBorderColor(n.type)}`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{getIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{n.title}</p>
                  <span className="text-[10px] text-neutral-400">{n.timestamp}</span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
