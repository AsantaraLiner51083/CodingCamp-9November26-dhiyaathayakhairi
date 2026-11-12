# Project Structure

```
/
├── index.html        # Single-page app entry point; all markup lives here
├── css/
│   └── style.css     # All styles: layout, components, dark mode, responsive
├── js/
│   └── script.js     # All application logic (single file, sectioned by comments)
└── README.md         # Course assignment description (Indonesian)
```

## Conventions
- **Single HTML file** — no routing, no partials, no templating engine
- **Single CSS file** — global styles, component styles, media queries, and theme variants all in `style.css`
- **Single JS file** — `script.js` is organized into numbered sections with comment banners:
  1. Select HTML Elements
  2. Data Storage
  3. Format Currency
  4. Add Transaction
  5. Display Transactions
  6. Delete Transaction
  7. Calculate Total Expenses
  8. Create Pie Chart
  9. Update Chart
  - Additional features (dark mode, sort, budget) appended after section 9

## Key DOM IDs
| ID | Purpose |
|---|---|
| `expense-form` | Add transaction form |
| `item-name` | Transaction name input |
| `amount` | Amount input |
| `category` | Category select |
| `transaction-list` | `<ul>` rendered list |
| `total-expenses` | Running total display |
| `expense-chart` | Chart.js canvas |
| `theme-toggle` | Dark/light mode button |
| `sort-transactions` | Sort order select |
| `budget-limit` | Budget limit input |
| `budget-warning` | Budget status message |
