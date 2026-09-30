from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    demo_mode: bool = True
    database_url: str = "mysql+pymysql://can_app:change_me@localhost:3306/can"
    frontend_origin: str = "http://localhost:3000"
    scan_timeout_seconds: float = Field(default=5.0, gt=0, le=30)
    scan_max_response_bytes: int = Field(default=1_000_000, gt=0, le=10_000_000)
    scan_max_redirects: int = Field(default=3, ge=0, le=5)
    scan_rate_limit_requests: int = Field(default=10, gt=0, le=1000)
    scan_rate_limit_window_seconds: int = Field(default=60, gt=0, le=3600)

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()