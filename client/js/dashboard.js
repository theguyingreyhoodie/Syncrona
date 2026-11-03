/* Today: the day as a departures board. */
(function () {
    "use strict";
    const { api, esc, when, sameDay, startOfDay, addDays, daysBetween, fmtTime, fmtDay, fmtDayLong, MO_LONG, MO,
        relTime, relDay, timeAgo, money, threshold, icon, LINES, toPayload, ymd, toast, toastError, busy, everyMinute, user } = window.S;

    const state = { tasks: [], events: [], expenses: [], notes: [], loaded: false, error: null, fresh: null };
    const $ = (id) => document.getElementById(id);
    const LATER_LIMIT = 6;

    /* ---------- Clock + header ---------- */
    function renderHeader(now) {
        $("todayTitle").innerHTML = esc(fmtDay(now)) + ' <span class="soft">' + now.getFullYear() + "</span>";
        const t = S.fmtTime(now).split(":");
        $("clock").innerHTML = t[0] + '<span class="clock-colon">:</span>' + t[1];
        const h = now.getHours();
        const part = h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
        const u = user();
        $("greeting").textContent = part + (u && u.name ? ", " + u.name.split(" ")[0] : "") + ".";
        document.title = "Today, " + fmtDay(now) + " · Syncrona";
    }

    /* ---------- Board rows ---------- */
    function collect(now) {
        const today = startOfDay(now);
        const weekEnd = addDays(today, 8);
        const overdue = [], todays = [], later = [];

        state.tasks.forEach((t) => {
            const w = when(t.dueDate);
            if (!w) return;
            const row = { kind: "task", id: t._id, title: t.title, w, done: !!t.completed };
            if (w.day < today) { if (!t.completed) overdue.push(row); }
            else if (sameDay(w.day, today)) todays.push(row);
            else if (w.day < weekEnd && !t.completed) later.push(row);
        });
        state.events.forEach((e) => {
            const w = when(e.date);
            if (!w || w.day < today) return;
            const row = { kind: "event", id: e._id, title: e.title, w };
            if (sameDay(w.day, today)) todays.push(row);
            else if (w.day < weekEnd) later.push(row);
        });
        state.expenses.forEach((x) => {
            const w = when(x.date);
            if (w && sameDay(w.day, today)) todays.push({ kind: "spend", id: x._id, title: x.title, w, amount: x.amount });
        });

        const byTime = (a, b) => (a.w.day - b.w.day) || ((a.w.at ? a.w.at.getTime() % 86400000 : -1) - (b.w.at ? b.w.at.getTime() % 86400000 : -1)) || 0;
        overdue.sort(byTime);
        later.sort((a, b) => (a.w.day - b.w.day) || ((a.w.at || 0) - (b.w.at || 0)));

        const past = [], anytime = [], future = [];
        todays.forEach((r) => {
            // Timed rows sit by their time (a task done early still shows at 17:00, struck);
            // untimed done tasks and logged payments sit above the line.
            const isPast = r.w.at ? r.w.at < now : (r.done || r.kind === "spend");
            if (isPast) past.push(r);
            else if (!r.w.at) anytime.push(r);
            else future.push(r);
        });
        const t = (r) => (r.w.at ? r.w.at.getTime() : 0);
        past.sort((a, b) => t(a) - t(b));
        future.sort((a, b) => t(a) - t(b));
        return { overdue, past, anytime, future, later };
    }

    function rowHtml(r, now, ctx) {
        const thr = threshold();
        const classes = ["k-" + r.kind];
        if (r.done) classes.push("done");
        if (ctx === "past" && !r.done && r.kind !== "spend") classes.push("past");
        if (state.fresh === r.id) classes.push("fresh");

        let time;
        if (ctx === "overdue") time = esc(r.w.day.getDate() + " " + MO[r.w.day.getMonth()]);
        else if (ctx === "later") time = esc(S.WD[r.w.day.getDay()]) + (r.w.at ? "<small>" + fmtTime(r.w.at) + "</small>" : "");
        else time = r.w.at ? fmtTime(r.w.at) : '<small style="margin:0">Today</small>';

        let status = "", label = "";
        if (r.kind === "task") {
            label = r.done ? "done" : ctx === "overdue" ? "overdue · " + relDay(r.w.day, now) : r.w.at ? S.relSoon(r.w.at, now) : ctx === "later" ? relDay(r.w.day, now) : "due today";
            status = '<span class="hide-sm ' + (ctx === "overdue" ? "is-overdue" : "") + '">' + esc(label) + "</span>" +
                '<button class="mark' + (ctx === "overdue" ? " overdue" : "") + '" type="button" data-toggle="' + esc(r.id) + '" aria-pressed="' + r.done + '" aria-label="' +
                esc((r.done ? "Mark not done: " : "Mark done: ") + r.title) + '">' + icon("check") + "</button>";
        } else if (r.kind === "event") {
            label = r.w.at ? S.relSoon(r.w.at, now) : relDay(r.w.day, now);
            status = '<span class="hide-sm">' + esc(label) + "</span>";
        } else {
            const over = r.amount >= thr;
            status = '<span class="tt-amount' + (over ? " is-over" : "") + '"' + (over ? ' title="At or above your ' + esc(money(thr)) + ' threshold"' : "") + ">" + esc(money(r.amount)) + "</span>";
        }

        return '<tr class="' + classes.join(" ") + '">' +
            '<td class="tt-time">' + time + "</td>" +
            '<td class="tt-line">' + LINES[r.kind] + "</td>" +
            '<td class="tt-item"><span class="title">' + esc(r.title) + "</span>" +
            (label ? '<span class="sub show-sm' + (ctx === "overdue" ? " is-overdue" : "") + '">' + esc(label) + "</span>" : "") + "</td>" +
            '<td class="tt-status"><span class="tt-status-inner">' + status + "</span></td></tr>";
    }

    function renderBoard() {
        const board = $("board");
        if (!state.loaded) return;
        if (state.error) {
            board.innerHTML = '<div class="callout">' + icon("alert") + "<div><strong>Today couldn't load.</strong>" + esc(state.error) +
                ' <button class="btn btn-sm" type="button" data-retry style="margin-top:8px">Try again</button></div></div>';
            board.querySelector("[data-retry]").addEventListener("click", load);
            return;
        }

        const now = new Date();
        const g = collect(now);
        const todays = [...g.past, ...g.anytime, ...g.future];
        const openToday = todays.filter((r) => r.kind === "task" && !r.done).length;
        const doneToday = todays.filter((r) => r.kind === "task" && r.done).length;
        $("nextMeta").textContent = openToday + " to go · " + doneToday + " done today";

        const total = g.overdue.length + g.past.length + g.anytime.length + g.future.length + g.later.length;
        if (!total) {
            board.innerHTML = '<div class="empty"><strong>A clear day.</strong>Nothing is due or scheduled for the next week. Add a task above, or plan ahead in the <a href="calendar.html">calendar</a>.</div>';
            return;
        }

        let html = '<table class="timetable"><thead><tr><th scope="col">Time</th><th scope="col"><span class="sr-only">Type</span></th><th scope="col">Item</th><th scope="col" style="text-align:right">Status</th></tr></thead><tbody>';
        if (g.overdue.length) {
            html += '<tr class="group overdue"><td colspan="4">Overdue<span class="count">' + g.overdue.length + "</span></td></tr>";
            html += g.overdue.map((r) => rowHtml(r, now, "overdue")).join("");
            html += '<tr class="group"><td colspan="4">Today</td></tr>';
        }
        html += g.past.map((r) => rowHtml(r, now, "past")).join("");
        html += '<tr class="now" aria-hidden="true"><td colspan="4"><div class="now-tag"><span>NOW ' + fmtTime(now) + "</span></div></td></tr>";
        html += g.anytime.map((r) => rowHtml(r, now, "anytime")).join("");
        html += g.future.map((r) => rowHtml(r, now, "future")).join("");
        if (!g.past.length && !g.anytime.length && !g.future.length) {
            html += '<tr><td colspan="4" class="tt-item" style="color:var(--ink-2)">Nothing else today.</td></tr>';
        }
        if (g.later.length) {
            html += '<tr class="group"><td colspan="4">This week<span class="count">' + g.later.length + "</span></td></tr>";
            html += g.later.slice(0, LATER_LIMIT).map((r) => rowHtml(r, now, "later")).join("");
            if (g.later.length > LATER_LIMIT) {
                html += '<tr><td colspan="4" class="tt-item"><a href="calendar.html">' + (g.later.length - LATER_LIMIT) + " more this week in the calendar</a></td></tr>";
            }
        }
        html += "</tbody></table>";

        const undated = state.tasks.filter((t) => !t.dueDate && !t.completed).length;
        if (undated) html += '<p class="section-meta" style="margin-top:12px"><a href="tasks.html">' + undated + " open task" + (undated === 1 ? "" : "s") + " without a date</a></p>";
        board.innerHTML = html;
        state.fresh = null;
    }

    /* ---------- Month spend ---------- */
    function renderSpend() {
        const el = $("spend");
        if (!state.loaded || state.error) { el.innerHTML = ""; return; }
        const now = new Date();
        const y = now.getFullYear(), m = now.getMonth();
        $("spendHead").textContent = MO_LONG[m] + " spend";
        const thr = threshold();
        const days = new Date(y, m + 1, 0).getDate();
        const perDay = new Array(days).fill(0);
        const overDay = new Array(days).fill(false);
        const items = [];
        state.expenses.forEach((x) => {
            const w = when(x.date);
            if (!w || w.day.getFullYear() !== y || w.day.getMonth() !== m) return;
            const i = w.day.getDate() - 1;
            perDay[i] += x.amount;
            if (x.amount >= thr) overDay[i] = true;
            items.push({ ...x, w });
        });
        const total = perDay.reduce((a, b) => a + b, 0);
        const overCount = items.filter((x) => x.amount >= thr).length;

        if (!items.length) {
            el.innerHTML = '<div class="spend-total">' + money(0) + '</div><p class="spend-meta">No spending logged in ' + MO_LONG[m] + " yet. Choose Expense above to log one.</p>";
            return;
        }

        const max = Math.max(...perDay);
        const peak = perDay.indexOf(max);
        const bars = perDay.map((v, i) => {
            const future = i + 1 > now.getDate();
            const cls = future ? "future" : v === 0 ? "zero" : overDay[i] ? "over" : "";
            // Square-root scale so small spending days stay readable beside a rent day.
            const h = v ? Math.max(14, Math.sqrt(v / max) * 100) : 3;
            return '<i class="' + cls + (i + 1 === now.getDate() ? " today" : "") + '" style="height:' + h.toFixed(1) + '%" title="' +
                esc((i + 1) + " " + MO[m] + ": " + money(v)) + '"></i>';
        }).join("");

        const largest = items.slice().sort((a, b) => b.amount - a.amount).slice(0, 3);
        el.innerHTML =
            '<div class="spend-total">' + esc(money(total)) + "</div>" +
            '<p class="spend-meta">' + items.length + " payment" + (items.length === 1 ? "" : "s") +
            (overCount ? ' · <span class="is-over">' + overCount + " at or over " + esc(money(thr)) + "</span>" : "") + "</p>" +
            '<div class="strip" role="img" aria-label="' + esc("Daily spending in " + MO_LONG[m] + ". Highest day: " + (peak + 1) + " " + MO[m] + ", " + money(max) + ".") + '">' + bars + "</div>" +
            '<div class="strip-axis"><span>1 ' + MO[m] + "</span><span>" + days + " " + MO[m] + "</span></div>" +
            '<ul class="mini-list" aria-label="Largest payments">' + largest.map((x) =>
                '<li><span><span>' + esc(x.title) + '</span><span class="when">' + esc(fmtDay(x.w.day)) + "</span></span>" +
                '<span class="amt' + (x.amount >= thr ? " is-over" : "") + '">' + esc(money(x.amount)) +
                (x.amount >= thr ? '<span class="sr-only"> (at or over threshold)</span>' : "") + "</span></li>").join("") + "</ul>";
    }

    /* ---------- Notes ---------- */
    function renderNotes() {
        const el = $("notes");
        if (!state.loaded || state.error) { el.innerHTML = ""; return; }
        if (!state.notes.length) {
            el.innerHTML = '<p class="empty" style="padding-top:4px">No notes yet. Use <strong style="display:inline">Quick note</strong> in the corner to jot one down from any screen.</p>';
            return;
        }
        el.innerHTML = state.notes.slice(0, 3).map((n) =>
            '<div class="note-mini"><p>' + esc(n.content) + "</p><small>" + esc(timeAgo(n.createdAt)) + "</small></div>").join("");
    }

    function renderAll() { renderHeader(new Date()); renderBoard(); renderSpend(); renderNotes(); }

    /* ---------- Load ---------- */
    async function load() {
        const [t, e, x, n] = await Promise.allSettled([api("/tasks"), api("/events"), api("/expenses"), api("/notes")]);
        const failed = [t, e, x, n].find((r) => r.status === "rejected");
        state.error = failed ? failed.reason.message : null;
        if (t.status === "fulfilled") state.tasks = t.value;
        if (e.status === "fulfilled") state.events = e.value;
        if (x.status === "fulfilled") state.expenses = x.value;
        if (n.status === "fulfilled") state.notes = n.value;
        state.loaded = true;
        renderAll();
    }

    /* ---------- Board interactions ---------- */
    $("board").addEventListener("click", async (ev) => {
        const btn = ev.target.closest("[data-toggle]");
        if (!btn) return;
        const task = state.tasks.find((t) => t._id === btn.dataset.toggle);
        if (!task) return;
        task.completed = !task.completed;
        renderBoard();
        try {
            await api("/tasks/" + task._id, { method: "PUT", body: { completed: task.completed } });
        } catch (err) {
            task.completed = !task.completed;
            renderBoard();
            toastError(err);
        }
    });

    /* ---------- Quick add ---------- */
    const form = $("addbar");
    const kindOf = () => form.querySelector("input[name=kind]:checked").value;
    const PLACEHOLDER = { task: "Add a task…", event: "Add an event…", spend: "What did you pay for?" };
    const SUBMIT = { task: "Add task", event: "Add event", spend: "Log expense" };

    function syncKind() {
        const k = kindOf();
        $("qaTitle").placeholder = PLACEHOLDER[k];
        $("qaTimeField").hidden = k === "spend";
        $("qaAmountField").hidden = k !== "spend";
        $("qaSubmit").innerHTML = icon("plus") + SUBMIT[k];
        $("qaError").textContent = "";
        $("qaTitle").removeAttribute("aria-invalid");
        $("qaAmount").removeAttribute("aria-invalid");
    }
    form.querySelectorAll("input[name=kind]").forEach((r) => r.addEventListener("change", () => { syncKind(); $("qaTitle").focus(); }));
    $("qaDate").value = ymd(new Date());
    syncKind();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const k = kindOf();
        const title = $("qaTitle").value.trim();
        const date = $("qaDate").value || ymd(new Date());
        const err = $("qaError");
        if (!title) {
            err.textContent = k === "spend" ? "Say what the payment was for." : "Give it a title first.";
            $("qaTitle").setAttribute("aria-invalid", "true");
            $("qaTitle").focus();
            return;
        }
        const amount = parseFloat($("qaAmount").value);
        if (k === "spend" && !(amount > 0)) {
            err.textContent = "Enter an amount above ₹0.";
            $("qaAmount").setAttribute("aria-invalid", "true");
            $("qaAmount").focus();
            return;
        }
        err.textContent = "";
        $("qaTitle").removeAttribute("aria-invalid");
        $("qaAmount").removeAttribute("aria-invalid");

        busy($("qaSubmit"), async () => {
            try {
                const at = toPayload(date, k === "spend" ? "" : $("qaTime").value);
                let created;
                if (k === "task") { created = await api("/tasks", { method: "POST", body: { title, dueDate: at } }); state.tasks.unshift(created); }
                else if (k === "event") { created = await api("/events", { method: "POST", body: { title, date: at } }); state.events.push(created); }
                else { created = await api("/expenses", { method: "POST", body: { title, amount, date: at } }); state.expenses.unshift(created); }
                state.fresh = created._id;
                $("qaTitle").value = "";
                $("qaTime").value = "";
                $("qaAmount").value = "";
                renderAll();
                const day = S.parseYmd(date);
                const ahead = daysBetween(new Date(), day);
                if (ahead > 7 || ahead < 0) toast("Added for " + fmtDayLong(day) + ". It's in the calendar.");
                $("qaTitle").focus();
            } catch (e2) {
                err.textContent = e2.message;
            }
        });
    });

    document.addEventListener("note:created", (e) => { state.notes.unshift(e.detail); renderNotes(); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && state.loaded) load(); });

    everyMinute(() => { renderHeader(new Date()); renderBoard(); });
    load();
})();
