# Tally — Log the Work

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)]()

> **The training log that keeps up with you.**  
> A fast, brutalist, distraction-free strength and fitness training app. Built with a local-first philosophy, procedural animated exercise doodles, built-in workout programs, smart rest timers, automated PR detection, and optional cloud sync.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Application Architecture](#application-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Supabase Setup (Optional)](#supabase-setup-optional)
  - [Running the App](#running-the-app)
  - [Running Tests](#running-tests)
- [Custom Exercise Videos](#custom-exercise-videos)
- [Project Structure](#project-structure)
- [Data Storage & Sync Strategy](#data-storage--sync-strategy)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

Most workout apps get in your way with bloated menus, intrusive subscriptions, tiny touch targets, and mandatory account gates. **Tally** is designed from the gym floor up:

- **Zero-Friction Start:** Works immediately out of the box in your browser with `localStorage`—no registration required.
- **Focus Mode:** Displays exactly what matters when lifting—large tactile steppers, wake lock to keep your screen awake, and a circular rest countdown timer with audio feedback.
- **Procedural Motion & Video Support:** Every exercise features a lightweight SVG stick-figure animation generated in code. Drop an `.mp4` into the public folder, and Tally seamlessly switches to high-definition video.
- **Data Ownership:** Seamlessly export all your set data to standard CSV at any time, or switch between kilograms and pounds with zero loss in fidelity.

---

## Key Features

### 🏋️ In-Workout Focus Mode
- **One Set at a Time:** Clean, high-contrast interface designed for quick logging between sets.
- **Tactile Steppers:** Rapidly adjust weight and reps with large, thumb-friendly tap targets—no fiddling with small mobile keyboards.
- **Rest Timer & Audio Cue:** Built-in animated circular countdown with quick `+15s` / `-15s` adjustments, upcoming set preview, and audio chimes on completion.
- **Screen Wake Lock:** Integrates the browser Wake Lock API to prevent your phone screen from timing out during workout sessions.
- **Plate Calculator:** Instant barbell plate breakdown for 20 kg and 45 lb Olympic bars.

### 📋 Ready-Made Programs & Custom Routines
Tally ships with 5 battle-tested training programs ready to log on day one:
1. **Full Body Starter** (Beginner, 3 days/week, alternating A/B workouts)
2. **Push, Pull, Legs (PPL)** (Intermediate, 3–6 days/week)
3. **Upper / Lower** (Intermediate, 4 days/week)
4. **Five by Five (5x5) Strength** (Beginner, 3 days/week)
5. **No Equipment / Bodyweight Circuit** (Any level, anywhere)

*Also supports building, customizing, and saving your own personalized workout templates.*

### 📈 Smart Insights & PR Tracking
- **Automatic Personal Records:** Detects new PRs on every completed workout using the Epley formula:
  $$\text{1RM} = \text{weight} \times \left(1 + \frac{\text{reps}}{30}\right)$$
  Tracks both **Heaviest Set** and **Estimated 1-Rep Max**.
- **12-Week Volume Analytics:** Interactive weekly training volume bar charts built with Recharts.
- **Muscle Split Distribution:** Real-time breakdown of completed sets across target muscle groups (Chest, Back, Legs, Shoulders, Arms, Glutes, Core).
- **PR Milestones & Streaks:** Timeline of all-time broken records alongside streak tracking toward your weekly workout goals.
- **Bodyweight Tracking:** Log daily bodyweight and view your progression over time.

### 💾 Local-First & Cloud Sync
- **Local-First Architecture:** Instant read/write operations backed by browser storage. The app is fully functional offline without an internet connection.
- **Passwordless Supabase Sync:** Optional one-time passcode (OTP) email login. When signed in, local and remote datasets merge seamlessly with bidirectional sync.
- **Row-Level Security (RLS):** Supabase database policies guarantee users can only read and write their own data.

### 📱 Progressive Web App (PWA)
- Fully installable on iOS, Android, and desktop devices via Web App Manifest.
- Includes a dedicated Service Worker caching core assets for full offline reliability.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| **Routing** | [React Router 6](https://reactrouter.com/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) with custom neo-brutalist design tokens |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) & procedural SVG vector animations |
| **Charts & Data Viz** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row-Level Security, Auth OTP) |
| **Offline & PWA** | Web App Manifest, Service Worker Cache API, Wake Lock API |
| **Testing** | Node.js native test runner (pure mathematical & synchronization logic) |

---

## Application Architecture

```
tally/
├── public/
│   ├── favicon.svg             # Application brand icon
│   ├── icon-192.png, 512.png   # PWA application icons
│   ├── manifest.webmanifest    # Web App Manifest for mobile installation
│   ├── sw.js                   # Service Worker (offline asset caching)
│   └── videos/                 # Directory for optional looping MP4 exercise clips
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Doodle.jsx          # Procedural stick-figure SVG animator & video handler
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── Logo.jsx            # App identity & typography
│   │   ├── RestTimer.jsx       # Floating rest countdown component
│   │   └── ThemeToggle.jsx     # Dark / light mode toggle
│   ├── lib/                    # Core business logic, state, and test suites
│   │   ├── auth.jsx            # Supabase OTP passwordless auth context
│   │   ├── cloud.js            # Supabase API abstraction layer
│   │   ├── csv.js              # CSV export formatter (one row per completed set)
│   │   ├── exercises.js        # Exercise library, muscle groups, equipment, and cues
│   │   ├── merge.js            # Conflict-free ID-based cloud/local state reconciler
│   │   ├── programs.js         # Built-in workout templates and metadata
│   │   ├── stats.js            # Training math: Epley 1RM, volume, PR detection, streaks
│   │   ├── store.jsx           # Local-first reactive state provider & sync manager
│   │   ├── supabase.js         # Supabase client initialization
│   │   ├── units.js            # Unit conversion (kg <-> lb) and plate math
│   │   └── *.test.js           # Unit test suites (stats, merge, units, CSV)
│   ├── pages/                  # Route view components
│   │   ├── Landing.jsx         # Marketing & hero showcase page
│   │   ├── Today.jsx           # Active dashboard & workout initiator
│   │   ├── Session.jsx         # Focused in-workout logging interface
│   │   ├── Programs.jsx        # Program catalog and routine builder
│   │   ├── History.jsx         # Logged workout diary & details
│   │   ├── Progress.jsx        # Exercise-specific progression charts
│   │   ├── Insights.jsx        # High-level volume, muscle split, and PR timeline
│   │   ├── Body.jsx            # Bodyweight tracker & historical log
│   │   ├── Exercises.jsx       # Exercise library with form cues & animated doodles
│   │   ├── Settings.jsx        # Units, sound, weekly goal, and CSV export
│   │   ├── Login.jsx           # Passwordless email authentication screen
│   │   └── NotFound.jsx        # 404 fallback page
│   ├── index.css               # Design system variables, tokens, and marquee animations
│   └── main.jsx                # App entrypoint, routing, and Service Worker registration
├── supabase/
│   └── schema.sql              # PostgreSQL DDL with Row-Level Security policies
├── .env.example                # Example environment variables template
├── vercel.json                 # SPA routing rewrites and service worker header rules
└── package.json                # Project dependencies and script declarations
```

---

## Getting Started

### Prerequisites

Ensure you have **Node.js 18.0.0+** and **npm** installed on your system.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/tally.git
cd tally
npm install
```

### Environment Variables

Tally works completely offline out of the box without any backend credentials. To enable optional cloud synchronization across devices, connect a Supabase project:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Populate `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   *(Retrieve these from your Supabase Dashboard under **Project Settings > API**).*

### Supabase Setup (Optional)

If using cloud sync, initialize your database schema in Supabase:

1. Navigate to your Supabase project's **SQL Editor**.
2. Open `supabase/schema.sql` from this repository, copy its contents, and run the query.
3. This creates four tables with Row-Level Security (RLS) enabled:
   - `workouts`: Logged workouts and completed set data.
   - `user_settings`: User preferences (units, weekly target, timer defaults).
   - `routines`: Custom-created workout templates.
   - `bodyweight`: Date-stamped bodyweight measurements.
4. In **Authentication > URL Configuration**, add your local/production URL to the **Redirect URLs**.

### Running the App

Start the local Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests

Tally uses lightweight, zero-dependency Node.js test suites to rigorously verify mathematical calculations, unit conversions, CSV formatting, and synchronization merge logic:

```bash
npm test
```

This runs:
- `src/lib/stats.test.js`: Epley formula calculations, volume math, PR detection, and streaks.
- `src/lib/merge.test.js`: Local-first ID reconciliation and conflict resolution.
- `src/lib/units.test.js`: Precise kg/lb transformations and barbell plate breakdowns.
- `src/lib/csv.test.js`: RFC-compliant CSV generation.

---

## Custom Exercise Videos

Tally features a hybrid media engine:
- By default, exercises display an animated, hand-drawn vector sketch drawn directly in SVG.
- If you supply your own short `.mp4` video clips in `public/videos/`, Tally will seamlessly render the video in place of the doodle.

### Supported Video Names

Drop your looping clips directly into `public/videos/`:

| Exercise Video File | Matching Exercise |
|---|---|
| `hero.mp4` | Landing page hero card |
| `back-squat.mp4` | Back Squat |
| `front-squat.mp4` | Front Squat |
| `deadlift.mp4` | Deadlift |
| `romanian-deadlift.mp4` | Romanian Deadlift |
| `bench-press.mp4` | Bench Press |
| `incline-bench-press.mp4` | Incline Bench Press |
| `overhead-press.mp4` | Overhead Press |
| `barbell-row.mp4` | Barbell Row |
| `pull-up.mp4` / `chin-up.mp4` | Pull-up / Chin-up |
| `lat-pulldown.mp4` | Lat Pulldown |
| `dumbbell-curl.mp4` | Dumbbell Curl |
| `triceps-pushdown.mp4` | Triceps Pushdown |
| `leg-press.mp4` | Leg Press |
| `lunge.mp4` | Lunge |
| `hip-thrust.mp4` | Hip Thrust |
| `dip.mp4` | Dip |
| `push-up.mp4` / `pike-push-up.mp4` | Push-up / Pike Push-up |
| `plank.mp4` | Plank |
| `glute-bridge.mp4` | Glute Bridge |
| `calf-raise.mp4` | Calf Raise |

> **Format Recommendation:** H.264 `.mp4`, under 3 MB, square or 16:9 aspect ratio. Audio is automatically muted and ignored.

---

## Data Storage & Sync Strategy

Tally enforces clear data architecture guidelines:

1. **Normalized Internal Units:** All weights are saved to disk and database in **kilograms (kg)**. When a user switches their display preference to pounds (**lb**), the values are converted at the UI boundary. This prevents rounding drift and ensures data integrity regardless of how many times units are toggled.
2. **Deterministic Merging:** When logging into an account with existing local browser data, Tally reconciles local and cloud records by unique ID (`mergeById`), preserving the superset of workouts and pushing non-replicated local items to the cloud.
3. **PWA Scope & Cache Boundary:** The service worker exclusively caches application shell assets (`HTML`, `JS`, `CSS`, static assets). Supabase API calls and dynamic video assets always bypass the service worker to keep data fresh and bandwidth low.

---

## Deployment

### Vercel (Recommended)

Tally includes a ready-to-use `vercel.json` configured for Single Page Application (SPA) URL rewrites and proper `sw.js` cache-control headers:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project in [Vercel](https://vercel.com/).
3. Set Framework Preset to **Vite**.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

### Other Static Hosts (Netlify, Cloudflare Pages)

Tally can be hosted on any static host. Ensure you build the production bundle:

```bash
npm run build
```

The output will be generated in `dist/`. Ensure your host is configured to rewrite all routes to `/index.html`.

---

## License

This project is licensed under the [MIT License](LICENSE) — see the codebase for details.
