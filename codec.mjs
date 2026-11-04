// A shelf's state as text: ranked tiers (ties joined by -, tiers by .), then ~, then the bin, items by catalog index in base 36.
// Unlisted items are in the pile. The catalog index is an item's position sorted by arrival, so a later addition never renumbers an existing link.
const b36 = (n) => n.toString(36);
const list = (s, sep) => s ? s.split(sep).map(n => parseInt(n, 36)) : [];

export const encode = ({ tiers, bin }) => [tiers.map(t => t.map(b36).join("-")).join("."), bin.map(b36).join(".")].join("~");

export function decode(s) {
	const [tiers, bin] = s.split("~");
	return { tiers: tiers ? tiers.split(".").map(t => list(t, "-")) : [], bin: list(bin, ".") };
}

export const catalog = (items) => items.toSorted((a, b) => a.added.localeCompare(b.added) || a.id.localeCompare(b.id));
