# Vending Machine

Two shelves, sweet and salty, ranked by drag and drop with ties, and a bin
instead of delete so tossed items keep informing suggestions.

`index.html` is the whole thing, served by GitHub Pages. `data/candies.json`
and `data/snacks.json` are the default ranking (Michael's); a visitor's edits
live in the URL hash, so a link carries a ranking.

The hash is `;`-separated: the open shelf's name, then `shelf=state` per shelf.
`codec.mjs` defines a state: the ranked tiers, ties joined by `-` and tiers by
`.`, then `~`, then the bin, items by catalog index in base 36; anything
unlisted is in the pile. The catalog index is each item's position when sorted
by `added` then `id`, so adding an item later never renumbers an existing link.

To make a shared link the new default, `node rank.mjs '<the hash>'` rewrites
the data files from it. To add an item, append it to the right data file with
a new `added` timestamp.

Items are documents with `name`, `status` (`pool`, `ranked`, `bin`), `rank`
(float, ties share a value), `colors` (two wrapper colors), `shape` (a key of
the page's `art` table), `source` (`seed` or `claude`), `added`, and an optional
`note`. `PREFERENCES.md` is what the rankings say so far.

The page follows the Ptable craft rules: the DOM is the state (each figure's
dataset is the item; the `<ol>` numbers ranks and ties itself through `li.value`
and `::marker`; the shelf tabs are radios), the cascade does the theming through
`color-scheme` and system colors, sizes are in `em`, and nothing is rebuilt on
change. A drop is read off the target's geometry: the top quarter of a tier is
a new rank above it, the middle a tie, the bottom quarter a new rank below, and
the ladder's bottom padding a new last rank.
