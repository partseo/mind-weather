"""
FastAPI 앱 설정 — 모든 환경변수는 .env에서 로드
도메인 변경: APP_DOMAIN 값만 수정
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # === 앱 기본 ===
    APP_NAME: str = "Korea Auto Export"
    APP_DOMAIN: str = "https://yourdomain.com"
    APP_LOGO_URL: str = "/logo.png"
    APP_ENV: str = "development"

    # === 연락처 ===
    APP_WHATSAPP: str = "+82-10-XXXX-XXXX"
    APP_TELEGRAM: str = "@yourhandle"
    APP_EMAIL: str = "contact@yourdomain.com"

    # === 데이터베이스 ===
    DATABASE_URL: str = "postgresql+asyncpg://autoexport:password@localhost:5432/autoexport_db"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10

    # === Redis ===
    REDIS_URL: str = "redis://localhost:6379/0"

    # === JWT ===
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # === AWS S3 ===
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_S3_BUCKET: str = "autoexport-vehicle-images"
    AWS_S3_REGION: str = "ap-northeast-2"

    # === CORS ===
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # === Rate Limiting ===
    RATE_LIMIT_PER_MINUTE: int = 100

    # === 어드민 초기 계정 ===
    ADMIN_EMAIL: str = "admin@yourdomain.com"
    ADMIN_PASSWORD: str = "ChangeThisPassword123!"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @property
    def cors_origins_with_domain(self) -> List[str]:
        """APP_DOMAIN을 CORS에 자동 추가"""
        origins = list(self.CORS_ORIGINS)
        if self.APP_DOMAIN not in origins:
            origins.append(self.APP_DOMAIN)
        return origins


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
