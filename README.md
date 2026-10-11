# CAN — Can You Trust This?

> An explainable web trust intelligence prototype that turns observable website signals into evidence-based context.

CAN helps people inspect a website without reducing the result to an unexplained “safe” or “unsafe” label. It presents available evidence across six dimensions, explains why each signal matters, and makes the limits of the analysis visible.

## Overview

Website trust is difficult to judge from a URL alone. Security indicators, ownership context, response behavior, privacy links, external resources, and form inputs are often scattered across technical details that are hard to interpret.

CAN addresses that gap with a web interface and API for URL scans. A scan produces a report containing Trust DNA dimensions, evidence records, confidence coverage, and structured findings using the CAN Explain format:

- **What** was observed
- **Why** it matters
- **Evidence** supporting the observation
- **Impact** for the user
- **Action** the user can consider

CAN is an interpretation layer, not an antivirus, browser security product, or guarantee that a website is safe or malicious. Results depend on the evidence available during a scan.

## Current status

This repository contains a working prototype with an explicit demo mode and a FastAPI scan backend. Demo reports are available through the frontend even when the backend is not running. The backend also includes live collection paths for the checks implemented in the analysis modules, controlled by `DEMO_MODE`.

## Features

- URL entry and normalization from the landing page or scan page
- Demo scan flow with visible progress stages
- Trust Report route at `/report/[id]`
- Six Trust DNA dimensions:
  - Security
  - Authenticity
  - Transparency
  - Behavior
  - Network
  - Data Exposure
- Evidence-first findings with What / Why / Evidence / Impact / Action explanations
- Confidence coverage and nullable dimension scores when evidence is unavailable
- Backend scan status and report endpoints
- URL safety controls for supported web schemes, restricted destinations, redirects, response size, and timeouts
- In-memory scan rate limiting
- Scan History UI backed by local browser state and sample records
- CAN Academy educational content
- English and Indonesian informational pages (`/about` and `/tentang`)

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page, product overview, Trust DNA summary, and demo scan entry point |
| `/scan` | URL entry and staged scan interface |
| `/report/[id]` | Trust report with confidence, dimensions, findings, and evidence |
| `/history` | Local scan history interface |
| `/academy` | Educational modules about web trust signals |
| `/about` | English project and principles page |
| `/tentang` | Indonesian project and principles page |

## Preview

