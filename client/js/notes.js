/* Notes: write, search, edit in place. */
(function () {
    "use strict";
    const { api, esc, timeAgo, fmtDate, icon, toast, toastError, busy, undoable } = window.S;

    const $ = (id) => document.getElementById(id);
    const state = { notes: [], loaded: false, error: null, editing: null, fresh: null };
    const MOD = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";

    function highlight(text, q) {
        if (!q) return esc(text);
        // Split the raw text, then escape each piece, so a match never lands inside an entity.
        const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
        return text.split(re).map((part, i) => (i % 2 ? "<mark>" + esc(part) + "</mark>" : esc(part))).join("");
    }

    function render() {
        const el = $("notes");
        if (!state.loaded) return;
        if (state.error) {
            el.innerHTML = '<div class="callout" style="column-span:all">' + icon("alert") + "<div><strong>Notes couldn't load.</strong>" + esc(state.error) + "</div></div>";
            return;
        }
        const n = state.notes.length;
        $("noteCount").textContent = n ? n + " note" + (n > 1 ? "s" : "") + ", newest first" : "Nothing written yet.";

        const q = $("search").value.trim();
        const shown = q ? state.notes.filter((x) => x.content.toLowerCase().includes(q.toLowerCase())) : state.notes;
        if (!shown.length) {
            el.innerHTML = '<div class="empty" style="column-span:all">' + (q
                ? "<strong>No notes mention “" + esc(q) + "”.</strong>Try a shorter word, or clear the search."
                : "<strong>No notes yet.</strong>Write one above. You can also use Quick note from any other screen.") + "</div>";
            return;
        }

        el.innerHTML = shown.map((x) => {
            if (state.editing === x._id) {
                return '<article class="note note-edit" data-id="' + esc(x._id) + '">' +
                    '<label class="sr-only" for="edit-' + esc(x._id) + '">Edit note</label>' +
                    '<textarea class="input" id="edit-' + esc(x._id) + '">' + esc(x.content) + "</textarea>" +
                    '<div class="actions"><button class="btn btn-sm btn-ghost" type="button" data-cancel>Cancel</button><button class="btn btn-sm btn-primary" type="button" data-save>Save</button></div></article>';
            }
            const edited = x.updatedAt && Math.abs(new Date(x.updatedAt) - new Date(x.createdAt)) > 2000;
            return '<article class="note' + (state.fresh === x._id ? " fresh" : "") + '" data-id="' + esc(x._id) + '">' +
                '<div class="note-body">' + highlight(x.content, q) + "</div>" +
                '<div class="note-foot"><span title="' + esc(fmtDate(new Date(x.createdAt))) + '">' + esc(timeAgo(x.createdAt)) + (edited ? " · edited" : "") + "</span>" +
                '<span class="row-actions">' +
                '<button class="icon-btn" type="button" data-edit aria-label="Edit note">' + icon("pencil") + "</button>" +
                '<button class="icon-btn danger" type="button" data-delete aria-label="Delete note">' + icon("trash") + "</button></span></div></article>";
        }).join("");
        state.fresh = null;

        if (state.editing) {
            const ta = el.querySelector(".note-edit textarea");
            if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); autosize(ta); }
        }
    }

    function autosize(ta) {
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight + 2, window.innerHeight * 0.5) + "px";
    }

    async function load() {
        try { state.notes = await api("/notes"); state.error = null; }
        catch (e) { state.error = e.message; }
        state.loaded = true;
        render();
    }

    async function saveEdit(article) {
        const id = article.dataset.id;
        const note = state.notes.find((x) => x._id === id);
        const content = article.querySelector("textarea").value.trim();
        if (!content) { toast("A note can't be empty. Delete it instead.", { error: true }); return; }
        if (content === note.content) { state.editing = null; render(); return; }
        await busy(article.querySelector("[data-save]"), async () => {
            try {
                const updated = await api("/notes/" + id, { method: "PUT", body: { content } });
                Object.assign(note, updated);
                state.editing = null;
                render();
            } catch (e) { toastError(e); }
        });
    }

    $("notes").addEventListener("click", (e) => {
        const article = e.target.closest(".note");
        if (!article) return;
        const id = article.dataset.id;
        if (e.target.closest("[data-edit]")) { state.editing = id; render(); }
        else if (e.target.closest("[data-cancel]")) { state.editing = null; render(); }
        else if (e.target.closest("[data-save]")) saveEdit(article);
        else if (e.target.closest("[data-delete]")) {
            const i = state.notes.findIndex((x) => x._id === id);
            const note = state.notes[i];
            undoable({
                message: "Note deleted",
                path: "/notes/" + id,
                apply: () => { state.notes.splice(i, 1); render(); },
                revert: () => { state.notes.splice(Math.min(i, state.notes.length), 0, note); render(); }
            });
        }
    });

    $("notes").addEventListener("keydown", (e) => {
        const article = e.target.closest(".note-edit");
        if (!article) return;
        if (e.key === "Escape") { state.editing = null; render(); }
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveEdit(article); }
    });
    $("notes").addEventListener("input", (e) => { if (e.target.matches(".note-edit textarea")) autosize(e.target); });

    /* Composer */
    const ta = $("newNote");
    $("composerHint").innerHTML = "<kbd>" + MOD + "</kbd> <kbd>Enter</kbd> to save";
    ta.addEventListener("input", () => autosize(ta));
    ta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); $("composer").requestSubmit(); }
    });
    $("composer").addEventListener("submit", (e) => {
        e.preventDefault();
        const content = ta.value.trim();
        if (!content) { ta.focus(); return; }
        busy($("noteSubmit"), async () => {
            try {
                const note = await api("/notes", { method: "POST", body: { content } });
                state.notes.unshift(note);
                state.fresh = note._id;
                ta.value = "";
                autosize(ta);
                $("search").value = "";
                render();
                ta.focus();
            } catch (err) { toastError(err); }
        });
    });

    $("searchIcon").outerHTML = icon("search");
    $("search").addEventListener("input", render);

    load();
})();
