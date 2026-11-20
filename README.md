# Tally: a training app (Phase 3 of 3, final)

| Phase | What you get |
|---|---|
| 1. The app (done) | Today dashboard, programs, focus mode, records, history, progress, exercise library, settings |
| 2. Accounts and cloud (done) | Email login, cloud sync, your own routines, bodyweight tracking |
| **3. Insights and launch (this zip)** | **New landing page, animated doodles and video slots everywhere, units, Insights, CSV export, installable app, deployment** |

No new Supabase tables are needed in Phase 3. If Phase 2 works for you, you are set.

## What changed since Phase 2

- **New landing page.** A split hero with a looping doodle athlete in a cobalt block, floating stickers (a live rest ring, a "New record" tag, a dumbbell), a scrolling marquee, a mock focus-mode card with an animated rest ring, a horizontal strip of the five programs with their own animated sketches, and tally marks that draw themselves as you scroll. Motion is turned down automatically for people who prefer reduced motion.
- **Doodles everywhere.** Each exercise has an animated hand-drawn sketch that performs the movement (squat, hinge, push-up, press, row, curl, plank). They appear in focus mode, Programs, Today, Exercises, and the empty screens.
- **Videos.** Real video clips play in place of the sketch when you add them (see below). Every exercise also has a **Watch technique** link that opens a video search for it.
- **Units:** kilograms or pounds in Settings. Everything is stored in kilograms, so you can switch whenever you are not mid-workout, and nothing is lost. The plate calculator uses a 45 lb bar in pounds.
- **Insights** (/insights): weekly volume for 12 weeks, where your sets go by muscle group, and a record timeline.
- **CSV export** in Settings: one row per set, ready for a spreadsheet.
- **Installable app:** an app icon, a manifest and an offline cache, so Tally can be added to a phone's home screen and opens without a connection.

## Run it

    npm install
    npm test
    npm run dev

`npm test` runs four suites: training math, sync merge, units and CSV. All should pass. Your Phase 2 `.env` still works.

## Add your own videos

Put short looping clips in `public/videos/`. The file name decides where it plays:

- `hero.mp4`: the landing page hero.
- `back-squat.mp4`, `bench-press.mp4` and so on: that exercise's card in Exercises. `public/videos/README.txt` lists every name.

Use .mp4, ideally under 3 MB, with no sound needed (they play muted and loop). If a file is missing, the animated sketch shows instead, so you can add clips one at a time. Do not upload videos you do not own the rights to.

## Try these

1. Open the landing page: watch the hero load, then scroll through every section. Hover the mock card and the program cards.
2. Settings > Units > Pounds. Start a workout: the steppers move by 5, the label says lb, and the plate calculator shows a 45 lb bar. Finish it, switch back to kilograms: the same lifts show in kg.
3. Do the same workout on three different days (or use a few workouts) and open Insights.
4. Exercises: see the sketches. Add a clip named after an exercise to `public/videos/` and reload: it plays instead.
5. Settings > Export CSV, and open it in a spreadsheet.
6. After deploying (below), open the site on your phone and use "Add to Home Screen". Turn on airplane mode and open it: it still loads.

## Deploy (free)

1. Put the project on GitHub: `git init`, `git add .`, `git commit -m "Tally"`, then create an empty repository on github.com and run the two lines it shows you. The `.gitignore` keeps `.env` out of GitHub. Check that no `.env` appears on the repository page.
2. vercel.com > **Add New > Project** > import the repository. Leave the framework as Vite.
3. Add two **Environment Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Deploy.
4. Supabase > **Authentication > URL Configuration**: set the **Site URL** to your Vercel address.
5. Open your address and repeat the Phase 2 login check.

`vercel.json` makes direct links like /today work on refresh, and keeps the service worker fresh.

## Architecture (final)

    tally/
    ├── index.html, vite.config.js, vercel.json, package.json, .env.example, .gitignore
    ├── supabase/schema.sql         unchanged since Phase 2
    ├── public/                     favicon, app icons, manifest.webmanifest, sw.js (offline), videos/
    └── src/
        ├── main.jsx                routes, providers, service worker registration
        ├── index.css               design tokens, buttons, marquee
        ├── lib/
        │   ├── stats.js            training math: records, series, streaks, calendar, plates, weekly volume, muscle split
        │   ├── units.js            kg and lb conversion (stored in kg, converted at the screen edges)
        │   ├── csv.js              spreadsheet export
        │   ├── merge.js            cloud and local merge
        │   ├── programs.js, exercises.js    pure data
        │   ├── supabase.js, auth.jsx, cloud.js, store.jsx    login, sync and app state
        │   └── *.test.js           tests (npm test)
        ├── components/             Logo, Header, ThemeToggle, RestTimer, Doodle (sketches, video slots, stickers)
        └── pages/                  Landing, Today, Programs, Session, Log, History, Progress, Insights, Body, Exercises, Settings, Login, NotFound

### Decisions worth knowing

- **Doodles are drawn in code.** Each is two poses of a stick figure; the browser animates between them, and a hand-drawn wobble filter roughens the lines. Adding a movement means adding a pair of poses in `Doodle.jsx`.
- **Video is optional by design.** The page tries your file first and falls back to the sketch, so there is nothing to configure.
- **Units never change stored data.** Weights are saved in kilograms. Switching units only changes how they are shown and typed.
- **The offline cache touches only this site's own files.** Supabase calls, fonts and videos always go straight to the network.

## Before you share it widely

- **Supabase email limits:** the built-in sender allows only a few login codes per hour. Add your own provider (Authentication > SMTP) before real traffic.
- **Form cues and sketches are reminders, not coaching.** Add real clips where you can.
- **Progress photos, social features and wearables** are not built. They are good next steps.
