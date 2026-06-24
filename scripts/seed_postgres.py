import json
import os
import subprocess
from pathlib import Path

import psycopg

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "db" / "schema.sql"
DATABASE_ENV_NAMES = (
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "NEON_DATABASE_URL",
)


def load_seed_rows() -> list[dict]:
    result = subprocess.run(
        ["node", "scripts/export-data.mjs", "--stdout"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def main() -> None:
    database_url = next(
        (os.environ[name] for name in DATABASE_ENV_NAMES if os.environ.get(name)),
        None,
    )
    if not database_url:
        names = ", ".join(DATABASE_ENV_NAMES)
        raise RuntimeError(f"One Postgres connection env is required: {names}")

    rows = load_seed_rows()

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(SCHEMA_PATH.read_text(encoding="utf-8"))
            for row in rows:
                cursor.execute(
                    """
                    INSERT INTO organizations (
                        name, description, address, phone, website, email, type,
                        lat, lng, city, province, country
                    )
                    VALUES (
                        %(name)s, %(description)s, %(address)s, %(phone)s,
                        %(website)s, %(email)s, %(type)s, %(lat)s, %(lng)s,
                        %(city)s, %(province)s, %(country)s
                    )
                    ON CONFLICT (name, address) DO UPDATE SET
                        description = EXCLUDED.description,
                        phone = EXCLUDED.phone,
                        website = EXCLUDED.website,
                        email = EXCLUDED.email,
                        type = EXCLUDED.type,
                        lat = EXCLUDED.lat,
                        lng = EXCLUDED.lng,
                        city = EXCLUDED.city,
                        province = EXCLUDED.province,
                        country = EXCLUDED.country,
                        updated_at = now()
                    """,
                    row,
                )
        connection.commit()

    print(f"Seeded {len(rows)} organizations.")


if __name__ == "__main__":
    main()
