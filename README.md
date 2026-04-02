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

### Project structure

- **`app/`**: Next.js App Router routes, layouts, and global styles
  - **`app/page.tsx`**: Login page
  - **`app/backoffice/`**: Backoffice area (layout + pages)
  - **`app/components/`**: Shared UI components (TopNav, Sidebar, Modal)
- **`public/`**: Static assets

### Demo access (login)

| Field    | Value   |
| -------- | ------- |
| username | `admin` |
| password | `admin` |

**don't worry when you delete data it not have problem becuz i make soft delete**