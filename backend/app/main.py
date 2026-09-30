from fastapi import FastAPI
from app.api import scans

app = FastAPI(
    title="CAN API",
    description="API for the CAN web trust intelligence platform.",
    version="0.1.0",
)

app.include_router(scans.router)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}