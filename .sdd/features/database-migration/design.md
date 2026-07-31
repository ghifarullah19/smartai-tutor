# Design Document: Database Migration to Supabase

## 1. Current Architecture Impact
Currently, the FastAPI backend connects to a local SQLite database (`smartai.db`) using SQLAlchemy. While this works fine for local development, deploying to Vercel (which uses Serverless Functions) causes the database to reset frequently since the filesystem is ephemeral.
By migrating to a cloud-based PostgreSQL database (Supabase), the data will be persisted securely across all serverless function invocations.

## 2. Component Changes
- **`backend/core/database.py`**:
  - Update to fetch `DATABASE_URL` from the environment.
  - Implement a fix to replace the deprecated `postgres://` scheme with `postgresql://` (common when copying connection URIs from Heroku or Supabase older UIs).
  - Modify `create_engine` parameters. SQLite requires `connect_args={"check_same_thread": False}`, whereas PostgreSQL does not support this argument. We must dynamically remove it when connecting to PostgreSQL.
- **`backend/core/config.py`**:
  - Add `DATABASE_URL` to the `Settings` class if not already present.
- **`backend/requirements.txt`**:
  - Add `psycopg2-binary` to support PostgreSQL connections in SQLAlchemy.

## 3. File Structure Changes
No file structure changes are required. The existing data models (`models/`) will remain fully compatible with PostgreSQL due to SQLAlchemy's abstraction.

## 4. Data Flow
1. FastAPI app initializes.
2. `core/database.py` evaluates the environment variable `DATABASE_URL`.
3. If found, a connection pool is established with Supabase PostgreSQL.
4. `Base.metadata.create_all(bind=engine)` executes, ensuring all tables are initialized.
5. Incoming API requests interact with Supabase instead of a local `.db` file.

## 5. Technical Constraints
- The `psycopg2-binary` package is chosen because it requires no compilation and works well in most serverless deployment environments like Vercel.
- The `user_model.py` and `chat_model.py` use standard SQLAlchemy types (String, Integer, Text, DateTime, ForeignKey) which are 100% compatible with PostgreSQL without modification.
