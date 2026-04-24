# BeautyBook ✨

A beauty salon management demo built during a vibe coding workshop. 100% client-side — no backend, no login, no API keys. Everything lives in your browser's `localStorage`.

> **Workshop students:** this is your playground. Clone it, run it, then point Claude Code at it and tell it what to change.

## What's inside

- Dashboard with KPIs and charts
- Appointments (list, add, filter, export to Excel)
- Clients + client detail pages with visit history & treatment notes
- Services, staff, inventory, expenses, packages, promotions
- Financial report (with PDF export)
- Booking flow (customer-facing tab)
- 3 languages: English, Bahasa Melayu, 中文
- Dark mode
- Seed data resets with the "Reset" button in the top bar

## Tech stack

| What | Why it's here |
|---|---|
| **React 19 + Vite** | Fast dev server, modern React |
| **Tailwind CSS v4** + **shadcn/ui** | Styling and component primitives |
| **Zustand** (with `persist`) | State management — writes to `localStorage` |
| **recharts** | Charts on the dashboard and financial page |
| **lucide-react** | Icons |
| **xlsx** | Export tables to Excel |
| **html2pdf.js** | Export financial report to PDF |
| **react-router-dom** | Routing |
| **canvas-confetti** | Celebration on booking 🎉 |

## Setup (one time)

You need **Node.js 18+** and **npm** installed.

```bash
git clone <your-fork-or-this-repo-url>
cd demo3-beautybook
npm install
```

## Run it

```bash
npm run dev
```

Open http://localhost:5173 — that's it. Data persists in your browser, so if you break something weird, click **Reset** in the top bar (or clear `localStorage` in DevTools).

### Other commands

```bash
npm run build     # production build -> dist/
npm run preview   # serve the built version
npm run lint      # ESLint check
```

## Project layout

```
src/
├── App.jsx                 # Root — renders BeautyBookLayout
├── main.jsx                # Providers (Router, Tooltip, Toast, Language)
├── defaults.js             # Seed data — clients, services, appointments, etc.
├── index.css               # Global styles + Tailwind + theme tokens
├── pages/                  # One file per screen (Dashboard, Clients, …)
│   └── index.jsx           # BeautyBookLayout — sidebar + view switcher
├── components/
│   ├── ui/                 # shadcn primitives (button, dialog, card, …)
│   ├── TopBar.jsx          # Header with notifications & language switcher
│   ├── KpiCard.jsx         # Animated KPI card with count-up
│   ├── ChartCard.jsx       # Chart wrapper
│   └── ...
├── store/
│   ├── index.js            # Zustand store (persisted to localStorage)
│   └── slices/             # One slice per domain (appointments, clients, …)
├── i18n/
│   ├── index.jsx           # LanguageProvider + useT() hook
│   └── locales/            # en.json, bm.json, cn.json
└── lib/
    ├── excel.js            # XLSX export helper
    ├── pdf.js              # PDF export helper
    ├── utils.js            # cn() helper
    └── hooks/              # use-dark-mode, use-count-up, use-chart-theme
```

## Where to start modifying (prompts for Claude Code)

Open this folder in your editor, run Claude Code, and try prompts like:

### Small wins (5–10 min)

- *"Add a new service called 'Hair Treatment' to [src/defaults.js](src/defaults.js), 90 min, RM 250. Make sure it shows up everywhere."*
- *"Change the brand gradient from pink→purple to teal→blue. Update [src/index.css](src/index.css) and [src/pages/index.jsx](src/pages/index.jsx)."*
- *"Add a 4th language (e.g. Tamil) by adding [src/i18n/locales/ta.json](src/i18n/locales/) and wiring it in [src/i18n/index.jsx](src/i18n/index.jsx) and [src/components/LanguageSwitcher.jsx](src/components/LanguageSwitcher.jsx)."*

### Medium (30–60 min)

- *"Add a 'Gift Cards' page: new slice in [src/store/slices/](src/store/slices/), new page in [src/pages/](src/pages/), new nav item in [src/pages/index.jsx](src/pages/index.jsx)."*
- *"The KPI card in [src/components/KpiCard.jsx](src/components/KpiCard.jsx) currently counts up on mount. Make it also count up when the value prop changes."*
- *"Add a date-range filter to [src/pages/Financial.jsx](src/pages/Financial.jsx) and have the charts re-aggregate based on it."*

### Bigger ideas

- *"Replace the localStorage persistence with Supabase so data syncs across devices. The store lives in [src/store/index.js](src/store/index.js) — swap the `persist` middleware."*
- *"Add authentication (sign up / login) and scope the Zustand store per user."*
- *"Add SMS reminders for pending appointments (mock it with a fake API for now)."*

## Tips for prompting Claude Code

1. **Be specific about files.** "Update [src/pages/Appointments.jsx](src/pages/Appointments.jsx)" beats "update the appointments page."
2. **Reference the seed data.** If you want a new field on clients, say so — Claude will thread it through [src/defaults.js](src/defaults.js), the slice, and every page that renders it.
3. **Work in small commits.** After each change, reload the app, click around, then ask for the next thing.
4. **When things break,** click **Reset** in the top bar to wipe `localStorage` and restore seed data.

## Security note

This app has **zero secrets**. No `.env`, no API keys, no backend. Everything runs in the browser. If you add a backend (Supabase, Firebase, a REST API), put keys in a `.env` file — `.gitignore` already excludes it.

## License

Do whatever you want with this. Built for learning.
