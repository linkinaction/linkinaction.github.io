import os
from typing import Any

import psycopg
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row

app = FastAPI(title="Link in Action API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://linkinaction.ca",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATABASE_ENV_NAMES = (
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "NEON_DATABASE_URL",
)


def get_database_url() -> str:
    for name in DATABASE_ENV_NAMES:
        database_url = os.getenv(name)
        if database_url:
            return database_url
    raise HTTPException(status_code=503, detail="Postgres connection env is not configured")


def fetch_all(query: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
    with psycopg.connect(get_database_url(), row_factory=dict_row) as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params or [])
            return list(cursor.fetchall())


def fetch_one(query: str, params: list[Any] | None = None) -> dict[str, Any] | None:
    rows = fetch_all(query, params)
    return rows[0] if rows else None


@app.get("/")
@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/organizations")
def organizations(
    city: str | None = Query(default=None),
    province: str | None = Query(default=None),
    country: str | None = Query(default=None),
    type: str | None = Query(default=None),
    q: str | None = Query(default=None),
) -> list[dict[str, Any]]:
    filters: list[str] = []
    params: list[Any] = []

    for column, value in (
        ("city", city),
        ("province", province),
        ("country", country),
        ("type", type),
    ):
        if value:
            filters.append(f"lower({column}) = lower(%s)")
            params.append(value)

    if q:
        filters.append(
            "(name ILIKE %s OR description ILIKE %s OR address ILIKE %s OR type ILIKE %s)"
        )
        pattern = f"%{q}%"
        params.extend([pattern, pattern, pattern, pattern])

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""
    return fetch_all(
        f"""
        SELECT id, name, description, address, phone, website, email, type,
               lat, lng, city, province, country
        FROM organizations
        {where_clause}
        ORDER BY city ASC, name ASC, id ASC
        """,
        params,
    )


@app.get("/api/organizations/{organization_id}")
def organization(organization_id: int) -> dict[str, Any]:
    row = fetch_one(
        """
        SELECT id, name, description, address, phone, website, email, type,
               lat, lng, city, province, country
        FROM organizations
        WHERE id = %s
        """,
        [organization_id],
    )
    if not row:
        raise HTTPException(status_code=404, detail="Organization not found")
    return row
