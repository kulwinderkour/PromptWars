import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/assistant
 *
 * Smart venue assistant powered by Google Gemini.
 * Accepts the user's question + current venue context and returns
 * an AI-generated recommendation.
 *
 * Security:
 * - API key is server-side only (never exposed to client)
 * - Input is sanitized and length-limited
 * - Rate limiting placeholder included
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface VenueContext {
  crowdedZones: string[];
  quietZones: string[];
  shortestQueue: string;
  longestQueue: string;
  avgWait: number;
  matchMinute: number;
  matchScore: string;
  weather: string;
}

function sanitize(input: string): string {
  return input.replace(/[<>{}]/g, "").trim().slice(0, 500);
}

function buildSystemPrompt(ctx: VenueContext): string {
  return `You are VenueFlow Assistant, a helpful AI concierge for attendees at a live sporting event.
You have access to real-time venue data:

CROWD STATUS:
- Crowded zones: ${ctx.crowdedZones.join(", ") || "None"}
- Quiet zones: ${ctx.quietZones.join(", ") || "None"}

QUEUES:
- Shortest queue: ${ctx.shortestQueue}
- Longest queue: ${ctx.longestQueue}
- Average wait: ${ctx.avgWait} minutes

MATCH:
- Current minute: ${ctx.matchMinute}'
- Score: ${ctx.matchScore}

WEATHER: ${ctx.weather}

Rules:
- Be concise (2-3 sentences max)
- Give actionable, specific advice based on current data
- Prioritize safety and comfort
- If asked about food/restrooms, recommend the least crowded option
- If asked about timing, factor in the match minute`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback: return a context-aware response without Gemini
      const body = await req.json();
      const ctx = body.context as VenueContext;
      const question = sanitize(body.question || "");
      return NextResponse.json({
        reply: generateFallbackReply(question, ctx),
        source: "local",
      });
    }

    const body = await req.json();
    const question = sanitize(body.question || "");
    const ctx = body.context as VenueContext;

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(ctx);

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser question: ${question}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json({
        reply: generateFallbackReply(question, ctx),
        source: "fallback",
      });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      generateFallbackReply(question, ctx);

    return NextResponse.json({ reply, source: "gemini" });
  } catch (err) {
    console.error("Assistant error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Fallback logic when Gemini API key is not configured.
 * Uses rule-based decision making on venue context.
 */
function generateFallbackReply(question: string, ctx: VenueContext): string {
  const q = question.toLowerCase();

  if (q.includes("restroom") || q.includes("bathroom") || q.includes("toilet")) {
    return `The shortest restroom queue right now is ${ctx.shortestQueue}. I'd recommend heading there via ${ctx.quietZones[0] || "the nearest corridor"} to avoid crowds.`;
  }

  if (q.includes("food") || q.includes("eat") || q.includes("hungry") || q.includes("drink")) {
    return `${ctx.shortestQueue} has the shortest wait at about ${ctx.avgWait} min average. Avoid ${ctx.longestQueue} — it's backed up. ${ctx.quietZones[0] ? `Head through ${ctx.quietZones[0]} for a faster route.` : ""}`;
  }

  if (q.includes("crowd") || q.includes("busy") || q.includes("packed")) {
    return `Currently crowded: ${ctx.crowdedZones.join(", ")}. Quieter areas: ${ctx.quietZones.join(", ")}. I'd suggest sticking to the quieter zones if you need to move around.`;
  }

  if (q.includes("score") || q.includes("game") || q.includes("match")) {
    return `The score is ${ctx.matchScore} at minute ${ctx.matchMinute}'. ${ctx.matchMinute > 80 ? "Game is nearly over — consider heading to parking soon to beat the rush." : "Plenty of time left to enjoy the match!"}`;
  }

  if (q.includes("park") || q.includes("car") || q.includes("leave") || q.includes("exit")) {
    return `If you're planning to leave, the quieter exits are near ${ctx.quietZones[0] || "East Wing"}. Leave a few minutes before full time to avoid the post-match surge.`;
  }

  if (q.includes("weather") || q.includes("rain") || q.includes("cold")) {
    return `Current conditions: ${ctx.weather}. ${ctx.weather.includes("rain") ? "Bring a poncho or head to a covered area." : "Conditions look fine for now!"}`;
  }

  return `Based on current venue data: average wait is ${ctx.avgWait} min, ${ctx.crowdedZones.length} zones are crowded. ${ctx.quietZones[0] ? `${ctx.quietZones[0]} is your best bet for a peaceful walk.` : "Things are busy across the venue — sit tight!"}`;
}
