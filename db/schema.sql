CREATE TABLE IF NOT EXISTS organizations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'community-support',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  city TEXT NOT NULL DEFAULT 'Calgary',
  province TEXT NOT NULL DEFAULT 'AB',
  country TEXT NOT NULL DEFAULT 'CA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, address)
);

CREATE INDEX IF NOT EXISTS organizations_city_idx ON organizations (city);
CREATE INDEX IF NOT EXISTS organizations_type_idx ON organizations (type);
CREATE INDEX IF NOT EXISTS organizations_region_idx ON organizations (country, province, city);
