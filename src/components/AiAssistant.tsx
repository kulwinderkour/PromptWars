"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import type { LiveData } from "@/lib/useLiveData";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface AiAssistantProps {
  data: LiveData;
}

const SUGGESTIONS = [
  "Where's the shortest restroom queue?",
  "What's the fastest food option?",
  "Which areas are least crowded?",
  "Should I leave for parking now?",
  "What's the current score?",
];

export default function AiAssistant({ data }: AiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm your VenueFlow assistant. Ask me about queues, crowds, routes, or anything about the venue.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function buildContext() {
    const crowdedZones = data.zones
      .filter((z) => z.occupancy > 70)
      .map((z) => `${z.name} (${z.occupancy}%)`);
    const quietZones = data.zones
      .filter((z) => z.occupancy < 45)
      .map((z) => z.name);
    const sorted = [...data.queues].sort((a, b) => a.waitMinutes - b.waitMinutes);

    return {
      crowdedZones,
      quietZones,
      shortestQueue: sorted[0] ? `${sorted[0].name} (${sorted[0].waitMinutes} min)` : "N/A",
      longestQueue: sorted[sorted.length - 1]
        ? `${sorted[sorted.length - 1].name} (${sorted[sorted.length - 1].waitMinutes} min)`
        : "N/A",
      avgWait: data.avgWait,
      matchMinute: data.matchScore.minute,
      matchScore: `${data.matchScore.homeTeam} ${data.matchScore.homeScore} - ${data.matchScore.awayScore} ${data.matchScore.awayTeam}`,
      weather: `${data.weather.temp}°C, ${data.weather.condition}, wind ${data.weather.wind} km/h`,
    };
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text.trim(),
          context: buildContext(),
        }),
      });

      const json = await res.json();
      const reply: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: json.reply || "Sorry, I couldn't process that. Try again.",
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: "Connection error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close assistant" : "Open AI assistant"}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-neutral-800 transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI Assistant"
          className="fixed bottom-20 right-6 z-50 flex w-80 flex-col rounded-lg border border-neutral-200 bg-white shadow-xl sm:w-96"
          style={{ maxHeight: "70vh" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3">
            <Bot className="h-4 w-4 text-black" />
            <span className="text-sm font-semibold">VenueFlow Assistant</span>
            <span className="badge badge-blue ml-auto text-[10px]">AI</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: "50vh" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mt-0.5 flex-shrink-0">
                    <Bot className="h-4 w-4 text-neutral-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-black"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="mt-0.5 flex-shrink-0">
                    <User className="h-4 w-4 text-neutral-400" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <Bot className="h-4 w-4 text-neutral-400 mt-0.5" />
                <div className="rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-500">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex-shrink-0 rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-neutral-200 px-3 py-2"
          >
            <label htmlFor="assistant-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="assistant-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about queues, crowds, food..."
              disabled={loading}
              className="flex-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-black placeholder:text-neutral-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="rounded-md bg-black p-1.5 text-white disabled:opacity-30 hover:bg-neutral-800 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
