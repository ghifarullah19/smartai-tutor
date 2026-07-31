# Requirements Document

## Introduction

This document details the requirements for migrating the backend database of PintarAI from a local SQLite implementation to a cloud-based PostgreSQL database provided by Supabase. The goal of this migration is to ensure that data is persistent when deployed on a serverless environment like Vercel, as local SQLite databases are reset every time the serverless function cold-starts.

## Glossary

- **Supabase:** An open source Firebase alternative providing a PostgreSQL database.
- **psycopg2-binary:** A PostgreSQL database adapter for the Python programming language.
- **SQLAlchemy:** The Python SQL toolkit and Object Relational Mapper that gives application developers the full power and flexibility of SQL.
- **DATABASE_URL:** An environment variable holding the connection string for the database.

## Requirements

### Requirement 1: PostgreSQL Support

User Story:
"As a developer, I want the backend to support PostgreSQL via the psycopg2 driver so that I can use Supabase as the production database."

Acceptance Criteria:
1. THE `requirements.txt` SHALL include `psycopg2-binary` to allow SQLAlchemy to connect to a PostgreSQL database.
2. WHEN deployed or run locally, THE application SHALL be able to import and utilize the postgres driver without errors.

### Requirement 2: Dynamic Database Connection Configuration

User Story:
"As a developer, I want the application to dynamically connect to either PostgreSQL or SQLite based on environment variables so that local development remains flexible while production is secure and persistent."

Acceptance Criteria:
1. THE `core/database.py` component SHALL read the `DATABASE_URL` environment variable.
2. IF `DATABASE_URL` is provided, THE SQLAlchemy engine SHALL connect to the specified URL.
3. IF `DATABASE_URL` starts with `postgres://`, THE component SHALL replace it with `postgresql://` to maintain compatibility with newer versions of SQLAlchemy.
4. IF `DATABASE_URL` is NOT provided, THEN THE component SHALL fallback to the local `sqlite:///./smartai.db`.
5. THE `core/config.py` component SHALL be updated if necessary to expose `DATABASE_URL`.

### Requirement 3: Ensure Schema Creation

User Story:
"As a developer, I want the database tables to be automatically created if they don't exist so that I don't have to manually run migrations for simple schema setups."

Acceptance Criteria:
1. WHEN the application starts, THE `Base.metadata.create_all(bind=engine)` SHALL execute and successfully create all tables in the Supabase PostgreSQL database if they do not already exist.
