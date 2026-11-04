// Make a shared link the default: node rank.mjs '#snacks;candies=3-7.c~1.2;snacks=...' rewrites data/<shelf>.json from each shelf=state segment.
import { readFileSync, writeFileSync } from "node:fs";
import { decode, catalog } from "./codec.mjs";

const now = new Date().toISOString();
const order = { ranked: 0, pool: 1, bin: 2 };

process.argv[2].replace(/^#/, "").split(";").filter(s => s.includes("=")).forEach(segment => {
	const [shelf, state] = segment.split("=");
	const path = new URL(`data/${shelf}.json`, import.meta.url);
	const file = JSON.parse(readFileSync(path, "utf8"));
	const items = catalog(file.items);
	const { tiers, bin } = decode(state);
	const place = new Map(items.map(item => [item, { status: "pool", rank: null }]));
	tiers.forEach((tier, t) => tier.forEach(i => place.set(items[i], { status: "ranked", rank: t + 1 })));
	bin.forEach(i => place.set(items[i], { status: "bin", rank: null }));
	const changed = items.filter(item => item.status !== place.get(item).status || item.rank !== place.get(item).rank);
	changed.forEach(item => Object.assign(item, place.get(item), { updated: now }));
	file.items = items.toSorted((a, b) => order[a.status] - order[b.status] || (a.rank ?? 0) - (b.rank ?? 0) || a.name.localeCompare(b.name));
	file.exported = now.slice(0, 10);
	writeFileSync(path, JSON.stringify(file, null, 1) + "\n");
	console.log(`${shelf}: ${changed.length} moved`);
});
