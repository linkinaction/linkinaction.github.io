# Link in Action

React frontend, FastAPI backend, and Postgres data layer for the Link in Action community resource directory.

## Stack

- Frontend: Vite + React
- Backend: FastAPI on Vercel Python runtime
- Database: Postgres, intended for Neon through Vercel Marketplace
- Data seed: `data.js` is preserved and converted into Postgres rows by `scripts/seed_postgres.py`

## Prerequisites

- Node.js 20+
- npm
- Python 3.12+
- Postgres database URL, usually from Neon/Vercel

## Install

```powershell
npm install
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If PowerShell blocks `npm`, use `npm.cmd` instead:

```powershell
npm.cmd install
```

## Environment

Create `.env.local` for frontend values:

```powershell
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBTO9piU4s9LVGYvob043hACb2S2hg7CMU
VITE_CONTACT_FORM_URL=https://script.google.com/macros/s/AKfycbxOVDMT8Rw8qEbXyZEIaWSqVMU6DnFMyrxKltTzfYhhaR_yhzck7vK1PxMWx8JZGLiz/exec
```

Set backend/seed database value in your shell or Vercel project:

```powershell
$env:DATABASE_URL="postgres://user:password@host/db?sslmode=require"
```

Neon/Vercel may expose the connection under another name. The API and seed script read these in order:

```text
DATABASE_URL
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
NEON_DATABASE_URL
```

## Run Frontend

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

Frontend loads `/api/organizations` first. If API or DB is unavailable, it falls back to the preserved static records from `data.js`.

## Run Backend Locally

Install a local ASGI server if needed:

```powershell
pip install uvicorn
```

Run FastAPI:

```powershell
uvicorn api.index:app --reload --host 127.0.0.1 --port 8000
```

Check health:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/api/health
```

For local frontend-to-local-API testing, either proxy `/api` through Vercel dev or temporarily point fetches at `http://127.0.0.1:8000`.

## Seed Postgres

Create schema and import all current `data.js` rows:

```powershell
$env:DATABASE_URL="postgres://user:password@host/db?sslmode=require"
python scripts/seed_postgres.py
```

Expected seed count:

```text
Seeded 70 organizations.
```

Calgary records become `city=Calgary`; the existing Edmonton record becomes `city=Edmonton`.

## Checks

```powershell
npm run data:check
npm run build
python -m py_compile api/index.py scripts/seed_postgres.py
```

Expected data check:

```text
records=70
edmonton=1
```

## Vercel Deploy

1. Import the Git repo into Vercel.
2. Add Neon Postgres from Vercel Marketplace.
3. Confirm Vercel has one supported Postgres env var, usually `DATABASE_URL` or `POSTGRES_URL`.
4. Add frontend env vars:
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `VITE_CONTACT_FORM_URL`
5. Deploy.
6. Seed the Neon database once using `scripts/seed_postgres.py`.
7. Configure `linkinaction.ca` in Vercel Domains.

Vercel uses:

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite: configured in `vercel.json`
- Python entrypoint: `api/index.py`, FastAPI instance named `app`

## Useful URLs

- Frontend: `/`
- Directory: `/directory`
- API health: `/api/health`
- Organizations API: `/api/organizations`
- Single organization: `/api/organizations/{id}`
