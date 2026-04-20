/**
 * Tests for the assistant API fallback logic.
 * Since we can't easily test the full Next.js route in unit tests,
 * we test the context-building and response patterns.
 */

describe("Assistant API — input sanitization", () => {
  function sanitize(input: string): string {
    return input.replace(/[<>{}]/g, "").trim().slice(0, 500);
  }

  test("strips HTML-like tags", () => {
    expect(sanitize("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script");
  });

  test("strips curly braces", () => {
    expect(sanitize('{"key":"value"}')).toBe('"key":"value"');
  });

  test("limits length to 500 characters", () => {
    const longInput = "a".repeat(1000);
    expect(sanitize(longInput).length).toBe(500);
  });

  test("trims whitespace", () => {
    expect(sanitize("  hello world  ")).toBe("hello world");
  });

  test("handles empty input", () => {
    expect(sanitize("")).toBe("");
  });
});

describe("Assistant API — fallback reply patterns", () => {
  const ctx = {
    crowdedZones: ["North Stand (85%)", "West Wing (78%)"],
    quietZones: ["East Wing", "South Stand"],
    shortestQueue: "Nachos Stand (3 min)",
    longestQueue: "Craft Beer Bar (18 min)",
    avgWait: 8,
    matchMinute: 67,
    matchScore: "Metro United 2 - 1 City Rovers",
    weather: "22°C, partly-cloudy, wind 12 km/h",
  };

  function generateFallbackReply(question: string, ctx: {
    crowdedZones: string[];
    quietZones: string[];
    shortestQueue: string;
    longestQueue: string;
    avgWait: number;
    matchMinute: number;
    matchScore: string;
    weather: string;
  }): string {
    const q = question.toLowerCase();
    if (q.includes("restroom") || q.includes("bathroom")) {
      return `Shortest restroom queue: ${ctx.shortestQueue}. Head via ${ctx.quietZones[0] || "nearest corridor"}.`;
    }
    if (q.includes("food") || q.includes("eat") || q.includes("hungry")) {
      return `${ctx.shortestQueue} has shortest wait. Avoid ${ctx.longestQueue}.`;
    }
    if (q.includes("crowd") || q.includes("busy")) {
      return `Crowded: ${ctx.crowdedZones.join(", ")}. Quiet: ${ctx.quietZones.join(", ")}.`;
    }
    if (q.includes("score") || q.includes("match")) {
      return `Score: ${ctx.matchScore} at ${ctx.matchMinute}'.`;
    }
    return `Average wait: ${ctx.avgWait} min. ${ctx.crowdedZones.length} zones crowded.`;
  }

  test("responds to restroom questions with queue data", () => {
    const reply = generateFallbackReply("Where is the nearest restroom?", ctx);
    expect(reply).toContain("Nachos Stand");
    expect(reply).toContain("East Wing");
  });

  test("responds to food questions", () => {
    const reply = generateFallbackReply("I'm hungry, what should I eat?", ctx);
    expect(reply).toContain("Nachos Stand");
    expect(reply).toContain("Craft Beer Bar");
  });

  test("responds to crowd questions", () => {
    const reply = generateFallbackReply("Which areas are busy?", ctx);
    expect(reply).toContain("North Stand");
    expect(reply).toContain("East Wing");
  });

  test("responds to score questions", () => {
    const reply = generateFallbackReply("What's the score?", ctx);
    expect(reply).toContain("Metro United 2 - 1 City Rovers");
    expect(reply).toContain("67");
  });

  test("gives generic response for unknown questions", () => {
    const reply = generateFallbackReply("Tell me a joke", ctx);
    expect(reply).toContain("8 min");
    expect(reply).toContain("2 zones");
  });
});
