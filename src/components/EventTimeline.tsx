"use client";

import { eventTimeline } from "@/lib/data";
import { Clock } from "lucide-react";

export default function EventTimeline() {
  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-black" />
        <h2 className="text-lg font-semibold">Event Timeline</h2>
      </div>

      <div className="relative ml-3">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200" />

        <div className="space-y-4">
          {eventTimeline.map((event) => (
            <div key={event.id} className="relative flex items-center gap-3 pl-5">
              {/* Dot */}
              <div
                className={`absolute left-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${
                  event.status === "current"
                    ? "bg-black ring-4 ring-black/10"
                    : event.status === "past"
                    ? "bg-neutral-400"
                    : "bg-white border border-neutral-300"
                }`}
              />
              <span className="min-w-[3rem] text-xs text-neutral-500">{event.time}</span>
              <span
                className={`text-sm ${
                  event.status === "current"
                    ? "font-semibold text-black"
                    : event.status === "past"
                    ? "text-neutral-400"
                    : "text-neutral-500"
                }`}
              >
                {event.label}
              </span>
              {event.status === "current" && (
                <span className="badge badge-blue ml-auto">Now</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
