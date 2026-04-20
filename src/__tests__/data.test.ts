import {
  zones,
  queuePoints,
  notifications,
  eventTimeline,
  routes,
  getCrowdColor,
  getQueueTypeIcon,
  parkingZones,
  weather,
  matchScore,
} from "@/lib/data";

describe("Static data integrity", () => {
  test("zones array has entries with valid fields", () => {
    expect(zones.length).toBeGreaterThan(0);
    zones.forEach((z) => {
      expect(z.id).toBeDefined();
      expect(z.name).toBeTruthy();
      expect(z.occupancy).toBeGreaterThanOrEqual(0);
      expect(z.occupancy).toBeLessThanOrEqual(100);
      expect(["low", "medium", "high", "critical"]).toContain(z.crowdLevel);
    });
  });

  test("queues array has entries with valid types", () => {
    expect(queuePoints.length).toBeGreaterThan(0);
    queuePoints.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.waitMinutes).toBeGreaterThanOrEqual(0);
      expect(["food", "restroom", "entry", "merchandise"]).toContain(q.type);
      expect(["rising", "falling", "stable"]).toContain(q.trend);
    });
  });

  test("notifications array has valid structure", () => {
    expect(notifications.length).toBeGreaterThan(0);
    notifications.forEach((n) => {
      expect(n.id).toBeDefined();
      expect(n.title).toBeTruthy();
      expect(n.message).toBeTruthy();
      expect(["info", "warning", "success", "alert"]).toContain(n.type);
    });
  });

  test("events array has entries", () => {
    expect(eventTimeline.length).toBeGreaterThan(0);
  });

  test("routes array has valid structure", () => {
    expect(routes.length).toBeGreaterThan(0);
    routes.forEach((r) => {
      expect(r.from).toBeTruthy();
      expect(r.to).toBeTruthy();
      expect(r.estimatedMinutes).toBeGreaterThan(0);
      expect(["low", "medium", "high"]).toContain(r.crowdLevel);
    });
  });

  test("parkingZones has valid fill levels", () => {
    expect(parkingZones.length).toBeGreaterThan(0);
    parkingZones.forEach((p) => {
      expect(p.occupied).toBeLessThanOrEqual(p.capacity);
      expect(p.occupied).toBeGreaterThanOrEqual(0);
    });
  });

  test("matchScore has valid structure", () => {
    expect(matchScore.homeTeam).toBeTruthy();
    expect(matchScore.awayTeam).toBeTruthy();
    expect(matchScore.homeScore).toBeGreaterThanOrEqual(0);
    expect(matchScore.minute).toBeGreaterThanOrEqual(0);
    expect(matchScore.possession.home + matchScore.possession.away).toBe(100);
  });

  test("weather has valid range", () => {
    expect(weather.temp).toBeGreaterThan(-50);
    expect(weather.temp).toBeLessThan(60);
    expect(weather.humidity).toBeGreaterThanOrEqual(0);
    expect(weather.humidity).toBeLessThanOrEqual(100);
  });
});

describe("getCrowdColor", () => {
  test("returns a hex color for each crowd level", () => {
    expect(getCrowdColor("low")).toMatch(/^#[0-9a-f]{6}$/i);
    expect(getCrowdColor("medium")).toMatch(/^#[0-9a-f]{6}$/i);
    expect(getCrowdColor("high")).toMatch(/^#[0-9a-f]{6}$/i);
    expect(getCrowdColor("critical")).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test("returns fallback for unknown level", () => {
    expect(getCrowdColor("unknown")).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe("getQueueTypeIcon", () => {
  test("returns emoji for known types", () => {
    expect(getQueueTypeIcon("food")).toBe("🍔");
    expect(getQueueTypeIcon("restroom")).toBe("🚻");
    expect(getQueueTypeIcon("entry")).toBe("🚪");
    expect(getQueueTypeIcon("merchandise")).toBe("🛍️");
  });

  test("returns fallback for unknown type", () => {
    expect(getQueueTypeIcon("other")).toBe("📍");
  });
});
