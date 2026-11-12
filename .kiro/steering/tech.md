# Tech Stack

## Stack
- **HTML5** — semantic markup, `lang="id"` (Indonesian)
- **CSS3** — plain CSS, no preprocessor or framework
- **Vanilla JavaScript (ES6+)** — no build step, no bundler
- **Chart.js** — loaded via CDN (`https://cdn.jsdelivr.net/npm/chart.js`) for the pie chart

## No Build System
This is a static site with no package manager, bundler, or transpiler. Files are served directly by opening `index.html` in a browser or via any static file server.

## Data Persistence
`localStorage` only — keys used: `transactions`, `darkMode`, `budgetLimit`.

## Common Commands
| Task | Command |
|---|---|
| Open locally | Open `index.html` in a browser |
| Serve with VS Code | Use the **Live Server** extension |
| Serve with Node | `npx serve .` |

## Style Conventions
- CSS uses plain class names (BEM-lite: `.card`, `.summary-card`, `.delete-button`)
- JS uses `const` / `let`, `function` declarations for named functions, `addEventListener` with named functions or inline anonymous functions
- Currency formatted with `Intl.NumberFormat` using `id-ID` locale and `IDR` currency
- Section blocks in `script.js` are separated by numbered comment banners (e.g. `/* === 1. SELECT HTML ELEMENTS === */`)