Live demo: [can-rho-eight.vercel.app](https://can-rho-eight.vercel.app/)

![CAN homepage preview](public/can-preview.png)

The deployed frontend currently presents the demo flow with illustrative results, not a live website analysis.

## Tech stack

### Frontend

- Next.js `16.3.6` with the App Router
- React `19.2.8`
- Tailwind CSS `4` through PostCSS configuration
- Vanilla CSS design tokens and application styles in `src/design/tokens.css` and `src/app/globals.css`
- ESLint 9 with the Next.js configuration

### Backend

- FastAPI
- Pydantic Settings
- SQLAlchemy
- HTTPX
- PyMySQL
- SQLite support through the configured SQLAlchemy stack
- Pytest test suite

The exact backend package versions are defined in [`backend/requirements.txt`](backend/requirements.txt). Frontend versions are defined in [`package.json`](package.json) and [`package-lock.json`](package-lock.json).

## Repository structure

```text
.
├── src/
│   ├── app/                  # Next.js routes and global styles
│   ├── components/layout/    # Shared navigation and footer
│   ├── design/               # Design tokens
│   └── lib/                  # URL validation and backend API client
├── backend/
│   ├── app/
│   │   ├── analysis/         # HTML collection and signal engines
│   │   ├── api/              # FastAPI scan endpoints
│   │   ├── engine/           # Scoring rules and explanation engine
│   │   ├── security/         # URL safety and rate limiting
│   │   ├── services/         # Scan orchestration
│   │   └── ...
│   ├── tests/                # Backend tests
│   ├── .env.example          # Backend environment template
│   └── requirements.txt
├── docs/
│   ├── architecture.md
│   └── design-system.md
├── package.json
├── next.config.mjs
└── postcss.config.mjs
```

## Local development

### Prerequisites

- Node.js and npm compatible with the installed Next.js version
- Python 3.11 or a compatible Python version supported by the backend dependencies
- A database available for the configured `DATABASE_URL` when using the backend scan flow

### 1. Start the frontend

From the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend defaults to `http://localhost:8000` for backend API requests and can show the built-in demo report without a running API.

Useful frontend commands:

```bash
npm run lint
npm run build
npm run start
```

### 2. Configure and start the backend

Create a virtual environment and install the backend dependencies:

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt
```

Copy `backend/.env.example` to `backend/.env`, adjust the database connection if needed, then start FastAPI from the repository root:

```powershell
backend/.venv/Scripts/python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

Backend documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs). The health endpoint is [http://localhost:8000/health](http://localhost:8000/health).

### 3. Run backend tests

```powershell
$env:PYTHONPATH="backend"
backend/.venv/Scripts/pytest.exe backend/tests
```

The test suite covers URL safety, rate limiting, scan API behavior, collection, and trust-engine rules. This README does not claim a test result; run the command in your environment to verify the current state.

## Environment variables

### Frontend

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_CAN_API_URL` | `http://localhost:8000` | Base URL for the FastAPI service |

### Backend

| Variable | Default in settings | Description |
| --- | --- | --- |
| `APP_ENV` | `development` | Application environment label |
| `DEMO_MODE` | `true` | Selects demo fixtures when enabled; set to `false` for the live collection path |
| `DATABASE_URL` | `mysql+pymysql://can_app:change_me@localhost:3306/can` | SQLAlchemy database connection string |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Expected frontend origin |
| `SCAN_TIMEOUT_SECONDS` | `5.0` | Maximum configured scan timeout |
| `SCAN_MAX_RESPONSE_BYTES` | `1000000` | Maximum response body size considered by the collector |
| `SCAN_MAX_REDIRECTS` | `3` | Maximum redirect hops |
| `SCAN_RATE_LIMIT_REQUESTS` | `10` | Requests allowed per rate-limit window |
| `SCAN_RATE_LIMIT_WINDOW_SECONDS` | `60` | Rate-limit window length |

Only the first four variables are included in [`backend/.env.example`](backend/.env.example); the remaining settings use the defaults declared in `backend/app/config.py` unless explicitly provided.

## API endpoints

The backend exposes:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/api/scan` | Queue a URL scan |
| `GET` | `/api/scan/{scan_id}/status` | Read scan status and progress |
| `GET` | `/api/report/{scan_id}` | Retrieve a completed report |

## Limitations

- Demo mode intentionally uses version-controlled fixture data and should not be interpreted as a live assessment.
- Evidence coverage varies by website; unavailable evidence does not imply that a site is safe.
- The analysis is limited to the signals implemented by the current collectors and engines.
- The frontend includes local sample history; no authentication or user account flow is implemented.
- The backend uses FastAPI background tasks and an in-memory rate limiter, which are suitable for a simple prototype but not a durable distributed job system.
- A deployment URL, hosted database configuration, and production observability setup are not defined in this repository.

## Roadmap

The repository's architecture notes identify several areas for future work, including broader context and trust-gap analysis, persistent history improvements, network visualization, richer real-mode coverage, and production-grade background workers. These are not presented as completed features.

## Deployment

The frontend demo is deployed on Vercel at [can-rho-eight.vercel.app](https://can-rho-eight.vercel.app/). The live page identifies its scan flow as a demo using illustrative results.

No deployed backend URL or production database configuration is documented in this repository. The backend deployment target, environment variables, database provider, and frontend-to-backend routing still need to be documented before describing live scans as available.

## Contributing

**Maintainers:** Calista Sahla and Aninditya Nabilah Hendarto.

A formal contribution workflow has not been established yet. For changes, keep frontend and backend behavior aligned with the contracts in [`docs/architecture.md`](docs/architecture.md), preserve the evidence-first disclaimer, and add or update tests for backend behavior.

## License

No license has been selected, and no license file or explicit license declaration is present in the repository. The project should not be treated as open source or as granting reuse and redistribution rights until the maintainers choose and add a license.

## Project documentation

- [`docs/architecture.md`](docs/architecture.md) — product boundary, scan flow, API contract, data model, and security boundaries
- [`docs/design-system.md`](docs/design-system.md) — visual system and UI decisions
