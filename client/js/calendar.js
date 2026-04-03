const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '';
const API = API_BASE + "/api/tasks";
const EVENTS_API = API_BASE + "/api/events";
const EXPENSES_API = API_BASE + "/api/expenses";
let token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let currentDate = new Date();
let tasks = [];
let events = [];
let expenses = [];

// Fetch initial data
async function loadCalendarData() {
    try {
        const [resTasks, resEvents, resExpenses] = await Promise.all([
            fetch(API, { headers: { "Authorization": "Bearer " + token } }),
            fetch(EVENTS_API, { headers: { "Authorization": "Bearer " + token } }),
            fetch(EXPENSES_API, { headers: { "Authorization": "Bearer " + token } })
        ]);

        if (resTasks.ok && resEvents.ok && resExpenses.ok) {
            tasks = await resTasks.json();
            events = await resEvents.json();
            expenses = await resExpenses.json();
            renderCalendar();
            if (document.getElementById("taskModal") && document.getElementById("taskModal").classList.contains("open")) {
                const activeDate = document.getElementById("modalDueDate").value;
                if (activeDate && typeof updateModalExistingItems === 'function') {
                    updateModalExistingItems(activeDate);
                }
            }
        } else {
            console.error("Failed to fetch data");
            if (resTasks.status === 401 || resEvents.status === 401 || resExpenses.status === 401) {
                logout();
            }
        }
    } catch (e) {
        console.error("Backend offline", e);
        document.getElementById("calendarGrid").innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1 / -1; margin-top: 20px;">Failed to connect to backend server.</p>`;
    }
}

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    const monthYearDisplay = document.getElementById("monthYearDisplay");
    grid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    let monthlyExpenseTotal = 0;

    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonth && day === today.getDate();
        const cellDate = new Date(year, month, day);
        const yyyy = cellDate.getFullYear();
        const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
        const dd = String(cellDate.getDate()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd}`;

        const dayTasks = tasks.filter(t => {
            if (!t.dueDate) return false;
            const d = new Date(t.dueDate);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });

        const dayEvents = events.filter(e => {
            if (!e.date) return false;
            const d = new Date(e.date);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });

        const dayExpenses = expenses.filter(ex => {
            if (!ex.date) return false;
            const d = new Date(ex.date);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });

        let badgesHtml = ``;

        const thresholdStr = localStorage.getItem('expenseThreshold');
        const threshold = thresholdStr ? parseFloat(thresholdStr) : 500;

        dayExpenses.forEach(ex => {
            monthlyExpenseTotal += ex.amount;
            
            const isHigh = ex.amount >= threshold;
            const bg = isHigh ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)';
            const textCol = isHigh ? '#ef4444' : '#f59e0b';
            const borderCol = isHigh ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)';

            badgesHtml += `
            <div class="calendar-task-badge" style="background: ${bg}; color: ${textCol}; border: 1px solid ${borderCol};" title="${ex.title}">
                ₹${ex.amount.toFixed(2)} - ${ex.title}
            </div>
            `;
        });

        dayEvents.forEach(e => {
            badgesHtml += `
            <div class="calendar-task-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3);" title="${e.title}" onclick="deleteCalendarEvent(event, '${e._id}')">
                Event: ${e.title}
            </div>
            `;
        });

        dayTasks.forEach(t => {
            const completedClass = t.completed ? 'completed' : '';
            badgesHtml += `
            <div class="calendar-task-badge ${completedClass}" title="${t.title}" onclick="toggleCalendarTask(event, '${t._id}', ${!t.completed})">
                ${t.title}
            </div>
            `;
        });

        grid.innerHTML += `
        <div class="calendar-day ${isToday ? 'today' : ''}" onclick="openModal('${dateString}')">
            <div class="day-number">${day}</div>
            <div class="day-tasks">
                ${badgesHtml}
            </div>
        </div>
        `;
    }

    const totalEl = document.getElementById("monthlyTotalExpense");
    if (totalEl) {
        totalEl.textContent = `₹${monthlyExpenseTotal.toFixed(2)}`;
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

function openModal(dateString) {
    document.getElementById("modalDueDate").value = dateString;
    const dateObj = new Date(dateString + 'T00:00:00');
    const header = document.getElementById("modalDateDisplayHeader");
    if (header) header.textContent = dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    document.getElementById("modalTaskTitle").value = "";
    if (document.getElementById("modalExpenseAmount")) document.getElementById("modalExpenseAmount").value = "";
    updateModalExistingItems(dateString);

    document.getElementById("taskModal").classList.add("open");
    setTimeout(() => {
        document.getElementById("modalTaskTitle").focus();
    }, 100);
}

function updateModalExistingItems(dateString) {
    const list = document.getElementById("modalExistingItems");
    if (!list) return;

    const [year, month, day] = dateString.split('-').map(Number);

    const dayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d.getFullYear() === year && d.getMonth() === (month - 1) && d.getDate() === day;
    });

    const dayEvents = events.filter(e => {
        if (!e.date) return false;
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === (month - 1) && d.getDate() === day;
    });

    const dayExpenses = expenses.filter(ex => {
        if (!ex.date) return false;
        const d = new Date(ex.date);
        return d.getFullYear() === year && d.getMonth() === (month - 1) && d.getDate() === day;
    });

    let html = '';

    dayExpenses.forEach(ex => {
        html += `
        <div class="note-item" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.75rem; color: #ef4444; font-weight: 600; margin-bottom: 2px;">EXPENSE (₹${ex.amount.toFixed(2)})</span>
                <span>${ex.title}</span>
            </div>
            <button class="delete-note-btn" onclick="deleteCalendarExpense(event, '${ex._id}')" title="Delete Expense">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </div>
        `;
    });

    dayEvents.forEach(e => {
        html += `
        <div class="note-item" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.75rem; color: #10b981; font-weight: 600; margin-bottom: 2px;">EVENT</span>
                <span>${e.title}</span>
            </div>
            <button class="delete-note-btn" onclick="deleteCalendarEvent(event, '${e._id}')" title="Delete Event">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </div>
        `;
    });

    dayTasks.forEach(t => {
        const completedStyle = t.completed ? 'text-decoration: line-through; opacity: 0.7;' : '';
        html += `
        <div class="note-item" style="display: flex; justify-content: space-between; align-items: center; ${completedStyle}">
            <div style="display: flex; flex-direction: column; flex: 1; cursor: pointer;" onclick="toggleCalendarTask(event, '${t._id}', ${!t.completed})">
                <span style="font-size: 0.75rem; color: #818cf8; font-weight: 600; margin-bottom: 2px;">TASK</span>
                <span>${t.title}</span>
            </div>
        </div>
        `;
    });

    if (html === '') {
        html = '<p style="color: var(--text-secondary); font-size: 0.9rem; text-align: center; margin-top: 20px;">No items for this date.</p>';
    }

    list.innerHTML = html;
}

function closeModal() {
    document.getElementById("taskModal").classList.remove("open");
}

async function addCalendarTask() {
    const title = document.getElementById("modalTaskTitle").value;
    const dueDate = document.getElementById("modalDueDate").value;
    if (!title) return;
    try {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ title, dueDate })
        });
        document.getElementById("modalTaskTitle").value = "";
        loadCalendarData();
    } catch (e) {
        console.error("Failed to add task", e);
    }
}

async function addCalendarEvent() {
    const title = document.getElementById("modalTaskTitle").value;
    const date = document.getElementById("modalDueDate").value;
    if (!title) return;
    try {
        await fetch(EVENTS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ title, date })
        });
        document.getElementById("modalTaskTitle").value = "";
        loadCalendarData();
    } catch (e) {
        console.error("Failed to add event", e);
    }
}

async function addCalendarExpense() {
    const title = document.getElementById("modalTaskTitle").value;
    const amount = document.getElementById("modalExpenseAmount").value;
    const date = document.getElementById("modalDueDate").value;
    if (!title || !amount) {
        alert("Please provide both title and amount for an expense.");
        return;
    }
    try {
        await fetch(EXPENSES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ title, amount: parseFloat(amount), date })
        });
        document.getElementById("modalTaskTitle").value = "";
        if (document.getElementById("modalExpenseAmount")) document.getElementById("modalExpenseAmount").value = "";
        loadCalendarData();
    } catch (e) {
        console.error("Failed to add expense", e);
    }
}

async function deleteCalendarExpense(event, id) {
    event.stopPropagation();
    if (!confirm("Delete this expense?")) return;
    try {
        await fetch(EXPENSES_API + "/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        loadCalendarData();
    } catch (e) {
        console.error("Failed to delete expense", e);
    }
}

async function toggleCalendarTask(event, id, newState) {
    event.stopPropagation();
    try {
        await fetch(API + "/" + id, {
            method: "PUT",
            headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newState })
        });
        loadCalendarData();
    } catch (e) {
        console.error("Failed to toggle task", e);
    }
}

async function deleteCalendarEvent(event, id) {
    event.stopPropagation();
    if (!confirm("Delete this event?")) return;
    try {
        await fetch(EVENTS_API + "/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        loadCalendarData();
    } catch (e) {
        console.error("Failed to delete event", e);
    }
}

document.getElementById('taskModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

document.getElementById('modalTaskTitle').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addCalendarTask();
});

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function go(p) {
    window.location.href = p;
}

loadCalendarData();
