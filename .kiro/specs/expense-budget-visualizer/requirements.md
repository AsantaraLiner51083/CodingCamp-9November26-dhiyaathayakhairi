# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side web application that lets users record daily expenses, visualise spending by category via a pie chart, set a monthly budget limit, and toggle between light and dark themes. All data persists in the browser's `localStorage`; no backend or build tooling is required.

## Requirements

### Requirement 1: Add Transaction

**User Story:** As a user, I want to add a new expense transaction via a form, so that I can track my daily spending.

#### Acceptance Criteria

1. WHEN a user submits the form with a non-empty item name, a positive finite amount, and a selected category, THE Application SHALL append a new transaction object `{id: Date.now(), name, amount, category}` to the transactions array.
2. WHEN a user submits the form, THE Application SHALL validate fields in order (name first, then amount, then category) and, upon encountering the first invalid field, block the submission and display an alert describing that field's error without checking subsequent fields.
3. WHEN a transaction is successfully added, THE Application SHALL reset the form to its empty state.
4. WHEN a transaction is successfully added, THE Application SHALL immediately update the transaction list, total expenses display, and pie chart.

### Requirement 2: Display Transactions

**User Story:** As a user, I want to see all my recorded transactions in a list, so that I can review my spending history.

#### Acceptance Criteria

1. WHEN at least one transaction exists, THE Application SHALL display each list item with the transaction's item name in bold and a line showing "category - formatted amount" (e.g. "Food - Rp25.000").
2. WHEN no transactions exist, THE Application SHALL show the message "No transactions yet." in the transaction list.
3. WHEN the number of transactions exceeds the visible area, THE Application SHALL scroll the list vertically without expanding the page layout (max-height: 300px, overflow-y: auto).

### Requirement 3: Delete Transaction

**User Story:** As a user, I want to delete a transaction from the list, so that I can remove incorrect or unwanted entries.

#### Acceptance Criteria

1. WHEN a user clicks the Delete button on a transaction, THE Application SHALL remove that transaction from the array.
2. WHEN a transaction is deleted, THE Application SHALL immediately update the transaction list, total expenses display, and pie chart.
3. WHEN a transaction is deleted, THE Application SHALL save the updated array to `localStorage`.

### Requirement 4: Sort Transactions

**User Story:** As a user, I want to reorder the transaction list by amount, so that I can easily find my largest or smallest expenses.

#### Acceptance Criteria

1. WHEN the sort dropdown is set to "Lowest Amount", THE Application SHALL display transactions sorted by amount ascending.
2. WHEN the sort dropdown is set to "Highest Amount", THE Application SHALL display transactions sorted by amount descending.
3. WHEN the sort dropdown is set to "Default Order", THE Application SHALL display transactions in the original insertion order (sorted by `id` ascending).

### Requirement 5: Running Total

**User Story:** As a user, I want to see the current total of all my expenses, so that I can monitor my overall spending at a glance.

#### Acceptance Criteria

1. WHEN the page loads, THE Application SHALL calculate the total expenses value from the persisted transactions array.
2. WHEN a transaction is added or deleted, THE Application SHALL update the total expenses display to reflect the new sum.
3. WHEN displaying any monetary amount, THE Application SHALL format it as Indonesian Rupiah using `Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0})`.

### Requirement 6: Pie Chart by Category

**User Story:** As a user, I want to see a pie chart of my spending broken down by category, so that I can understand where my money is going.

#### Acceptance Criteria

