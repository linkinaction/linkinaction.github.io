import { locationsData } from "../../data.js";

export const fallbackOrganizations = locationsData.map((organization, index) => {
  const haystack = `${organization.name} ${organization.address}`.toLowerCase();
  return {
    id: `static-${index + 1}`,
    city: haystack.includes("edmonton") ? "Edmonton" : "Calgary",
    province: "AB",
    country: "CA",
    ...organization,
  };
});

export async function loadOrganizations() {
  const response = await fetch("/api/organizations");
  if (!response.ok) throw new Error(`Unable to load organizations: ${response.status}`);
  const records = await response.json();
  return {
    source: "api",
    records: records.map((record) => ({
      ...record,
      city: record.city || "Calgary",
      province: record.province || "AB",
      country: record.country || "CA",
    })),
  };
}
