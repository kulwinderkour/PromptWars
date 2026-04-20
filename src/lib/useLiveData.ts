"use client";

import { useState, useEffect, useCallback } from "react";
import type { Zone, QueuePoint, VenueNotification, RouteOption, MatchScore, ParkingZone, WeatherData } from "./data";

// --- Helpers ---

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function crowdLevelFromOccupancy(occ: number): Zone["crowdLevel"] {
  if (occ >= 90) return "critical";
  if (occ >= 70) return "high";
  if (occ >= 45) return "medium";
  return "low";
}

function trendFromDelta(delta: number): QueuePoint["trend"] {
  if (delta > 0) return "rising";
  if (delta < 0) return "falling";
  return "stable";
}

// --- Initial seed data ---

const ZONE_SEEDS: Zone[] = [
  { id: "z1", name: "North Stand", crowdLevel: "high", occupancy: 87, x: 50, y: 10 },
  { id: "z2", name: "South Stand", crowdLevel: "medium", occupancy: 62, x: 50, y: 90 },
  { id: "z3", name: "East Wing", crowdLevel: "low", occupancy: 34, x: 90, y: 50 },
  { id: "z4", name: "West Wing", crowdLevel: "critical", occupancy: 95, x: 10, y: 50 },
  { id: "z5", name: "Main Concourse", crowdLevel: "high", occupancy: 78, x: 50, y: 50 },
  { id: "z6", name: "Gate A Entrance", crowdLevel: "medium", occupancy: 55, x: 20, y: 15 },
  { id: "z7", name: "Gate B Entrance", crowdLevel: "low", occupancy: 28, x: 80, y: 15 },
  { id: "z8", name: "VIP Lounge", crowdLevel: "low", occupancy: 22, x: 75, y: 70 },
];

const QUEUE_SEEDS: QueuePoint[] = [
  { id: "q1", name: "Hot Dogs & Burgers", type: "food", waitMinutes: 12, trend: "rising", zone: "North Stand" },
  { id: "q2", name: "Pizza Corner", type: "food", waitMinutes: 5, trend: "falling", zone: "East Wing" },
  { id: "q3", name: "Craft Beer Bar", type: "food", waitMinutes: 18, trend: "rising", zone: "Main Concourse" },
  { id: "q4", name: "Restroom Block A", type: "restroom", waitMinutes: 8, trend: "stable", zone: "North Stand" },
  { id: "q5", name: "Restroom Block B", type: "restroom", waitMinutes: 3, trend: "falling", zone: "East Wing" },
  { id: "q6", name: "Restroom Block C", type: "restroom", waitMinutes: 14, trend: "rising", zone: "West Wing" },
  { id: "q7", name: "Gate A Security", type: "entry", waitMinutes: 6, trend: "falling", zone: "Gate A Entrance" },
  { id: "q8", name: "Gate B Security", type: "entry", waitMinutes: 2, trend: "stable", zone: "Gate B Entrance" },
  { id: "q9", name: "Fan Store", type: "merchandise", waitMinutes: 10, trend: "stable", zone: "Main Concourse" },
  { id: "q10", name: "Nachos Stand", type: "food", waitMinutes: 4, trend: "falling", zone: "South Stand" },
];

const NOTIFICATION_POOL: Omit<VenueNotification, "id" | "timestamp">[] = [
  { title: "Halftime approaching", message: "Concession lines expected to grow. Visit now for shorter wait.", type: "warning" },
  { title: "Gate B — Faster Entry", message: "Gate B currently has minimal wait. Recommended for latecomers.", type: "success" },
  { title: "West Wing Congestion", message: "West Wing is near capacity. Use East Wing corridors as an alternative.", type: "alert" },
  { title: "Flash Deal — South Stand", message: "50% off nachos at South Stand for the next 10 minutes!", type: "info" },
  { title: "Restroom Block B — Short Queue", message: "Only 2 minute wait at East Wing restrooms right now.", type: "success" },
  { title: "Main Concourse Crowded", message: "Consider using outer corridors to reach your seat.", type: "warning" },
  { title: "Second Half Starting Soon", message: "Head back to your seat in the next 5 minutes.", type: "info" },
  { title: "North Stand — High Density", message: "North Stand walkways are congested. Allow extra time.", type: "alert" },
  { title: "Craft Beer Bar — Long Wait", message: "18+ minute wait at Main Concourse. Pizza Corner is faster.", type: "warning" },
  { title: "VIP Lounge Open", message: "VIP lounge area has low crowd. Enjoy the space.", type: "info" },
];

