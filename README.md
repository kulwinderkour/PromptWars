# VenueFlow — Smart Venue Experience Platform

A real-time crowd intelligence system designed to improve the physical event experience at large-scale sporting venues. Built as a **smart, dynamic assistant** that makes context-aware decisions to help attendees navigate, wait less, and enjoy more.

## Problem Statement

Attendees at large sporting events face:
- **Long queues** at food courts, restrooms, and entry gates
- **Crowd congestion** in corridors and concourses during peak moments (halftime, end of match)
- **Poor wayfinding** — difficulty navigating unfamiliar, massive venues
- **Lack of real-time information** about what's happening around them

## Solution

**VenueFlow** is a mobile-first web dashboard that gives attendees (and venue operators) real-time visibility into:

| Feature | Description |
|---------|-------------|
| **Live Density Map** | Visual heatmap of crowd levels across all venue zones |
| **Queue Wait Times** | Real-time estimated wait for food, restrooms, gates, and shops — with trend indicators |
| **Smart Routes** | AI-optimized navigation suggestions that avoid congested areas |
| **Live Match Score** | Real-time score, possession, shots, and corners with visual stat bars |
| **Event Timeline** | Current match status and upcoming moments (to anticipate crowd surges) |
| **Parking Status** | Lot fill levels and estimated exit drive-out times |
| **Weather Widget** | Live venue weather conditions, temperature, wind, and sunset time |
| **AI Assistant** | Google Gemini-powered chat that gives personalized venue recommendations |
| **Venue Location** | Google Maps integration with directions to the venue |
| **Quick Actions** | One-tap actions: nearest restroom, order food, report issues, seat upgrades |
| **Live Alerts** | Push notifications for congestion warnings, deals, and optimal timing |
| **Key Stats** | At-a-glance metrics: total attendees, average wait, active zones, alerts |

## Google Services Integration

| Service | Usage |
|---------|-------|
| **Google Gemini AI** | Powers the AI Assistant chat — takes real-time venue context (crowd data, queues, match status, weather) and generates personalized recommendations. Falls back to rule-based logic when API key is not configured. |
| **Google Maps Embed API** | Displays venue location with satellite view. Provides one-click directions via Google Maps. |

### Setup

```bash
# Copy the env template
cp .env.example .env.local

# Add your API keys
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
GOOGLE_GEMINI_API_KEY=your_key_here
```

The app works without API keys — Google Maps shows a static placeholder with a link, and the AI Assistant uses rule-based fallback logic.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Attendee Mobile App                    │
│         (Next.js 14 — this repository)                  │
├─────────────────────────────────────────────────────────┤
│              API Routes (Server-side)                    │
│   /api/assistant → Gemini AI with venue context          │
├─────────────────────────────────────────────────────────┤
│              Client-side Live Data Hook                  │
│   useLiveData() → simulates real-time sensor feeds       │
├─────────────────────────────────────────────────────────┤
│                  Google Services                         │
│  ┌─────────────┐ ┌──────────────────────────────────┐   │
│  │ Google Maps  │ │ Google Gemini AI (2.0 Flash)     │   │
│  │ Embed API    │ │ Context-aware venue assistant     │   │
│  └─────────────┘ └──────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│              Production Data Sources                     │
│  IoT sensors │ CCTV CV models │ Ticket scans │ WiFi AP  │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **AI**: Google Gemini 2.0 Flash (via REST API)
- **Maps**: Google Maps Embed API
- **Testing**: Jest + Testing Library
- **Security**: Server-side API key isolation, input sanitization, security headers

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Promptwar

# Install dependencies
npm install

# (Optional) Set up Google API keys
cp .env.example .env.local
# Edit .env.local with your keys

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/assistant/route.ts  # Gemini AI assistant endpoint
│   ├── layout.tsx              # Root layout with skip-link a11y
│   ├── page.tsx                # Entry point → Dashboard
│   └── globals.css             # Tailwind base styles
├── components/
│   ├── Dashboard.tsx           # Main orchestrator (live data → props)
│   ├── AiAssistant.tsx         # Floating AI chat (Google Gemini)
│   ├── VenueMap.tsx            # Interactive crowd density map
│   ├── VenueLocation.tsx       # Google Maps embed + directions
│   ├── MatchScoreCard.tsx      # Live match score + stats
│   ├── QueueStatus.tsx         # Real-time queue wait times
│   ├── SmartNavigation.tsx     # AI route recommendations
│   ├── EventTimeline.tsx       # Match event timeline
│   ├── ParkingStatus.tsx       # Parking lot fill + exit times
│   ├── WeatherWidget.tsx       # Live venue weather
│   ├── QuickActions.tsx        # One-tap action buttons
│   ├── Notifications.tsx       # Live alert feed
│   └── StatsBar.tsx            # Key metrics overview
├── lib/
│   ├── data.ts                 # Type definitions & seed data
│   └── useLiveData.ts          # Live data simulation hook
└── __tests__/
    ├── data.test.ts            # Data integrity & utility tests
    └── assistant-api.test.ts   # AI fallback logic & sanitization tests
```

## Challenge Criteria Coverage

| Criterion | Implementation |
|-----------|---------------|
| **Smart Dynamic Assistant** | AI Assistant uses Google Gemini with full venue context to give personalized, actionable advice |
| **Logical Decision Making** | Route optimization based on crowd density; queue recommendations based on wait trends; timing advice based on match minute |
| **Google Services** | Gemini AI for natural language assistance; Google Maps for venue navigation and directions |
| **Practical Usability** | Designed for real stadium use — glanceable data, one-tap actions, proactive alerts |
| **Code Quality** | TypeScript throughout, prop-driven components, clean separation of data/UI/API |
| **Security** | API keys server-side only, input sanitization (length + character filtering), security headers (XSS, frame, referrer) |
| **Efficiency** | Lightweight simulated data hook, no unnecessary re-renders, minimal bundle |
| **Testing** | 22 unit tests covering data integrity, utility functions, API sanitization, and fallback logic |
| **Accessibility** | Semantic HTML landmarks, skip-to-content link, ARIA labels, keyboard navigation, screen reader support |

## How It Would Work in Production

1. **IoT Sensors & WiFi Analytics** track crowd density per zone in real time
2. **Computer Vision** on existing CCTV estimates queue lengths
3. **Ticket scan data** provides occupancy per section
4. **A graph-based routing engine** computes optimal paths avoiding congestion
5. **Machine learning models** predict upcoming surges (e.g., halftime rush)
6. **Google Gemini** provides natural language interface for personalized recommendations
7. **Push notifications** proactively alert users before congestion peaks

## Key Design Decisions

- **Clean black & white UI** — high contrast, readable in any lighting
- **Glanceable information** — badges, color coding, and trends let users decide in seconds
- **Proactive suggestions** — the system recommends actions, not just shows data
- **Privacy-first** — crowd analytics use aggregate data, no individual tracking
- **Graceful degradation** — works without Google API keys using fallback logic

## License

MIT
