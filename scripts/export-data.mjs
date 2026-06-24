import { locationsData } from "../data.js";

const enriched = locationsData.map((location) => {
  const address = `${location.address || ""} ${location.name || ""}`.toLowerCase();
  const isEdmonton = address.includes("edmonton");

  return {
    ...location,
    city: isEdmonton ? "Edmonton" : "Calgary",
    province: "AB",
    country: "CA",
  };
});

if (process.argv.includes("--stdout")) {
  process.stdout.write(JSON.stringify(enriched));
} else {
  process.stdout.write(`${JSON.stringify(enriched, null, 2)}\n`);
}
