
/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const expenseForm = document.getElementById("expense-form");
const itemNameInput = document.getElementById("item-name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const transactionList = document.getElementById("transaction-list");
const totalExpenses = document.getElementById("total-expenses");
const chartCanvas = document.getElementById("expense-chart");

/* =========================================
   2. DATA STORAGE
========================================= */

// Load transactions from Local Storage
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// Save transactions to Local Storage
function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

/* =========================================
   3. FORMAT CURRENCY
========================================= */

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

/* =========================================
   4. ADD TRANSACTION
========================================= */

expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = itemNameInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;

    // Validate input
    if (!name || !Number.isFinite(amount) || amount <= 0 || !category) {
        alert("Please enter valid transaction details.");
        return;
    }

    // Create transaction
    const transaction = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category
    };

    // Add to array
    transactions.push(transaction);

    // Save and update display
    saveTransactions();
    renderTransactions();
    updateTotal();
    updateChart();

    // Reset form
    expenseForm.reset();
});

/* =========================================
   5. DISPLAY TRANSACTIONS
========================================= */

function renderTransactions() {
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No transactions yet.";
        transactionList.appendChild(emptyMessage);
        return;
    }

    transactions.forEach(function(transaction) {
        const li = document.createElement("li");

        const name = document.createElement("strong");
        name.textContent = transaction.name;

        const details = document.createElement("p");
        details.textContent =
            transaction.category + " - " +
            formatRupiah(transaction.amount);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        li.appendChild(name);
        li.appendChild(details);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);
    });
}

/* =========================================
   6. DELETE TRANSACTION
========================================= */

function deleteTransaction(id) {
    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    renderTransactions();
    updateTotal();
    updateChart();
}

/* =========================================
   7. CALCULATE TOTAL EXPENSES
========================================= */

function updateTotal() {
    const total = transactions.reduce(function(sum, transaction) {
        return sum + transaction.amount;
    }, 0);

    totalExpenses.textContent = formatRupiah(total);

    // Update budget warning
    updateBudgetWarning();
}
/* =========================================
   8. CREATE PIE CHART
========================================= */

const expenseChart = new Chart(chartCanvas, {
    type: "pie",

    data: {
        labels: ["Food", "Transport", "Fun"],

        datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
                "#3b82f6",
                "#22c55e",
                "#f59e0b"
            ]
        }]
    },

    options: {
        responsive: true
    }
});

/* =========================================
   9. UPDATE CHART
========================================= */

function updateChart() {
    const categories = {
        Food: 0,
        Transport: 0,
        Fun: 0
    };

    transactions.forEach(function(transaction) {
        if (categories[transaction.category] !== undefined) {
            categories[transaction.category] += transaction.amount;
        }
    });

    expenseChart.data.datasets[0].data = [
        categories.Food,
        categories.Transport,
        categories.Fun
    ];

    expenseChart.update();

}

/* ===== DARK / LIGHT MODE ===== */

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark
        ? "Switch Light Mode"
        : "Switch Dark Mode";

    localStorage.setItem("darkMode", isDark);
});

// Restore saved theme
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Switch Light Mode";
}


/* ===== SORT TRANSACTIONS ===== */

const sortTransactions = document.getElementById("sort-transactions");

sortTransactions.addEventListener("change", function() {
    const sortType = sortTransactions.value;

    if (sortType === "ascending") {
        transactions.sort(function(a, b) {
            return a.amount - b.amount;
        });
    } else if (sortType === "descending") {
        transactions.sort(function(a, b) {
            return b.amount - a.amount;
        });
    } else {
        transactions.sort(function(a, b) {
            return a.id - b.id;
        });
    }

    renderTransactions();
});


/* ===== BUDGET LIMIT ===== */

const budgetLimitInput = document.getElementById("budget-limit");
const budgetWarning = document.getElementById("budget-warning");

// Restore budget from Local Storage
budgetLimitInput.value = localStorage.getItem("budgetLimit") || "";

budgetLimitInput.addEventListener("input", function() {
    localStorage.setItem("budgetLimit", budgetLimitInput.value);
    updateBudgetWarning();
});

function updateBudgetWarning() {
    const limit = Number(budgetLimitInput.value);

    const total = transactions.reduce(function(sum, transaction) {
        return sum + transaction.amount;
    }, 0);

    if (limit > 0 && total > limit) {
        budgetWarning.textContent =
            "Warning! You have exceeded your budget.";

        budgetWarning.className = "budget-exceeded";
    } else {
        budgetWarning.textContent =
            "You are within your budget.";

        budgetWarning.className = "budget-safe";
    }
}

// =========================================
// INITIALIZE APP
// =========================================

// Run budget warning check
updateBudgetWarning();

// Display saved transactions
renderTransactions();

// Calculate total expenses
updateTotal();

// Update pie chart
updateChart();