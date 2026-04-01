## Bun Repair Service (Front-end)

Front-end web app for a repair-service backoffice (login + dashboard and management pages). Built with Next.js App Router and a REST API integration.

### Features

- **Authentication UI**: Login page at `/` that stores a token in `localStorage`
- **Backoffice pages**: `/backoffice/dashboard` plus pages for users, devices, company info, repair records/status, profile, and reports
- **Charts & reports**: ApexCharts + Day.js for reporting views
- **Modern styling**: Tailwind CSS + responsive layout (TopNav + Sidebar)

### Tech stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: React + Tailwind CSS
- **HTTP**: Axios
- **UX dialogs**: SweetAlert2
- **Charts**: ApexCharts

### Requirements

- **Node.js**: LTS recommended (or Bun if you prefer)
- **API server**: By default the UI calls `http://localhost:3001` (see `app/config.ts`)

### Getting started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Configuration

This project currently keeps its API base URL in code:

- **API base URL**: `app/config.ts` → `config.apiUrl` (default: `http://localhost:3001`)
- **Token storage key**: `app/config.ts` → `config.tokenKey`

If you deploy to another environment, update `config.apiUrl` to point to your API host.

### Available scripts

```bash
npm run dev     # start Next.js in dev mode
npm run build   # production build
npm run start   # start production server
npm run lint    # run ESLint
```

### Project structure (high level)

- **`app/`**: Next.js App Router routes, layouts, and global styles
  - **`app/page.tsx`**: Login page
  - **`app/backoffice/`**: Backoffice area (layout + pages)
  - **`app/components/`**: Shared UI components (TopNav, Sidebar, Modal)
- **`public/`**: Static assets

### Contributing / best practices

- **Code style**: TypeScript strict mode is enabled (`tsconfig.json`). Keep components typed and avoid `any` where possible.
- **Linting**: Run `npm run lint` before opening a PR.
- **Secrets**: Do not commit `.env*` files with real secrets (prefer `.env.example` if you add env vars later).

### Deployment

Standard Next.js deployment works (Vercel, Docker, Node server, etc.):

```bash
npm run build
npm run start
```

Make sure `config.apiUrl` points to the correct API base URL for that environment.
