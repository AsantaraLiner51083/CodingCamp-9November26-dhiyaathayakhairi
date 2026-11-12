# Implementation Plan: Expense & Budget Visualizer — Gap Fixes

## Overview

Three targeted fixes for gaps identified in the existing implementation: a misleading budget warning when no limit is set, incomplete dark mode coverage, and an incorrect HTML `lang` attribute. All existing MVP features are already implemented and working correctly and do not require changes.

## Task Dependency Graph

```
Task 1 (budget warning fix) — independent
Task 2 (dark mode header/summary fix) — independent
Task 3 (lang attribute fix) — independent
```

All three tasks are independent and can be completed in any order.

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2", "3"] }
  ]
}
```

## Relevant Files

- `index.html` — page markup, lang attribute
- `css/style.css` — dark mode rules for header and summary card
- `js/script.js` — budget warning logic

## Tasks

- [x] 1. Fix budget warning false positive when no limit is set
  - Open `js/script.js` and locate the `updateBudgetWarning()` function
  - Add a guard at the top of the function: when `limit <= 0` (input is empty or zero), clear `budgetWarning.textContent`, remove both `budget-exceeded` and `budget-safe` classes from the element, and return early
  - Verify: with no value in the budget limit field, the warning paragraph shows no text and has no coloured styling
  - Verify: entering a valid limit and adding transactions still triggers the correct exceeded/safe states
  - _Requirements: 4.2_

- [x] 2. Extend dark mode to cover the header and summary card
  - Open `css/style.css` and locate the dark mode section (`body.dark-mode` rules)
  - Add a rule for `body.dark-mode .header` with a darker background (e.g. `#1e3a5f`) and white text to replace the bright blue
  - Add a rule for `body.dark-mode .summary-card` with the same or similar dark background and white text
  - Verify: toggling dark mode visually transitions the header and summary card to dark colours consistent with the rest of the dark-mode palette
  - Verify: toggling back to light mode restores the original blue (`#2563eb`) for both elements
  - _Requirements: 6.1_

- [x] 3. Fix the HTML `lang` attribute to match the UI language
  - Open `index.html`
  - Change `<html lang="id">` to `<html lang="en">`
  - Verify: the page still loads and functions correctly; browser language tools and screen readers now correctly identify the page language as English
  - _Requirements: 7.1_

## Notes

- No test framework setup is required (NFR-1). All verification is done by manual browser testing.
- Deferred gaps (no delete confirmation, no maximum amount, Chart.js CDN fallback) are documented in `design.md` but are intentionally excluded from this task list per the MVP scope.
- The existing features (add/delete transactions, total display, pie chart, sort, localStorage persistence) are fully implemented and do not require changes.
