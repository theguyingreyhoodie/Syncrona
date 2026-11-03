/* Notes: a list on the left, the open note (or a new one) on the right. */
(function () {
    "use strict";
    const { api, esc, timeAgo, fmtDate, icon, toast, toastError, busy, undoable } = window.S;

    const $ = (id) => document.getElementById(id);
    const MOD = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
    const app = $("notesApp");
    const pane = $("notePane");
    const state = { notes: [], loaded: false, error: null, selected: "new", draft: "" };
    const phone = () => matchMedia("(max-width: 900px)").matches;

    /* ---------- Helpers ---------- */
    function parts(content) {
        const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
        return { title: lines[0] || "Empty note", rest: lines.slice(1).join(" ") };
    }
    function highlight(text, q) {
        if (!q) return esc(text);
        // Split the raw text, then escape each piece, so a match never lands inside an entity.
        const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
        return text.split(re).map((part, i) => (i % 2 ? "<mark>" + esc(part) + "</mark>" : esc(part))).join("");
    }
    const current = () => state.notes.find((n) => n._id === state.selected) || null;
    const textarea = () => pane.querySelector("textarea");
    const isDirty = () => {
        const ta = textarea();
        if (!ta) return false;
        const n = current();
        return n ? ta.value.trim() !== n.content.trim() : !!ta.value.trim();
    };

    /* ---------- List ---------- */
    function renderList() {
        const list = $("noteList");
        if (!state.loaded) return;
        const n = state.notes.length;
        $("noteCount").textContent = n ? n + " note" + (n > 1 ? "s" : "") + ", newest first" : "Nothing written yet.";
        if (state.error) {
            list.innerHTML = '<li class="callout">' + icon("alert") + "<div><strong>Notes couldn't load.</strong>" + esc(state.error) + "</div></li>";
            return;
        }
        const q = $("search").value.trim();
        const shown = q ? state.notes.filter((x) => x.content.toLowerCase().includes(q.toLowerCase())) : state.notes;
        if (!shown.length) {
            list.innerHTML = '<li class="empty">' + (q
                ? "<strong>No notes mention “" + esc(q) + "”.</strong>Try a shorter word, or clear the search."
                : "<strong>No notes yet.</strong>Write your first one on the right. Quick note works from every other screen too.") + "</li>";
            return;
        }
        list.innerHTML = shown.map((x) => {
            const p = parts(x.content);
            return '<li><button class="note-row" type="button" data-id="' + esc(x._id) + '" aria-current="' + (x._id === state.selected) + '">' +
                "<b>" + highlight(p.title, q) + "</b>" + (p.rest ? "<span>" + highlight(p.rest, q) + "</span>" : "") +
                '<small title="' + esc(fmtDate(new Date(x.createdAt))) + '">' + esc(timeAgo(x.createdAt)) + "</small></button></li>";
        }).join("");
    }

    /* ---------- Open note / new note ---------- */
    function renderPane(focus) {
        if (!state.loaded) return;
        if (state.error) { pane.innerHTML = ""; return; }
        const n = current();
        if (!n) state.selected = "new";
        const back = '<button class="icon-btn np-back" type="button" data-back aria-label="Back to all notes">' + icon("left") + "</button>";

        if (!n) {
            pane.innerHTML =
                '<div class="np-head">' + back + '<h2 id="paneTitle">New note</h2></div>' +
                '<div class="np-body"><label class="sr-only" for="noteText">New note</label>' +
                '<textarea id="noteText" placeholder="Write something down…">' + esc(state.draft) + "</textarea></div>" +
                '<div class="np-foot"><span><kbd>' + MOD + "</kbd> <kbd>Enter</kbd> to save</span>" +
                '<span class="right"><span class="status" aria-live="polite"></span><button class="btn btn-primary btn-sm" type="button" data-save>Save note</button></span></div>';
        } else {
            const edited = n.updatedAt && Math.abs(new Date(n.updatedAt) - new Date(n.createdAt)) > 2000;
            pane.innerHTML =
                '<div class="np-head">' + back + "<div><h2 id=\"paneTitle\">" + esc(parts(n.content).title) + '</h2><p class="np-meta">Written ' +
                esc(fmtDate(new Date(n.createdAt))) + (edited ? " · edited " + esc(timeAgo(n.updatedAt)) : "") + "</p></div>" +
                '<span class="np-actions"><button class="icon-btn danger" type="button" data-delete aria-label="Delete this note">' + icon("trash") + "</button></span></div>" +
                '<div class="np-body"><label class="sr-only" for="noteText">Note</label><textarea id="noteText">' + esc(n.content) + "</textarea></div>" +
                '<div class="np-foot"><span><kbd>' + MOD + "</kbd> <kbd>Enter</kbd> to save</span>" +
                '<span class="right"><span class="status" aria-live="polite"></span><button class="btn btn-primary btn-sm" type="button" data-save disabled>Save changes</button></span></div>';
        }
        const ta = textarea();
        ta.addEventListener("input", () => {
            if (!current()) state.draft = ta.value;
            const save = pane.querySelector("[data-save]");
            if (current()) save.disabled = !isDirty();
            pane.querySelector(".status").textContent = "";
        });
        ta.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
        });
        if (focus) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    }

    function render(focus) { renderList(); renderPane(focus); }

    /* Switching away keeps unsaved edits: they are saved first. */
    async function open(id) {
        if (id === state.selected && !phone()) { textarea()?.focus(); return; }
        if (isDirty() && current()) await save(true);
        state.selected = id;
        app.classList.toggle("editing", true);
        render(!phone() || id === "new");
    }

    async function save(quiet) {
        const ta = textarea();
        if (!ta) return;
        const content = ta.value.trim();
        const n = current();
        const btn = pane.querySelector("[data-save]");
        if (!content) {
            if (!quiet) toast(n ? "A note can't be empty. Delete it instead." : "Write something first.", { error: !!n });
            ta.focus();
            return;
        }
        if (n && content === n.content.trim()) return;
        await busy(btn, async () => {
            try {
                if (n) {
                    const updated = await api("/notes/" + n._id, { method: "PUT", body: { content } });
                    Object.assign(n, updated);
                } else {
                    const created = await api("/notes", { method: "POST", body: { content } });
                    state.notes.unshift(created);
                    state.selected = created._id;
                    state.draft = "";
                }
                if (!quiet) {
                    render(false);
                    pane.querySelector(".status").textContent = n ? "Saved" : "Note saved";
                }
            } catch (e) { toastError(e); }
        });
    }

    async function load() {
        try { state.notes = await api("/notes"); state.error = null; }
        catch (e) { state.error = e.message; }
        state.loaded = true;
        // Desktop opens the newest note; a phone starts on the list.
        state.selected = state.notes.length && !phone() ? state.notes[0]._id : "new";
        render(false);
    }

    /* ---------- Events ---------- */
    $("noteList").addEventListener("click", (e) => {
        const row = e.target.closest(".note-row");
        if (row) open(row.dataset.id);
    });
    pane.addEventListener("click", (e) => {
        if (e.target.closest("[data-save]")) save();
        else if (e.target.closest("[data-back]")) {
            const go = () => { app.classList.remove("editing"); renderList(); };
            if (isDirty() && current()) save(true).then(go); else go();
        } else if (e.target.closest("[data-delete]")) {
            const n = current();
            if (!n) return;
            const i = state.notes.indexOf(n);
            undoable({
                message: "Note deleted",
                path: "/notes/" + n._id,
                apply: () => {
                    state.notes.splice(i, 1);
                    const next = state.notes[Math.min(i, state.notes.length - 1)];
                    state.selected = next && !phone() ? next._id : "new";
                    if (phone()) app.classList.remove("editing");
                    render(false);
                },
                revert: () => { state.notes.splice(Math.min(i, state.notes.length), 0, n); state.selected = n._id; render(false); }
            });
        }
    });

    $("newNoteBtn").innerHTML = icon("plus") + "New";
    $("newNoteBtn").setAttribute("aria-label", "New note");
    $("newNoteBtn").addEventListener("click", () => open("new"));
    $("searchIcon").outerHTML = icon("search");
    $("search").addEventListener("input", () => renderList());
    addEventListener("beforeunload", (e) => { if (isDirty()) { e.preventDefault(); e.returnValue = ""; } });

    load();
})();
