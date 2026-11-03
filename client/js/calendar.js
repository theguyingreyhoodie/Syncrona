/* Calendar: one month where tasks, events and spending meet. */
(function () {
    "use strict";
    const { api, esc, when, sameDay, startOfDay, addDays, fmtTime, fmtDayLong, MO, MO_LONG, WD_LONG, money, threshold,
        icon, LEAD, checkBtn, navTasks, toPayload, ymd, toastError, busy, undoable } = window.S;

    const $ = (id) => document.getElementById(id);
    const today = startOfDay(new Date());
    const state = {
        tasks: [], events: [], expenses: [], loaded: false,
        month: new Date(today.getFullYear(), today.getMonth(), 1),
        selected: today,
        fresh: null
    };


    function itemsOn(day) {
        const on = (v) => { const w = when(v); return w && sameDay(w.day, day) ? w : null; };
        const out = { tasks: [], events: [], spend: [] };
        state.tasks.forEach((t) => { const w = on(t.dueDate); if (w) out.tasks.push({ ...t, w }); });
        state.events.forEach((e) => { const w = on(e.date); if (w) out.events.push({ ...e, w }); });
        state.expenses.forEach((x) => { const w = on(x.date); if (w) out.spend.push({ ...x, w }); });
        const t = (r) => (r.w.at ? r.w.at.getTime() : 0);
        out.tasks.sort((a, b) => t(a) - t(b));
        out.events.sort((a, b) => t(a) - t(b));
        return out;
    }

    /* ---------- Grid ---------- */
    function renderGrid() {
        const m = state.month;
        const y = m.getFullYear(), mo = m.getMonth();
        $("monthTitle").textContent = MO_LONG[mo] + " " + y;
        document.title = MO_LONG[mo] + " " + y + " · Syncrona";

        const thr = threshold();
        const lead = (m.getDay() + 6) % 7; // Monday first
        const days = new Date(y, mo + 1, 0).getDate();
        const cells = Math.ceil((lead + days) / 7) * 7;
        let html = "";
        let monthTotal = 0, payments = 0, overCount = 0;
        // Roving tabindex: the selected day if shown, else today, else the 1st.
        const tabDay = state.selected.getMonth() === mo && state.selected.getFullYear() === y ? state.selected
            : today.getMonth() === mo && today.getFullYear() === y ? today : m;

        for (let i = 0; i < cells; i++) {
            const d = addDays(m, i - lead);
            const inMonth = d.getMonth() === mo;
            const wk = d.getDay() === 0 || d.getDay() === 6;
            if (!inMonth) {
                html += '<span class="cal-day outside' + (wk ? " weekend" : "") + '" aria-hidden="true"><span class="cal-num">' + d.getDate() + "</span></span>";
                continue;
            }
            const it = itemsOn(d);
            const spent = it.spend.reduce((a, x) => a + x.amount, 0);
            const over = it.spend.some((x) => x.amount >= thr);
            monthTotal += spent;
            payments += it.spend.length;
            overCount += it.spend.filter((x) => x.amount >= thr).length;

            const isToday = sameDay(d, today);
            const sel = sameDay(d, state.selected);

            const label = fmtDayLong(d) + (isToday ? ", today" : "") + ": " +
                [it.tasks.length && it.tasks.length + " task" + (it.tasks.length > 1 ? "s" : ""),
                it.events.length && it.events.length + " event" + (it.events.length > 1 ? "s" : ""),
                spent && money(spent) + " spent"].filter(Boolean).join(", ");

            html += '<button type="button" class="cal-day' + (isToday ? " today" : "") + (wk ? " weekend" : "") + '" data-day="' + ymd(d) + '" aria-pressed="' + sel + '" tabindex="' + (sameDay(d, tabDay) ? 0 : -1) + '" aria-label="' + esc(label || fmtDayLong(d)) + '">' +
                '<span class="cal-num">' + d.getDate() + "</span>" +
                '<span class="cal-dots" aria-hidden="true">' +
                (it.events.length ? '<span class="cd"><i class="ev"></i><b>' + it.events.length + "</b></span>" : "") +
                (it.tasks.length ? '<span class="cd' + (it.tasks.every((t) => t.completed) ? " done" : "") + '"><i></i><b>' + it.tasks.length + "</b></span>" : "") +
                (spent ? '<span class="sp' + (over ? " over" : "") + '"></span>' : "") + "</span>" +
                (spent ? '<span class="cal-spend' + (over ? " over" : "") + '">' + esc(money(spent)) + "</span>" : "") +
"</button>";
        }
        $("grid").innerHTML = html;
        $("footLabel").textContent = "Spent in " + MO_LONG[mo];
        $("monthTotal").textContent = money(monthTotal);
        $("monthFacts").innerHTML = payments
            ? payments + " payment" + (payments > 1 ? "s" : "") + (overCount ? ' · <span class="is-over">' + overCount + " at or over " + esc(money(thr)) + "</span>" : "") +
            ' · <a href="settings.html">Limit ' + esc(money(thr)) + "</a>"
            : "No spending logged this month.";
    }

    /* ---------- Day panel ---------- */
    function renderPanel() {
        const d = state.selected;
        const isToday = sameDay(d, today);
        $("dayTitle").textContent = (isToday ? "Today, " : WD_LONG[d.getDay()] + " ") + d.getDate() + " " + MO_LONG[d.getMonth()];
        const it = itemsOn(d);
        const spent = it.spend.reduce((a, x) => a + x.amount, 0);
        const parts = [];
        if (it.tasks.length) parts.push(it.tasks.length + " task" + (it.tasks.length > 1 ? "s" : ""));
        if (it.events.length) parts.push(it.events.length + " event" + (it.events.length > 1 ? "s" : ""));
        if (spent) parts.push(money(spent) + " spent");
        $("daySub").textContent = parts.length ? parts.join(" · ") : "Nothing on this day yet.";

        const thr = threshold();
        const when2 = (r) => (r.w.at ? fmtTime(r.w.at) : "Any time");
        const li = (cls, lead, title, sub, end, actions, subCls) =>
            '<li class="item' + cls + '">' + lead + '<span class="item-main"><span class="item-title">' + esc(title) + '</span><span class="item-sub' + (subCls || "") + '">' + sub + "</span></span>" +
            (end ? '<span class="item-end">' + end + "</span>" : "") + '<span class="item-actions">' + actions + "</span></li>";
        const del = (kind, id, title) => '<button class="icon-btn danger" type="button" data-delete="' + kind + ":" + esc(id) + '" aria-label="' + esc("Delete " + title) + '">' + icon("trash") + "</button>";

        // One timeline, in the same order as Today: timed items by time, then all-day events,
        // then tasks with no time, then payments.
        const rows = [
            ...it.events.map((e) => ({ k: "event", r: e })),
            ...it.tasks.map((t) => ({ k: "task", r: t }))
        ].sort((a, b) => {
            const ta = a.r.w.at ? a.r.w.at.getTime() : null, tb = b.r.w.at ? b.r.w.at.getTime() : null;
            if (ta !== null && tb !== null) return ta - tb;
            if (ta !== null) return -1;
            if (tb !== null) return 1;
            return a.k === b.k ? 0 : a.k === "event" ? -1 : 1;
        });
        let html = "";
        rows.forEach(({ k, r }) => {
            if (k === "event") {
                html += li(state.fresh === r._id ? " fresh" : "", LEAD.event, r.title, "Event", '<span class="time-pill">' + esc(r.w.at ? fmtTime(r.w.at) : "All day") + "</span>", del("events", r._id, r.title));
            } else {
                html += li((r.completed ? " done" : "") + (state.fresh === r._id ? " fresh" : ""), checkBtn(r), r.title, r.completed ? "Done" : "Task",
                    '<span class="time-pill">' + esc(when2(r)) + "</span>", del("tasks", r._id, r.title));
            }
        });
        it.spend.forEach((x) => {
            const over = x.amount >= thr;
            html += li(state.fresh === x._id ? " fresh" : "", LEAD.spend, x.title, over ? "At or over your " + esc(money(thr)) + " limit" : "Payment",
                '<span class="amt' + (over ? " is-over" : "") + '">' + esc(money(x.amount)) + "</span>", del("expenses", x._id, x.title), over ? " is-over" : "");
        });
        $("dayList").innerHTML = html;
        $("dayList").hidden = !html;
        state.fresh = null;
    }

    function renderAll() { renderGrid(); renderPanel(); navTasks(state.tasks); }

    function select(d, focus) {
        if (d.getMonth() !== state.month.getMonth() || d.getFullYear() !== state.month.getFullYear()) {
            state.month = new Date(d.getFullYear(), d.getMonth(), 1);
        }
        state.selected = startOfDay(d);
        renderAll();
        if (focus) $("grid").querySelector('[data-day="' + ymd(d) + '"]')?.focus();
    }

    /* ---------- Load ---------- */
    async function load() {
        try {
            const [t, e, x] = await Promise.all([api("/tasks"), api("/events"), api("/expenses")]);
            state.tasks = t; state.events = e; state.expenses = x;
            $("loadError").innerHTML = "";
        } catch (err) {
            $("loadError").innerHTML = '<div class="callout">' + icon("alert") + "<div><strong>The calendar couldn't load your items.</strong>" + esc(err.message) + "</div></div>";
        }
        state.loaded = true;
        renderAll();
    }

    /* ---------- Interactions ---------- */
    $("prevMonth").innerHTML = icon("left");
    $("nextMonth").innerHTML = icon("right");
    $("prevMonth").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderGrid(); });
    $("nextMonth").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderGrid(); });
    $("thisMonth").addEventListener("click", () => select(today));

    $("grid").addEventListener("click", (e) => {
        const b = e.target.closest("[data-day]");
        if (!b) return;
        select(S.parseYmd(b.dataset.day), true);
        if (matchMedia("(max-width: 980px)").matches) $("dayPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("grid").addEventListener("keydown", (e) => {
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (!step || !e.target.closest("[data-day]")) return;
        e.preventDefault();
        select(addDays(state.selected, step), true);
    });

    $("dayList").addEventListener("click", async (e) => {
        const tog = e.target.closest("[data-toggle]");
        const del = e.target.closest("[data-delete]");
        if (tog) {
            const t = state.tasks.find((x) => x._id === tog.dataset.toggle);
            if (!t) return;
            t.completed = !t.completed;
            renderAll();
            try { await api("/tasks/" + t._id, { method: "PUT", body: { completed: t.completed } }); }
            catch (err) { t.completed = !t.completed; renderAll(); toastError(err); }
        } else if (del) {
            const [kind, id] = del.dataset.delete.split(":");
            const arr = state[kind === "events" ? "events" : kind === "tasks" ? "tasks" : "expenses"];
            const i = arr.findIndex((x) => x._id === id);
            if (i < 0) return;
            const item = arr[i];
            undoable({
                message: "Deleted “" + (item.title.length > 36 ? item.title.slice(0, 36) + "…" : item.title) + "”",
                path: "/" + kind + "/" + id,
                apply: () => { arr.splice(i, 1); renderAll(); },
                revert: () => { arr.splice(Math.min(i, arr.length), 0, item); renderAll(); }
            });
        }
    });

    /* Add form */
    const form = $("dayForm");
    const kindOf = () => form.querySelector("input[name=kind]:checked").value;
    const PH = { task: "Add a task for this day", event: "Add an event", spend: "What did you pay for?" };
    function syncKind() {
        const k = kindOf();
        $("dfTitle").placeholder = PH[k];
        $("dfTimeField").hidden = k === "spend";
        $("dfAmountField").hidden = k !== "spend";
        $("dfSubmit").innerHTML = icon("plus") + "Add";
        $("dfError").textContent = "";
    }
    form.querySelectorAll("input[name=kind]").forEach((r) => r.addEventListener("change", () => { syncKind(); $("dfTitle").focus(); }));
    syncKind();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const k = kindOf();
        const title = $("dfTitle").value.trim();
        const amount = parseFloat($("dfAmount").value);
        if (!title) { $("dfError").textContent = k === "spend" ? "Say what the payment was for." : "Give it a title first."; $("dfTitle").focus(); return; }
        if (k === "spend" && !(amount > 0)) { $("dfError").textContent = "Enter an amount above ₹0."; $("dfAmount").focus(); return; }
        $("dfError").textContent = "";
        const date = ymd(state.selected);
        busy($("dfSubmit"), async () => {
            try {
                let created;
                if (k === "task") { created = await api("/tasks", { method: "POST", body: { title, dueDate: toPayload(date, $("dfTime").value) } }); state.tasks.unshift(created); }
                else if (k === "event") { created = await api("/events", { method: "POST", body: { title, date: toPayload(date, $("dfTime").value) } }); state.events.push(created); }
                else { created = await api("/expenses", { method: "POST", body: { title, amount, date } }); state.expenses.unshift(created); }
                state.fresh = created._id;
                $("dfTitle").value = ""; $("dfTime").value = ""; $("dfAmount").value = ""; S.syncEmpty();
                renderAll();
                $("dfTitle").focus();
            } catch (err) { $("dfError").textContent = err.message; }
        });
    });

    renderAll();
    load();
})();
