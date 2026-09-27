from fastapi import FastAPI

app = FastAPI(
    title="CAN API",
    description="API for the CAN web trust intelligence platform.",
    version="0.1.0",
)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}