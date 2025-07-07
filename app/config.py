import os


class Config:
    # SQLite baza
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///local.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    # JWT konfiguracija
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "super-secret-key"
    )  # promeni u produkciji!

    # Ostale konfiguracije (ako treba)
    # CORS, mail, debug itd.
