const API = "http://localhost:5000/api/expenses";
let token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let expenses = [];

async function loadExpenses() {
    try {
        const res = await fetch(API, {
            headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
            expenses = await res.json();
            renderExpenses();
        } else {
            if (res.status === 401) logout();
        }
    } catch (e) {
        console.error("Failed to load expenses", e);
        document.getElementById("expensesList").innerHTML = `<p style="color: #ef4444; text-align: center;">Failed to connect to backend.</p>`;
    }
}

function renderExpenses() {
    const list = document.getElementById("expensesList");
    const totalAmountEl = document.getElementById("totalAmount");
    list.innerHTML = "";

    let total = 0;

    if (expenses.length === 0) {
        list.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No expenses recorded yet.</p>`;
        totalAmountEl.textContent = `$0.00`;
        return;
    }

    expenses.forEach(exp => {
        total += exp.amount;
        const dateObj = new Date(exp.date);
        const formattedDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

        list.innerHTML += `
            <div class="expense-card">
                <div class="expense-info">
                    <h4>${exp.title}</h4>
                    <p>${formattedDate}</p>
                </div>
                <div class="expense-actions">
                    <span class="expense-amount">$${exp.amount.toFixed(2)}</span>
                    <button class="delete-note-btn" onclick="deleteExpense('${exp._id}')" title="Delete">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
    });

    totalAmountEl.textContent = `$${total.toFixed(2)}`;
}

async function addExpense() {
    const title = document.getElementById("expenseTitle").value;
    const amount = document.getElementById("expenseAmount").value;
    let date = document.getElementById("expenseDate").value;

    if (!title || !amount) {
        alert("Please enter both title and amount.");
        return;
    }

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ title, amount: parseFloat(amount), date: date || new Date().toISOString() })
        });
        if (res.ok) {
            document.getElementById("expenseTitle").value = "";
            document.getElementById("expenseAmount").value = "";
            document.getElementById("expenseDate").value = "";
            loadExpenses();
        }
    } catch (e) {
        console.error("Failed to add expense", e);
    }
}

async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
        const res = await fetch(API + "/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
            loadExpenses();
        }
    } catch (e) {
        console.error("Failed to delete expense", e);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function go(p) {
    window.location.href = p;
}

// set default date to today for the input
document.getElementById('expenseDate').valueAsDate = new Date();

loadExpenses();
