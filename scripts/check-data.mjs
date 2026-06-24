import { locationsData } from "../data.js";

const names = new Set(locationsData.map((location) => location.name));
const types = [...new Set(locationsData.map((location) => location.type))].sort();
const edmontonCount = locationsData.filter((location) =>
  `${location.address} ${location.name}`.toLowerCase().includes("edmonton"),
).length;

console.log(`records=${locationsData.length}`);
console.log(`uniqueNames=${names.size}`);
console.log(`edmonton=${edmontonCount}`);
console.log(`types=${types.join(",")}`);

if (locationsData.length !== 70) {
  throw new Error(`Expected 70 records, found ${locationsData.length}`);
}
