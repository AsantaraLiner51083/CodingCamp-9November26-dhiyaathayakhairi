# Design Document

## Overview

The Expense & Budget Visualizer is a single-page, client-side application built with plain HTML, CSS, and vanilla JavaScript. There is no build step, no framework, and no backend. The entire application is delivered as three static files (`index.html`, `css/style.css`, `js/script.js`) and relies on `localStorage` for state persistence across page reloads.

---

## Data Models

A single `transactions` array is maintained in memory and mirrored to `localStorage`.

**Transaction object:**
```js
{
  id: Number,       // Date.now() at creation — unique key & default sort order
  name: String,     // Item name entered by the user
  amount: Number,   // Positive integer (IDR, no decimals)
  category: String  // One of: "Food" | "Transport" | "Fun"
}
```

**Additional localStorage keys:**

| Key | Type | Purpose |
|---|---|---|
| `"transactions"` | JSON string | Serialised transactions array |
| `"budgetLimit"` | String (numeric) | Monthly budget ceiling |
| `"darkMode"` | `"true"` / `"false"` | Theme preference |

---

## Architecture

### High-Level File Structure

```
index.html          — markup, loads CSS, Chart.js CDN, and script.js
css/style.css       — all styles (layout, components, dark mode, responsive)
js/script.js        — all application logic (data, rendering, events, chart)
```

There is intentionally no module bundler, no package manager, and no server-side component. Chart.js is loaded from `https://cdn.jsdelivr.net/npm/chart.js`.

### Initialization Sequence

On page load, `script.js`:
1. Deserialises `transactions` from `localStorage` (defaults to `[]`)
2. Restores `budgetLimit` into the input field from `localStorage`
3. Restores `darkMode` class onto `<body>` from `localStorage`
4. Calls `renderTransactions()`, `updateTotal()`, `updateChart()`, `updateBudgetWarning()`

---

## Components and Interfaces

### HTML Layout (index.html)

The page renders five semantic regions top-to-bottom inside a centred `.container`:

1. **Header** — app title, subtitle, theme toggle button (`#theme-toggle`)
2. **Summary card** (`.summary-card`) — read-only total expenses display (`#total-expenses`)
3. **Budget Limit card** — number input (`#budget-limit`), status paragraph (`#budget-warning`)
4. **Add Transaction card** — form (`#expense-form`) with text input for name, number input for amount, `<select>` for category
5. **Transaction History card** — sort dropdown (`#sort-transactions`), scrollable `<ul>` (`#transaction-list`)
6. **Spending Distribution card** — Chart.js `<canvas>` (`#expense-chart`)

### CSS Architecture (style.css)

