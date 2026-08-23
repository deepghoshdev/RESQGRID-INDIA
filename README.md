# RESQGRID INDIA — Frontend

A role-based React/Vite frontend prototype for the RESQGRID INDIA disaster response coordination network.

## Access flow

The app now starts at `/login` and uses a role-aware frontend session:

- **Citizen** → `/citizen` → Citizen Emergency & Relief Portal
- **Agency** → `/agency` → Agency Battalion Command Portal
- **NDMA Admin** → `/admin` → NDMA Central Governance Console (existing screen)

The selected portal is persisted in `localStorage` under `resqgrid.session`, so a browser refresh keeps the active role. The session chip in the citizen/agency header provides sign-out and returns to `/login`.

> This is a frontend/demo authentication flow. It validates the presence of an identifier and password but does not connect to a real identity provider or transmit emergency requests.

## Run

```bash
npm install
npm run dev
```

## Demo shortcuts

The login screen has **Citizen demo** and **Agency demo** buttons that fill example credentials. The login action is intentionally deterministic: the selected access card controls the destination role.

## Project structure

```text
src/
├── app/              # application shell and route mapping
├── assets/           # brand assets
├── components/       # reusable UI and layout primitives
├── features/         # SOS, agencies, resources, map, communications
├── views/            # role-level screens
├── context/          # global auth/socket state
├── data/             # mock data
├── hooks/            # reusable browser/app hooks
├── services/         # API/auth/websocket boundaries
└── utils/            # pure helpers
```

## Citizen report page update

The citizen incident page now uses a minimal web header: RESQGRID INDIA branding, Citizen Portal label, signed-in citizen identity, and a working Logout action. The previous citizen navigation links (Dashboard, Report Incident, My Reports, Alerts, Resources, Contact) and notification control were removed from this page so the incident workflow stays focused.

The Supabase auth service merge conflict was also resolved so the source tree no longer contains Git conflict markers.

### Run locally

1. Copy `.env.example` to `.env` if environment variables are not already configured.
2. Run `npm install`.
3. Run `npm run dev`.
