const API = "http://localhost:5000/api/tasks";
let token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// LOAD TASKS
async function loadTasks() {
    try {
        const res = await fetch(API, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.ok) {
            const tasks = await res.json();
            renderTasks(tasks);
        } else {
            console.error("Failed to fetch tasks");
            if (res.status === 401) {
                logout();
            }
        }
    } catch (e) {
        console.error("Backend offline", e);
        const list = document.getElementById("taskList");
        list.innerHTML = `<p style="color: #ef4444; text-align: center; margin-top: 40px;">Failed to connect to backend server.</p>`;
    }
}

function renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    if (tasks.length === 0) {
        list.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 40px;">No tasks. Add one above!</p>`;
        return;
    }

    tasks.forEach(t => {
        const dateStr = t.dueDate ? new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "No date";
        const isCompleted = t.completed;

        const textStyle = isCompleted ? `text-decoration: line-through; color: var(--text-secondary);` : `color: var(--text-primary);`;
        const itemOpacity = isCompleted ? "opacity: 0.6;" : "opacity: 1;";
        const checkColor = isCompleted ? "#22c55e" : "var(--text-secondary)";

        list.innerHTML += `
        <div class="task glass-panel" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; ${itemOpacity} box-shadow: none; margin: 0; transition: transform 0.2s, opacity 0.2s;">
            
            <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
                <div onclick="toggleTask('${t._id}', ${!isCompleted})" style="cursor: pointer; display: flex; align-items: center; color: ${checkColor}; transition: color 0.2s;">
                    ${isCompleted ?
                `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>` :
                `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`
            }
                </div>
                <div>
                    <div style="${textStyle} font-size: 1.05rem; font-weight: 500;">${t.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${dateStr}
                    </div>
                </div>
            </div>

            <button onclick="deleteTask('${t._id}')" class="btn-secondary" style="width: auto; padding: 8px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239,68,68,0.2) !important; color: #ef4444; cursor: pointer;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </div>`;
    });
}

// ADD TASK
async function addTask() {
    const title = document.getElementById("taskTitle").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!title) return;

    try {
        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ title, dueDate: dueDate || null })
        });

        document.getElementById("taskTitle").value = "";
        document.getElementById("dueDate").value = "";
        loadTasks();
    } catch (e) {
        console.error("Failed to add task", e);
    }
}

// DELETE
async function deleteTask(id) {
    try {
        await fetch(API + "/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        loadTasks();
    } catch (e) {
        console.error("Failed to delete task", e);
    }
}

// TOGGLE COMPLETE
async function toggleTask(id, newState) {
    try {
        await fetch(API + "/" + id, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed: newState })
        });
        loadTasks();
    } catch (e) {
        console.error("Failed to toggle task", e);
    }
}

// NAV
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function go(p) {
    window.location.href = p;
}

loadTasks();