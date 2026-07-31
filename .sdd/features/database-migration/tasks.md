# Implementation Tasks

- [x] 1. Update `backend/requirements.txt`
  - Add `psycopg2-binary>=2.9.9` to support PostgreSQL connections.
  - Requirement: 1.1

- [x] 2. Update `backend/core/config.py`
  - Add `DATABASE_URL: str | None = None` to the `Settings` class to ensure it can be parsed from the environment variables.
  - Requirement: 2.5

- [x] 3. Update `backend/core/database.py`
  - Modify database URL construction to read from `settings.DATABASE_URL`.
  - Add logic: `if SQLALCHEMY_DATABASE_URL.startswith("postgres://"): SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)`
  - Conditionally pass `connect_args={"check_same_thread": False}` only if the database URL starts with `sqlite`.
  - Requirements: 2.1, 2.2, 2.3, 2.4, 3.1
