import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "CODELAB IDE"
    developer: str = "Sinan Mohammed"
    version: str = "2.0.0"
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./codeverse.db")
    
    # Security
    jwt_secret: str = os.getenv("JWT_SECRET", "codeverse-lab-super-secret-production-key-sinan-mohammed-2026")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # CORS
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,*")
    
    # Execution
    max_execution_time_sec: float = 5.0
    max_code_bytes: int = 65536  # 64 KB
    max_output_bytes: int = 65536  # 64 KB
    
    # AI - Google Gemini
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