| Selector / Rule | Purpose |
|---|---|
| `* { box-sizing: border-box }` | Consistent box model |
| `.container` | Max-width 900px, centred, responsive padding |
| `.card` | White bg, 12px radius, subtle box-shadow — base card style |
| `.summary-card` | Blue bg (#2563eb), white text — total expenses display |
| `input, select` | Full-width, 12px padding, 8px radius, 1px border |
| `button` | Blue (#2563eb) primary; `.delete-button` red (#ef4444) |
| `#transaction-list` | `max-height: 300px`, `overflow-y: auto` — scrollable list |
| `body.dark-mode` | Dark backgrounds (#0f172a, #1e293b), light text, dark inputs |
| `.budget-exceeded` | Red (#dc2626), bold — over-budget state |
| `.budget-safe` | Green (#16a34a), bold — within-budget state |
| `@media (max-width: 600px)` | Reduced font sizes and padding for mobile |

### JavaScript — Core Functions (script.js)

| Function | Signature | Responsibility |
|---|---|---|
| `saveTransactions()` | `() → void` | Serialises `transactions` to `localStorage["transactions"]` |
| `formatRupiah(amount)` | `(Number) → String` | Formats as IDR using `Intl.NumberFormat("id-ID")` |
| `renderTransactions()` | `() → void` | Clears and rebuilds `#transaction-list` from current array |
| `deleteTransaction(id)` | `(Number) → void` | Filters `transactions`, saves, re-renders all UI |
| `updateTotal()` | `() → void` | Sums amounts, updates `#total-expenses`, calls `updateBudgetWarning()` |
| `updateChart()` | `() → void` | Aggregates by category, updates Chart.js dataset, calls `chart.update()` |
| `updateBudgetWarning()` | `() → void` | Compares total vs limit; sets class and text on `#budget-warning`; clears both when no limit is set |

### JavaScript — Event Handlers

| Element | Event | Action |
|---|---|---|
| `#expense-form` | `submit` | Validate inputs; create transaction; push, save, re-render all UI |
| Delete button (per `<li>`) | `click` | Call `deleteTransaction(id)` |
| `#sort-transactions` | `change` | Re-sort `transactions` in place; re-render list |
| `#theme-toggle` | `click` | Toggle `dark-mode` on `<body>`; update button label; persist to `localStorage` |
| `#budget-limit` | `input` | Save value to `localStorage`; call `updateBudgetWarning()` |

### Chart.js Integration

A single `Chart` instance is created at module level and mutated on each update:

```js
const expenseChart = new Chart(chartCanvas, {
  type: "pie",
  data: {
    labels: ["Food", "Transport", "Fun"],
    datasets: [{ data: [0, 0, 0], backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b"] }]
  },
  options: { responsive: true }
});

// Update: mutate data array then call .update()
expenseChart.data.datasets[0].data = [foodTotal, transportTotal, funTotal];
expenseChart.update();
```

---

## Error Handling

| Scenario | Handling Strategy |
|---|---|
| Invalid form submission (empty name, non-positive amount, no category) | Block submission; show `alert()` with guidance |
| `localStorage` unavailable or quota exceeded | No explicit handling — data loss is silent. Acceptable per NFR-1 (no-backend constraint). |
| Chart.js CDN unreachable | The chart canvas is non-functional; all other features continue to work because `script.js` does not depend on Chart.js for non-chart functions |
| Corrupted `localStorage` data | `JSON.parse()` may throw; no try/catch currently exists — this is a known minor gap |

---

## Known Gaps and Planned Fixes

The following gaps were identified during the implementation review:

### Gap 1 — Budget warning shown when no budget is set (Fix required)
**Current behaviour:** `updateBudgetWarning()` shows "You are within your budget." even when the budget input is empty or zero.  
**Fix:** Add an early-return in `updateBudgetWarning()` that clears text and removes both CSS classes when `limit <= 0`.

### Gap 2 — Dark mode does not cover header or summary card (Fix required)
**Current behaviour:** `body.dark-mode` overrides only target `.card`. The header and summary card remain bright blue in dark mode.  
**Fix:** Add `body.dark-mode .header` and `body.dark-mode .summary-card` rules with a darker background (e.g. `#1e3a5f`) and appropriate text colour.

### Gap 3 — `lang` attribute mismatch (Minor, fix recommended)
**Current behaviour:** `<html lang="id">` claims Indonesian; all UI text is English.  
**Fix:** Change to `<html lang="en">`.

### Gap 4 — No delete confirmation (Deferred — out of scope)
Acceptable per NFR-1 (simplicity first).

### Gap 5 — No maximum on amount input (Deferred — out of scope)
Acceptable for a local-only app.

### Gap 6 — Chart.js CDN with no offline fallback (Documented, no fix)
Acceptable per TC-1/TC-3.

---

## Testing Strategy

No automated test framework is required per NFR-1. Verification is done manually in a browser.

**Manual smoke test checklist:**
1. Open `index.html` in Chrome, Firefox, Edge, and Safari — page loads without console errors.
2. Add transactions across all three categories — list updates, total updates, chart segments update.
3. Delete a transaction — list, total, and chart all reflect the removal.
4. Reload the page — all transactions, budget limit, and theme preference are restored.
5. Set a budget limit below the total — warning turns red with "exceeded" message.
6. Clear the budget limit field — warning disappears (no "safe" false positive).
7. Toggle dark mode — header, summary card, cards, inputs, and list all switch to dark styles; preference persists on reload.
8. Sort by ascending/descending/default — list order changes correctly.
9. Resize to <600px viewport — layout adapts without overflow.

---

## Correctness Properties

Property 1: **Total consistency** — The `#total-expenses` element always displays a value equal to the sum of all `transaction.amount` values in the current in-memory `transactions` array, formatted as IDR.
**Validates: Requirements 2.1**

Property 2: **Chart consistency** — Each pie chart segment value equals the sum of `transaction.amount` for all transactions whose `category` matches that segment's label (Food, Transport, or Fun).
**Validates: Requirements 3.1**

Property 3: **Persistence round-trip** — After any add or delete operation, `JSON.parse(localStorage.getItem("transactions"))` returns an array structurally equal to the current in-memory `transactions` array.
**Validates: Requirements 5.1**

Property 4: **Budget warning accuracy** — When `budgetLimit > 0` and `total > budgetLimit`, `#budget-warning` carries class `budget-exceeded`; when `budgetLimit > 0` and `total <= budgetLimit`, it carries `budget-safe`; when `budgetLimit <= 0`, neither class is present and no warning text is shown.
**Validates: Requirements 4.2**

Property 5: **Sort correctness** — After selecting "Lowest Amount", every adjacent pair of rendered list items satisfies `a.amount <= b.amount`; after "Highest Amount", `a.amount >= b.amount`; after "Default Order", items appear in ascending `id` order.
**Validates: Requirements 1.4**
