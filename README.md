# BeautyBook

A fully client-side beauty salon management app that runs entirely in your browser, with no backend, login, or API keys required.

BeautyBook gives salon owners a single dashboard to manage appointments, clients, services, staff, inventory, expenses, and finances. It was built as a hands-on demo for a vibe coding workshop, so it is designed to be cloned, run, and freely modified.

## Features

- Dashboard with animated KPI cards and charts for an at-a-glance overview
- Appointments management: list, add, filter, and export to Excel
- Client directory with detail pages, visit history, and treatment notes
- Services, staff, inventory, expenses, packages, and promotions modules
- Financial report with PDF export
- Customer-facing booking flow with a confetti celebration on success
- Staff performance tracking
- Three languages out of the box: English, Bahasa Melayu, and Chinese
- Dark mode toggle
- Seed data with a one-click "Reset" button in the top bar
- All data persisted locally in the browser via `localStorage`

## Tech Stack

- Next.js 16 (App Router, Turbopack) with React 19
- JavaScript (ES Modules)
- Tailwind CSS v4 (via `@tailwindcss/postcss`) with shadcn/ui component primitives and Base UI
- Zustand (with the `persist` middleware) for state management, backed by `localStorage`
- Next.js file-based routing — every screen has its own address
- Recharts for dashboard and financial charts
- lucide-react for icons
- xlsx for Excel export and html2pdf.js for PDF export
- canvas-confetti for the booking celebration
- Custom typography via CSS variables ("DM Sans" for body, "Plus Jakarta Sans" for headings)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

Other available commands:

```bash
npm run build     # production build to .next/
npm start         # serve the production build
npm run lint      # run ESLint
```

## Project Structure

- `app/` — Next.js routes: `layout.jsx` (page shell + metadata) and one `page.jsx` per screen: `/` (dashboard), `/appointments`, `/clients`, `/clients/[id]` (client detail), `/services`, `/staff`, `/inventory`, `/expenses`, `/packages`, `/promotions`, `/financial`, `/performance`, `/booking`; unknown addresses go back to `/`
- `next.config.mjs` — Next.js config
- `postcss.config.mjs` — Tailwind CSS v4 PostCSS plugin
- `jsconfig.json` — the `@/` path alias (points to `src/`)
- `src/components/AppShell.jsx` — app providers (language, tooltips, toasts) + main layout; renders in the browser only, since all data lives in `localStorage`
- `src/defaults.js` — seed data for clients, services, appointments, and more
- `src/index.css` — global styles, Tailwind setup, and theme tokens
- `src/screens/` — one file per screen (Dashboard, Appointments, Clients, Booking, etc.), plus `index.jsx` with the top bar, admin sidebar and admin/booking switch
- `src/components/` — shared components, including `ui/` for shadcn primitives
- `src/store/` — Zustand store (`index.js`) with one slice per domain under `slices/`
- `src/i18n/` — language provider and `locales/` (en, bm, cn)
- `src/lib/` — helpers for Excel export, PDF export, utilities, and custom hooks

## Notes

- This app has no backend, no `.env`, and no API keys — everything runs in the browser. If you break something, click **Reset** in the top bar to wipe `localStorage` and restore the seed data.
- It was built as a demo for a vibe coding workshop. The internal package name is `demo3-beautybook`.
- If you extend it with a backend (such as Supabase or Firebase), store any keys in a `.env` file; `.gitignore` already excludes it.
