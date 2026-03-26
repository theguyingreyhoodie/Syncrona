const NOTES_API = "http://localhost:5000/api/notes";
let token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// LOAD NOTES
async function loadNotesMain() {
    try {
        const res = await fetch(NOTES_API, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.ok) {
            const notes = await res.json();
            renderNotesMain(notes);
        } else {
            console.error("Failed to fetch notes");
            if (res.status === 401) {
                logout();
            }
        }
    } catch (e) {
        console.error("Backend offline", e);
        const grid = document.getElementById("notesGrid");
        grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 20px; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 12px; text-align: center;">Failed to connect to backend server. Ensure node server is running.</div>`;
    }
}

function renderNotesMain(notes) {
    const grid = document.getElementById("notesGrid");
    grid.innerHTML = "";

    if (notes.length === 0) {
        grid.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1 / -1; text-align: center; margin-top: 40px;">No notes found. Create one above!</p>`;
        return;
    }

    notes.forEach(note => {
        const dateStr = note.createdAt ? new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "No date";

        grid.innerHTML += `
        <div class="note-card">
            <div class="content">${escapeHTML(note.content)}</div>
            <div class="footer">
                <span class="date">${dateStr}</span>
                <button onclick="deleteNoteMain('${note._id}')" class="btn-secondary" title="Delete Note" style="width: auto; padding: 6px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239,68,68,0.2) !important; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </div>`;
    });
}

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ADD NOTE
async function addNoteMain() {
    const content = document.getElementById("newNoteContentMain").value.trim();
    if (!content) return;

    try {
        await fetch(NOTES_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ content })
        });

        document.getElementById("newNoteContentMain").value = "";
        closeNoteModal();
        loadNotesMain();
    } catch (e) {
        console.error("Failed to add note", e);
    }
}

// DELETE NOTE
async function deleteNoteMain(id) {
    try {
        await fetch(NOTES_API + "/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        loadNotesMain();
    } catch (e) {
        console.error("Failed to delete note", e);
    }
}

// NAV
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function go(page) {
    window.location.href = page;
}

// MODAL LOGIC
function openNoteModal() {
    document.getElementById("noteModal").classList.add("open");
    setTimeout(() => {
        document.getElementById("newNoteContentMain").focus();
    }, 100);
}

function closeNoteModal() {
    document.getElementById("noteModal").classList.remove("open");
}

document.getElementById('noteModal').addEventListener('click', function (e) {
    if (e.target === this) closeNoteModal();
});

loadNotesMain();
