# VenueFlow

Real-time crowd intelligence for sporting venues. Navigate smarter, wait less, enjoy more.

## What It Does

VenueFlow is a smart assistant for stadium attendees. It uses live venue data to help you:

- **See crowd levels** across all zones on a live density map
- **Find short queues** for food, restrooms, gates, and shops
- **Get smart routes** that avoid congested areas
- **Track the match** with live score, possession, and stats
- **Plan your exit** with parking lot fill levels and drive-out times
- **Ask the AI assistant** anything — powered by Google Gemini with full venue context
- **Get proactive alerts** before congestion peaks

## Google Services

- **Google Gemini AI** — powers the chat assistant with real-time venue context (crowds, queues, match, weather) for personalized recommendations
- **Google Maps Embed API** — venue location with one-click directions

The app works without API keys using built-in fallback logic.

## Tech Stack

Next.js 14 · TypeScript · TailwindCSS · Lucide React · Google Gemini 2.0 Flash · Google Maps Embed API · Jest

## Getting Started

```bash
git clone https://github.com/kulwinderkour/PromptWars.git
cd PromptWars
npm install
npm run dev
```

Open **http://localhost:3000**

### Google API Keys (optional)

```bash
cp .env.example .env.local
```

Add your keys to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
GOOGLE_GEMINI_API_KEY=your_key
```

### Tests

```bash
npm test
```

22 tests covering data integrity, utility functions, input sanitization, and AI fallback logic.

## Project Structure

```
src/
├── app/
│   ├── api/assistant/route.ts   # Gemini AI endpoint
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Entry point
│   └── globals.css              # Styles
├── components/
│   ├── Dashboard.tsx            # Orchestrator — live data → props
│   ├── AiAssistant.tsx          # Floating AI chat
│   ├── VenueMap.tsx             # Crowd density map
│   ├── VenueLocation.tsx        # Google Maps embed
│   ├── MatchScoreCard.tsx       # Live score + stats
│   ├── QueueStatus.tsx          # Queue wait times
│   ├── SmartNavigation.tsx      # Route recommendations
│   ├── EventTimeline.tsx        # Match timeline
│   ├── ParkingStatus.tsx        # Parking fill + exit times
│   ├── WeatherWidget.tsx        # Venue weather
│   ├── QuickActions.tsx         # One-tap actions
│   ├── Notifications.tsx        # Live alerts
│   └── StatsBar.tsx             # Key metrics
├── lib/
│   ├── data.ts                  # Types & seed data
│   └── useLiveData.ts           # Live simulation hook
└── __tests__/
    ├── data.test.ts
    └── assistant-api.test.ts
```

## How It Meets the Challenge

| Criterion | How |
|-----------|-----|
| **Smart Assistant** | Gemini AI chat with full venue context — gives personalized, actionable advice |
| **Decision Making** | Routes avoid crowds, queues ranked by wait, timing tied to match minute |
| **Google Services** | Gemini AI + Google Maps — meaningful, integrated usage |
| **Usability** | Glanceable data, one-tap actions, proactive alerts |
| **Code Quality** | TypeScript, prop-driven components, clean data/UI/API separation |
| **Security** | Server-side API keys, input sanitization, security headers |
| **Efficiency** | Lightweight live data hook, minimal bundle, no wasted re-renders |
| **Testing** | 22 unit tests across data, utilities, and API logic |
| **Accessibility** | Semantic HTML, ARIA labels, skip links, keyboard navigation |

## License

MIT
