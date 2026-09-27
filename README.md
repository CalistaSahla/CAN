# CAN: Can You Trust This?

CAN is an explainable web trust intelligence platform. It helps users understand observable website evidence and make their own decisions. CAN is not an antivirus and does not make absolute safety claims.

## Project Status

Phase 1 establishes the architecture and backend scaffold. The FastAPI service currently exposes only a health check. Website scanning, demo fixtures, persistence, scoring, and product routes are not implemented yet.

The target MVP is Landing Page, CAN Scan, Trust Report, Trust DNA, and CAN Explain. Trust Gap, CAN Network, CAN Data, CAN Report, CAN History, CAN Academy, and CAN Watch remain stretch goals.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the component boundaries, API proposal, data model, analysis pipeline, demo mode, and SSRF controls.

The existing Next.js application stays at the repository root. The planned product routes are `/`, `/scan`, and `/report/[id]`. Existing prototype routes are left untouched during Phase 1.

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

Open `http://localhost:3000`.

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

`DEMO_MODE=true` is the planned explicit fixture mode. It is documented but not wired into the service yet; demo results must be visibly labeled and must never be presented as live scans.

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

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