const ROUTE_DESCRIPTIONS: { to: string; desc: string[] }[] = [
  { to: "Restroom Block B", desc: ["Via East Wing corridor", "Via South Stand walkway"] },
  { to: "Restroom Block A", desc: ["Via North Stand", "Via Main Concourse"] },
  { to: "Pizza Corner", desc: ["Via East Wing — quick access", "Via outer corridor"] },
  { to: "Hot Dogs & Burgers", desc: ["Via Main Concourse", "Via North Stand upper level"] },
];

// --- The hook ---

export interface LiveData {
  zones: Zone[];
  queues: QueuePoint[];
  notifications: VenueNotification[];
  routes: RouteOption[];
  matchScore: MatchScore;
  parking: ParkingZone[];
  weather: WeatherData;
  totalAttendees: number;
  avgWait: number;
}

export function useLiveData(intervalMs = 3000): LiveData {
  const buildState = useCallback(
    (prevZones?: Zone[], prevQueues?: QueuePoint[]): LiveData => {
      // Zones: drift occupancy by ±1..6 each tick
      const zones: Zone[] = (prevZones ?? ZONE_SEEDS).map((z) => {
        const delta = Math.round((Math.random() - 0.45) * 8); // slight upward bias
        const occ = clamp(z.occupancy + delta, 5, 99);
        return { ...z, occupancy: occ, crowdLevel: crowdLevelFromOccupancy(occ) };
      });

      // Queues: drift wait ±1..3 min each tick
      const queues: QueuePoint[] = (prevQueues ?? QUEUE_SEEDS).map((q) => {
        const delta = Math.round((Math.random() - 0.5) * 4);
        const wait = clamp(q.waitMinutes + delta, 1, 25);
        return { ...q, waitMinutes: wait, trend: trendFromDelta(delta) };
      });

      // Notifications: pick 4 random from pool, assign recency
      const shuffled = [...NOTIFICATION_POOL].sort(() => Math.random() - 0.5);
      const timestamps = ["just now", "1 min ago", "4 min ago", "9 min ago"];
      const notifications: VenueNotification[] = shuffled.slice(0, 4).map((n, i) => ({
        ...n,
        id: `n${i}`,
        timestamp: timestamps[i],
      }));

      // Routes: recalculate based on current zone occupancies
      const routes: RouteOption[] = ROUTE_DESCRIPTIONS.map((r, i) => {
        const estMin = Math.round(2 + Math.random() * 10);
        const level: RouteOption["crowdLevel"] =
          estMin <= 4 ? "low" : estMin <= 7 ? "medium" : "high";
        return {
          id: `r${i + 1}`,
          from: "Your Seat (Section 14)",
          to: r.to,
          estimatedMinutes: estMin,
          crowdLevel: level,
          description: pickRandom(r.desc),
        };
      }).sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);

      // Match score: minute ticks up, occasional goal chance
      const minute = clamp(45 + Math.round(Math.random() * 45), 45, 90);
      const homePoss = clamp(50 + Math.round((Math.random() - 0.5) * 20), 30, 70);
      const matchScore: MatchScore = {
        homeTeam: "Metro United",
        awayTeam: "City Rovers",
        homeScore: Math.random() > 0.95 ? 3 : 2,
        awayScore: Math.random() > 0.95 ? 2 : 1,
        minute,
        period: minute >= 90 ? "Full Time" : "2nd Half",
        possession: { home: homePoss, away: 100 - homePoss },
        shots: { home: 7 + Math.round(Math.random() * 6), away: 3 + Math.round(Math.random() * 5) },
        corners: { home: 3 + Math.round(Math.random() * 3), away: 1 + Math.round(Math.random() * 3) },
      };

      // Parking: drift occupancy
      const PARKING_SEEDS: ParkingZone[] = [
        { id: "p1", name: "Lot A — North", capacity: 800, occupied: 780, distance: "2 min walk", exitTime: "~18 min" },
        { id: "p2", name: "Lot B — East", capacity: 600, occupied: 410, distance: "5 min walk", exitTime: "~8 min" },
        { id: "p3", name: "Lot C — South", capacity: 1000, occupied: 620, distance: "7 min walk", exitTime: "~5 min" },
        { id: "p4", name: "Lot D — West", capacity: 500, occupied: 495, distance: "3 min walk", exitTime: "~22 min" },
        { id: "p5", name: "Garage 1", capacity: 1200, occupied: 890, distance: "4 min walk", exitTime: "~12 min" },
      ];
      const parking: ParkingZone[] = PARKING_SEEDS.map((p) => {
        const delta = Math.round((Math.random() - 0.4) * 10);
        const occ = clamp(p.occupied + delta, 0, p.capacity);
        const pct = occ / p.capacity;
        const exitMin = pct > 0.9 ? 15 + Math.round(Math.random() * 10) : pct > 0.6 ? 6 + Math.round(Math.random() * 8) : 3 + Math.round(Math.random() * 4);
        return { ...p, occupied: occ, exitTime: `~${exitMin} min` };
      });

      // Weather: slight temp drift
      const weather: WeatherData = {
        temp: 20 + Math.round(Math.random() * 4),
        feelsLike: 18 + Math.round(Math.random() * 4),
        condition: pickRandom(["clear", "partly-cloudy", "cloudy"] as WeatherData["condition"][]),
        humidity: 40 + Math.round(Math.random() * 15),
        wind: 8 + Math.round(Math.random() * 10),
        sunset: "20:34",
      };

      // Stats
      const totalAttendees = 42000 + Math.round(Math.random() * 8000);
      const avgWait = +(queues.reduce((s, q) => s + q.waitMinutes, 0) / queues.length).toFixed(1);

      return { zones, queues, notifications, routes, matchScore, parking, weather, totalAttendees, avgWait };
    },
    []
  );

  // Use deterministic initial state to avoid hydration mismatch
  // (Math.random differs between server and client renders)
  const [data, setData] = useState<LiveData>({
    zones: ZONE_SEEDS,
    queues: QUEUE_SEEDS,
    notifications: NOTIFICATION_POOL.slice(0, 4).map((n, i) => ({
      ...n,
      id: `n${i}`,
      timestamp: ["just now", "1 min ago", "4 min ago", "9 min ago"][i],
    })),
    routes: [
      { id: "r1", from: "Your Seat (Section 14)", to: "Restroom Block B", estimatedMinutes: 4, crowdLevel: "low" as const, description: "Via East Wing corridor" },
      { id: "r2", from: "Your Seat (Section 14)", to: "Pizza Corner", estimatedMinutes: 6, crowdLevel: "medium" as const, description: "Via East Wing — quick access" },
    ],
    matchScore: {
      homeTeam: "Metro United", awayTeam: "City Rovers",
      homeScore: 2, awayScore: 1, minute: 47, period: "2nd Half",
      possession: { home: 58, away: 42 },
      shots: { home: 9, away: 5 }, corners: { home: 4, away: 2 },
    },
    parking: [
      { id: "p1", name: "Lot A — North", capacity: 800, occupied: 780, distance: "2 min walk", exitTime: "~18 min" },
      { id: "p2", name: "Lot B — East", capacity: 600, occupied: 410, distance: "5 min walk", exitTime: "~8 min" },
      { id: "p3", name: "Lot C — South", capacity: 1000, occupied: 620, distance: "7 min walk", exitTime: "~5 min" },
      { id: "p4", name: "Lot D — West", capacity: 500, occupied: 495, distance: "3 min walk", exitTime: "~22 min" },
      { id: "p5", name: "Garage 1", capacity: 1200, occupied: 890, distance: "4 min walk", exitTime: "~12 min" },
    ],
    weather: { temp: 22, feelsLike: 20, condition: "partly-cloudy", humidity: 45, wind: 12, sunset: "20:34" },
    totalAttendees: 45000,
    avgWait: 8,
  });

  useEffect(() => {
    // Immediately randomize on mount, then continue at interval
    setData((prev) => buildState(prev.zones, prev.queues));
    const id = setInterval(() => {
      setData((prev) => buildState(prev.zones, prev.queues));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, buildState]);

  return data;
}