1. WHEN the page loads, THE Application SHALL render a pie chart with three segments: Food (blue #3b82f6), Transport (green #22c55e), and Fun (amber #f59e0b).
2. WHEN a transaction is added or deleted, THE Application SHALL recalculate the chart data from the current transactions array and re-render the chart.
3. WHEN no transactions exist for a category, THE Application SHALL set that category's segment value to 0.
4. IF Chart.js fails to load from the CDN, THEN THE Application SHALL allow the rest of the application to continue working without a JavaScript error blocking the page (graceful degradation).

### Requirement 7: Set Budget Limit

**User Story:** As a user, I want to enter a monthly spending limit, so that I can compare my expenses against a target budget.

#### Acceptance Criteria

1. WHEN a user enters a positive number in the budget limit input, THE Application SHALL save the value to `localStorage` under key `"budgetLimit"` on each input event.
2. WHEN the page loads, THE Application SHALL restore the previously saved budget limit from `localStorage` and display it in the input field.

### Requirement 8: Budget Warning

**User Story:** As a user, I want to see a status message indicating whether I am within or over my budget, so that I can take action before overspending.

#### Acceptance Criteria

1. WHEN total expenses exceed the budget limit AND the budget limit is a positive number, THE Application SHALL show "Warning! You have exceeded your budget." in the warning element with the CSS class `budget-exceeded` (red, bold).
2. WHEN total expenses are at or below the budget limit AND the budget limit is a positive number, THE Application SHALL show "You are within your budget." in the warning element with the CSS class `budget-safe` (green, bold).
3. WHEN no budget limit has been set (the input is empty or the value is 0), THE Application SHALL hide the warning element or show no text, so users are not given a misleading "safe" message.

### Requirement 9: localStorage Persistence

**User Story:** As a user, I want my data to be saved across page reloads, so that I do not lose my transactions or settings when I close and reopen the browser tab.

#### Acceptance Criteria

1. WHEN a transaction is added or deleted, THE Application SHALL serialise the full transactions array to `localStorage` under key `"transactions"`.
2. WHEN the page loads, THE Application SHALL deserialise transactions from `localStorage`; if no data exists the array SHALL default to `[]`.
3. WHEN the budget limit changes, THE Application SHALL persist the value to `localStorage` under key `"budgetLimit"`.
4. WHEN the dark mode preference changes, THE Application SHALL persist the preference to `localStorage` under key `"darkMode"`.

### Requirement 10: Theme Toggle

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the toggle button is clicked, THE Application SHALL toggle the `dark-mode` class on `<body>`.
2. WHILE dark mode is active, THE Application SHALL display the button label as "Switch Light Mode"; WHILE light mode is active, THE Application SHALL display the button label as "Switch Dark Mode".
3. WHEN the page loads, THE Application SHALL restore the previously saved theme preference from `localStorage`.
4. WHILE dark mode is active, THE Application SHALL apply dark-themed styles to card backgrounds, inputs, selects, and the transaction list consistent with the design system.

### Requirement 11: Technology Stack

**User Story:** As a developer, I want the application to use only HTML, CSS, and vanilla JavaScript, so that it can be deployed and run without any build tooling or backend.

#### Acceptance Criteria

1. THE Application SHALL use HTML, CSS, and vanilla JavaScript only, with no frameworks, transpilers, or backend.
2. THE Application SHALL store all persistent data in `localStorage`.
3. THE Application SHALL function correctly in modern browsers: Chrome, Firefox, Edge, and Safari.
4. THE Application SHALL follow the folder structure: one CSS file in `css/`, one JS file in `js/`, and the entry point at `index.html`.

### Requirement 12: Non-Functional Requirements

**User Story:** As a user, I want the application to be simple, fast, and visually clear, so that I can use it without friction on any screen size.

#### Acceptance Criteria

1. THE Application SHALL present a clean and minimal interface that requires no complex setup.
2. THE Application SHALL load the page quickly and respond to all interactions (add, delete, sort) without perceptible delay on a modern device.
3. THE Application SHALL maintain a clear visual hierarchy using the card-based layout, blue (#2563eb) brand colour, and legible typography at all viewport sizes.
4. THE Application SHALL adapt the layout to screens 600px wide and narrower using the existing responsive breakpoint.

## Glossary

- **Application**: The Expense & Budget Visualizer client-side web application.
- **Transaction**: A single expense record containing an `id`, `name`, `amount`, and `category`.
- **Transactions Array**: The in-memory JavaScript array holding all current Transaction objects, mirrored to `localStorage` under key `"transactions"`.
- **Category**: One of three predefined spending categories — Food, Transport, or Fun.
- **Budget Limit**: A user-defined monthly spending ceiling stored in `localStorage` under key `"budgetLimit"`.
- **Total Expenses**: The arithmetic sum of the `amount` field across all Transactions in the Transactions Array.
- **Pie Chart**: A Chart.js doughnut/pie visualisation showing the proportion of Total Expenses per Category.
- **Dark Mode**: A visual theme where the `dark-mode` CSS class is present on `<body>`, toggled by the user and persisted under key `"darkMode"` in `localStorage`.
- **localStorage**: The browser's Web Storage API used to persist all application data between page reloads without a backend.
- **Intl.NumberFormat**: The browser-native internationalisation API used to format monetary amounts as Indonesian Rupiah (IDR).
