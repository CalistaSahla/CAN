# CAN: Can You Trust This?

CAN is an explainable web trust intelligence platform. It helps users understand observable website evidence and make their own decisions. CAN is not an antivirus and does not make absolute safety claims.

## Project Status

Phase 1 established the architecture and FastAPI scaffold. Phase 2 delivered the landing page and design system. Phase 3 adds the `/scan` presentation flow. Its progress is simulated, sends no request to the submitted site, and ends at the clearly labeled legacy demo report. The FastAPI service currently exposes only a health check. Live evidence collection, persistence, and scoring are not implemented.

The target MVP is Landing Page, CAN Scan, Trust Report, Trust DNA, and CAN Explain. Trust Gap, CAN Network, CAN Data, CAN Report, CAN History, CAN Academy, and CAN Watch remain stretch goals.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the component boundaries, API proposal, data model, analysis pipeline, demo mode, and SSRF controls.

The existing Next.js application stays at the repository root. Current MVP routes are `/`, `/scan`, and the legacy report preview at `/periksa/hasil`. The target report route `/report/[id]` is reserved for the Trust Report phase. Existing `/periksa` routes remain available for prototype compatibility.

The CAN visual direction and token rationale are documented in [docs/design-system.md](docs/design-system.md).

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI and Python
- Database: MySQL
- Network visualization: Cytoscape.js, deferred until CAN Network
- Version control: GitHub

## Run Locally

### Frontend

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. Submit a website URL on the landing page or visit `/scan` directly. The scan is a demonstration only; it does not make network requests to the target website.

### Backend

From the repository root:

```powershell
py -m venv backend/.venv
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt
backend/.venv/Scripts/python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

The current backend setup check is `http://localhost:8000/health`. Interactive API documentation is available at `http://localhost:8000/docs` while the service is running.

### MySQL and Environment

MySQL is part of the planned scan/report implementation, but the Phase 1 health check does not require a database. Copy `backend/.env.example` to `backend/.env` when database integration is introduced, then replace its placeholder values locally. Do not commit `.env` files or secrets.

`DEMO_MODE=true` is the planned backend fixture mode and is not wired into the service yet. The current frontend-only scan flow uses `mode=demo`, simulates its progress, and visibly discloses that no live scan occurs. Its report scores are illustrative placeholders.

## Development Phases

1. Project setup and architecture
2. Landing page and design system
3. CAN Scan UI
4. FastAPI backend
5. Real and demo evidence collection
6. Trust Engine
7. Trust Report
8. Trust DNA
9. CAN Explain
10. Integration
11. Testing
12. Competition polish