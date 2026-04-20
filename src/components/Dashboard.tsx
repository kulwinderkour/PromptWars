"use client";

import { useLiveData } from "@/lib/useLiveData";
import VenueMap from "./VenueMap";
import QueueStatus from "./QueueStatus";
import SmartNavigation from "./SmartNavigation";
import EventTimeline from "./EventTimeline";
import Notifications from "./Notifications";
import StatsBar from "./StatsBar";
import MatchScoreCard from "./MatchScoreCard";
import ParkingStatus from "./ParkingStatus";
import WeatherWidget from "./WeatherWidget";
import QuickActions from "./QuickActions";
import VenueLocation from "./VenueLocation";
import AiAssistant from "./AiAssistant";
import { Radio } from "lucide-react";

export default function Dashboard() {
  const data = useLiveData(3000);

  return (
    <main id="main-content" role="main" className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <header role="banner" className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-black p-2.5">
            <Radio className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VenueFlow</h1>
            <p className="text-xs text-neutral-500">
              Smart Venue Experience Platform
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-black" />
          <span className="text-xs text-black font-medium">Live</span>
        </div>
      </header>

      {/* Stats */}
      <StatsBar
        totalAttendees={data.totalAttendees}
        avgWait={data.avgWait}
        activeZones={data.zones.filter((z) => z.occupancy > 20).length}
        totalZones={data.zones.length}
        alertCount={data.notifications.length}
      />

      {/* Live Score + Weather row */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2">
          <MatchScoreCard score={data.matchScore} />
        </div>
        <WeatherWidget weather={data.weather} />
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Left column: Map + Navigation */}
        <div className="space-y-5 lg:col-span-2">
          <VenueMap zones={data.zones} />
          <div className="grid gap-5 md:grid-cols-2">
            <SmartNavigation routes={data.routes} />
            <EventTimeline />
          </div>
        </div>

        {/* Right column: Queues + Notifications */}
        <div className="space-y-5">
          <QueueStatus queues={data.queues} />
          <Notifications notifications={data.notifications} />
        </div>
      </div>

      {/* Bottom row: Parking + Quick Actions + Location */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ParkingStatus zones={data.parking} />
        <QuickActions />
        <VenueLocation />
      </div>

      {/* AI Assistant (floating) */}
      <AiAssistant data={data} />

      {/* Footer */}
      <footer role="contentinfo" className="mt-10 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500">
        VenueFlow — Crowd Intelligence for Sporting Venues &bull; Real-time
        data simulation for demonstration purposes
      </footer>
    </main>
  );
}
