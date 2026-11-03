/* Tasks: grouped timetable of everything due. */
(function () {
    "use strict";
    const { api, esc, when, sameDay, startOfDay, addDays, daysBetween, fmtTime, MO, WD, relDay, relTime, timeAgo,
        icon, toPayload, toastError, busy, undoable, everyMinute } = window.S;

    const state = { tasks: [], loaded: false, error: null, fresh: null };
    const $ = (id) => document.getElementById(id);
    const filter = () => document.querySelector("input[name=filter]:checked").value;

    function groupOf(t, today) {
        if (t.completed) return "done";
        const w = when(t.dueDate);
        if (!w) return "nodate";
        const n = daysBetween(today, w.day);
        if (n < 0) return "overdue";
        if (n === 0) return "today";
        if (n === 1) return "tomorrow";
        if (n < 7) return "week";
        return "later";
    }

    const GROUPS = [
        ["overdue", "Overdue"], ["today", "Today"], ["tomorrow", "Tomorrow"], ["week", "This week"],
        ["later", "Later"], ["nodate", "No date"], ["done", "Done"]
    ];

    function dueCell(t, group) {
        const w = when(t.dueDate);
        if (!w) return '<span style="color:var(--ink-3)">—</span>';
        const time = w.at ? "<small>" + fmtTime(w.at) + "</small>" : "";
        if (group === "today") return w.at ? fmtTime(w.at) : '<small style="margin:0">Today</small>';
        if (group === "tomorrow" || group === "week") return esc(WD[w.day.getDay()]) + time;
        return esc(w.day.getDate() + " " + MO[w.day.getMonth()]) + time;
    }

    function statusLabel(t, group, now) {
        if (group === "done") return "done " + timeAgo(t.updatedAt || t.createdAt);
        if (group === "nodate") return "open";
        const w = when(t.dueDate);
        if (group === "overdue") return "overdue · " + relDay(w.day, now);
        if (w.at && group === "today") return w.at < now ? "due " + relTime(w.at, now) : S.relSoon(w.at, now);
        return group === "today" ? "due today" : relDay(w.day, now);
    }

    function row(t, group, now) {
        const late = group === "overdue" || (group === "today" && when(t.dueDate).at && when(t.dueDate).at < now);
        const label = statusLabel(t, group, now);
        return '<tr class="k-task' + (t.completed ? " done" : "") + (state.fresh === t._id ? " fresh" : "") + '">' +
            '<td class="tt-time">' + dueCell(t, group) + "</td>" +
            '<td class="tt-item"><span class="title">' + esc(t.title) + '</span><span class="sub show-sm' + (late ? " is-overdue" : "") + '">' + esc(label) + "</span></td>" +
            '<td class="tt-status"><span class="tt-status-inner"><span class="hide-sm ' + (late ? "is-overdue" : "") + '">' + esc(label) + "</span>" +
            '<button class="mark' + (late ? " overdue" : "") + '" type="button" data-toggle="' + esc(t._id) + '" aria-pressed="' + !!t.completed + '" aria-label="' +
            esc((t.completed ? "Mark not done: " : "Mark done: ") + t.title) + '">' + icon("check") + "</button></span></td>" +
            '<td class="tt-act"><span class="row-actions"><button class="icon-btn danger" type="button" data-delete="' + esc(t._id) + '" aria-label="' +
            esc("Delete task: " + t.title) + '">' + icon("trash") + "</button></span></td></tr>";
    }

    function render() {
        const list = $("list");
        if (!state.loaded) return;
        if (state.error) {
            list.innerHTML = '<div class="callout">' + icon("alert") + "<div><strong>Tasks couldn't load.</strong>" + esc(state.error) + "</div></div>";
            return;
        }
        const now = new Date();
        const today = startOfDay(now);
        const open = state.tasks.filter((t) => !t.completed);
        const done = state.tasks.length - open.length;
        const overdue = open.filter((t) => groupOf(t, today) === "overdue").length;
        document.querySelector('[data-count="open"]').textContent = open.length;
        document.querySelector('[data-count="done"]').textContent = done;
        document.querySelector('[data-count="all"]').textContent = state.tasks.length;
        $("taskSummary").innerHTML = state.tasks.length
            ? open.length + " open" + (overdue ? ' · <span class="is-overdue">' + overdue + " overdue</span>" : "") + " · " + done + " done"
            : "Nothing here yet.";

        const f = filter();
        const shown = state.tasks.filter((t) => f === "all" || (f === "done" ? t.completed : !t.completed));
        if (!shown.length) {
            const msg = !state.tasks.length
                ? "<strong>No tasks yet.</strong>Type one above and press Enter. Give it a date and it shows up on Today and in the calendar."
                : f === "done" ? "<strong>Nothing finished yet.</strong>Tick a task's circle to mark it done; it stays here with the time you did it."
                    : "<strong>All clear.</strong>Every task is done. Add the next one above.";
            list.innerHTML = '<div class="empty">' + msg + "</div>";
            return;
        }

        const buckets = {};
        shown.forEach((t) => { (buckets[groupOf(t, today)] = buckets[groupOf(t, today)] || []).push(t); });
        const sortKey = (t) => { const w = when(t.dueDate); return w ? (w.at || w.day).getTime() : Infinity; };
        Object.keys(buckets).forEach((g) => {
            if (g === "done") buckets[g].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
            else if (g === "nodate") buckets[g].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            else buckets[g].sort((a, b) => sortKey(a) - sortKey(b));
        });

        let html = '<table class="timetable"><thead><tr><th scope="col">Due</th><th scope="col">Task</th><th scope="col" style="text-align:right">Status</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>';
        GROUPS.forEach(([g, label]) => {
            const items = buckets[g];
            if (!items) return;
            html += '<tr class="group' + (g === "overdue" ? " overdue" : "") + '"><td colspan="4">' + label + '<span class="count">' + items.length + "</span></td></tr>";
            html += items.map((t) => row(t, g, now)).join("");
        });
        list.innerHTML = html + "</tbody></table>";
        state.fresh = null;
    }

    async function load() {
        try { state.tasks = await api("/tasks"); state.error = null; }
        catch (e) { state.error = e.message; }
        state.loaded = true;
        render();
    }

    $("list").addEventListener("click", async (ev) => {
        const tog = ev.target.closest("[data-toggle]");
        const del = ev.target.closest("[data-delete]");
        if (tog) {
            const t = state.tasks.find((x) => x._id === tog.dataset.toggle);
            if (!t) return;
            t.completed = !t.completed;
            t.updatedAt = new Date().toISOString();
            render();
            try { await api("/tasks/" + t._id, { method: "PUT", body: { completed: t.completed } }); }
            catch (e) { t.completed = !t.completed; render(); toastError(e); }
        } else if (del) {
            const i = state.tasks.findIndex((x) => x._id === del.dataset.delete);
            if (i < 0) return;
            const t = state.tasks[i];
            undoable({
                message: "Deleted “" + (t.title.length > 40 ? t.title.slice(0, 40) + "…" : t.title) + "”",
                path: "/tasks/" + t._id,
                apply: () => { state.tasks.splice(i, 1); render(); },
                revert: () => { state.tasks.splice(Math.min(i, state.tasks.length), 0, t); render(); }
            });
        }
    });

    document.querySelectorAll("input[name=filter]").forEach((r) => r.addEventListener("change", render));

    $("taskSubmit").innerHTML = icon("plus") + "Add task";
    $("addTask").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $("taskTitle").value.trim();
        if (!title) {
            $("taskError").textContent = "Give the task a title first.";
            $("taskTitle").setAttribute("aria-invalid", "true");
            $("taskTitle").focus();
            return;
        }
        if ($("taskTime").value && !$("taskDate").value) {
            $("taskError").textContent = "Pick a date for that time, or clear the time.";
            $("taskDate").focus();
            return;
        }
        $("taskError").textContent = "";
        $("taskTitle").removeAttribute("aria-invalid");
        busy($("taskSubmit"), async () => {
            try {
                const created = await api("/tasks", { method: "POST", body: { title, dueDate: toPayload($("taskDate").value, $("taskTime").value) } });
                state.tasks.unshift(created);
                state.fresh = created._id;
                $("taskTitle").value = "";
                $("taskTime").value = "";
                if (filter() === "done") document.querySelector("input[name=filter][value=open]").checked = true;
                render();
                $("taskTitle").focus();
            } catch (err) { $("taskError").textContent = err.message; }
        });
    });

    everyMinute(render);
    load();
})();
