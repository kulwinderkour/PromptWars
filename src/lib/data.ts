// Simulated real-time venue data

export interface Zone {
  id: string;
  name: string;
  crowdLevel: "low" | "medium" | "high" | "critical";
  occupancy: number; // percentage
  x: number; // position on map (%)
  y: number;
}

export interface QueuePoint {
  id: string;
  name: string;
  type: "food" | "restroom" | "entry" | "merchandise";
  waitMinutes: number;
  trend: "rising" | "falling" | "stable";
  zone: string;
}

export interface VenueNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  timestamp: string;
}

export interface EventMilestone {
  id: string;
  time: string;
  label: string;
  status: "past" | "current" | "upcoming";
}

export interface RouteOption {
  id: string;
  from: string;
  to: string;
  estimatedMinutes: number;
  crowdLevel: "low" | "medium" | "high";
  description: string;
}

export const zones: Zone[] = [
  { id: "z1", name: "North Stand", crowdLevel: "high", occupancy: 87, x: 50, y: 10 },
  { id: "z2", name: "South Stand", crowdLevel: "medium", occupancy: 62, x: 50, y: 90 },
  { id: "z3", name: "East Wing", crowdLevel: "low", occupancy: 34, x: 90, y: 50 },
  { id: "z4", name: "West Wing", crowdLevel: "critical", occupancy: 95, x: 10, y: 50 },
  { id: "z5", name: "Main Concourse", crowdLevel: "high", occupancy: 78, x: 50, y: 50 },
  { id: "z6", name: "Gate A Entrance", crowdLevel: "medium", occupancy: 55, x: 20, y: 15 },
  { id: "z7", name: "Gate B Entrance", crowdLevel: "low", occupancy: 28, x: 80, y: 15 },
  { id: "z8", name: "VIP Lounge", crowdLevel: "low", occupancy: 22, x: 75, y: 70 },
];

export const queuePoints: QueuePoint[] = [
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

export const notifications: VenueNotification[] = [
  {
    id: "n1",
    title: "Halftime in 5 minutes",
    message: "Expect increased crowd movement toward concessions. Consider visiting restrooms now.",
    type: "warning",
    timestamp: "2 min ago",
  },
  {
    id: "n2",
    title: "Gate B — Faster Entry",
    message: "Gate B currently has minimal wait. Recommended for latecomers.",
    type: "success",
    timestamp: "5 min ago",
  },
  {
    id: "n3",
    title: "West Wing Congestion",
    message: "West Wing is near capacity. Use East Wing corridors as an alternative.",
    type: "alert",
    timestamp: "8 min ago",
  },
  {
    id: "n4",
    title: "Flash Deal — Section 12",
    message: "50% off nachos at South Stand for the next 10 minutes!",
    type: "info",
    timestamp: "12 min ago",
  },
];

export const eventTimeline: EventMilestone[] = [
  { id: "e1", time: "18:00", label: "Gates Open", status: "past" },
  { id: "e2", time: "18:45", label: "Pre-game Show", status: "past" },
  { id: "e3", time: "19:00", label: "Kickoff", status: "past" },
  { id: "e4", time: "19:45", label: "Halftime", status: "current" },
  { id: "e5", time: "20:00", label: "Second Half", status: "upcoming" },
  { id: "e6", time: "20:45", label: "Full Time", status: "upcoming" },
  { id: "e7", time: "21:00", label: "Post-match Exits", status: "upcoming" },
];

export const routes: RouteOption[] = [
  {
    id: "r1",
    from: "Your Seat (Section 14)",
    to: "Restroom Block B",
    estimatedMinutes: 3,
    crowdLevel: "low",
    description: "Via East Wing corridor — minimal congestion",
  },
  {
    id: "r2",
    from: "Your Seat (Section 14)",
    to: "Restroom Block A",
    estimatedMinutes: 7,
    crowdLevel: "high",
    description: "Via North Stand — heavy traffic expected",
  },
  {
    id: "r3",
    from: "Your Seat (Section 14)",
    to: "Pizza Corner",
    estimatedMinutes: 4,
    crowdLevel: "low",
    description: "Via East Wing — quick access, short queue",
  },
  {
    id: "r4",
    from: "Your Seat (Section 14)",
    to: "Hot Dogs & Burgers",
    estimatedMinutes: 9,
    crowdLevel: "high",
    description: "Via Main Concourse — expect delays",
  },
];

export function getCrowdColor(level: string): string {
  switch (level) {
    case "low":
      return "#93c5fd";
    case "medium":
      return "#3b82f6";
    case "high":
      return "#1d4ed8";
    case "critical":
      return "#000000";
    default:
      return "#bfdbfe";
  }
}

export function getQueueTypeIcon(type: string): string {
  switch (type) {
    case "food":
      return "🍔";
    case "restroom":
      return "🚻";
    case "entry":
      return "🚪";
    case "merchandise":
      return "🛍️";
    default:
      return "📍";
  }
}

// --- Match Score ---

export interface MatchScore {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  period: "1st Half" | "Halftime" | "2nd Half" | "Full Time";
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  corners: { home: number; away: number };
}

export const matchScore: MatchScore = {
  homeTeam: "Metro United",
  awayTeam: "City Rovers",
  homeScore: 2,
  awayScore: 1,
  minute: 47,
  period: "2nd Half",
  possession: { home: 58, away: 42 },
  shots: { home: 9, away: 5 },
  corners: { home: 4, away: 2 },
};

// --- Parking Zones ---

export interface ParkingZone {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  distance: string;
  exitTime: string;
}

export const parkingZones: ParkingZone[] = [
  { id: "p1", name: "Lot A — North", capacity: 800, occupied: 780, distance: "2 min walk", exitTime: "~18 min" },
  { id: "p2", name: "Lot B — East", capacity: 600, occupied: 410, distance: "5 min walk", exitTime: "~8 min" },
  { id: "p3", name: "Lot C — South", capacity: 1000, occupied: 620, distance: "7 min walk", exitTime: "~5 min" },
  { id: "p4", name: "Lot D — West", capacity: 500, occupied: 495, distance: "3 min walk", exitTime: "~22 min" },
  { id: "p5", name: "Garage 1", capacity: 1200, occupied: 890, distance: "4 min walk", exitTime: "~12 min" },
];

// --- Weather ---

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: "clear" | "cloudy" | "rainy" | "windy" | "partly-cloudy";
  humidity: number;
  wind: number;
  sunset: string;
}

export const weather: WeatherData = {
  temp: 22,
  feelsLike: 20,
  condition: "partly-cloudy",
  humidity: 45,
  wind: 12,
  sunset: "20:34",
};
