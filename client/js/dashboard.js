/* Today: a greeting with the day's one fact, the day line, and the panels around it. */
(function () {
    "use strict";
    const { api, esc, when, sameDay, startOfDay, addDays, daysBetween, fmtTime, fmtDay, fmtDayLong, MO_LONG, MO, WD,
        relSoon, relDay, timeAgo, money, threshold, icon, LEAD, checkBtn, toPayload, ymd, toast, toastError, busy, everyMinute, user, navTasks } = window.S;

    const state = { tasks: [], events: [], expenses: [], notes: [], loaded: false, error: null, fresh: null };
    const $ = (id) => document.getElementById(id);
    const WEEK_LIMIT = 6;
    const plural = (n, word) => n + " " + word + (n === 1 ? "" : "s");
    const minsOf = (d) => d.getHours() * 60 + d.getMinutes();

    /* ---------- Today's rows ---------- */
    function collect(now) {
        const today = startOfDay(now);
        const overdue = [], timed = [], anytime = [], spend = [];
        state.tasks.forEach((t) => {
            const w = when(t.dueDate);
            if (!w) return;
            const row = { kind: "task", id: t._id, title: t.title, w, done: !!t.completed };
            if (w.day < today) { if (!t.completed) overdue.push(row); }
            else if (sameDay(w.day, today)) (w.at ? timed : anytime).push(row);
        });
        state.events.forEach((e) => {
            const w = when(e.date);
            if (w && sameDay(w.day, today)) (w.at ? timed : anytime).push({ kind: "event", id: e._id, title: e.title, w });
        });
        state.expenses.forEach((x) => {
            const w = when(x.date);
            if (w && sameDay(w.day, today)) spend.push({ kind: "spend", id: x._id, title: x.title, w, amount: x.amount });
        });
        overdue.sort((a, b) => a.w.day - b.w.day);
        timed.sort((a, b) => a.w.at - b.w.at);
        anytime.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "event" ? -1 : 1) || (a.done - b.done));
        const next = timed.find((r) => r.w.at >= now && !r.done) || null;
        return { overdue, timed, anytime, spend, next };
    }

    function rowHtml(r, now, opts = {}) {
        const thr = threshold();
        const cls = ["item"];
        if (r.done) cls.push("done");
        if (r.w.at && r.w.at < now && !r.done && r.kind !== "spend") cls.push("is-past");
        if (state.fresh === r.id) cls.push("fresh");

        let lead, sub, end;
        if (r.kind === "task") {
            lead = checkBtn(r, opts.overdue);
            sub = r.done ? "Done" : opts.overdue ? "Overdue · due " + relDay(r.w.day, now) : r.w.at ? "Due " + relSoon(r.w.at, now) : "Any time today";
            end = opts.overdue ? '<span class="time-pill is-overdue">' + esc(r.w.day.getDate() + " " + MO[r.w.day.getMonth()]) + "</span>"
                : r.w.at ? '<span class="time-pill' + (opts.next ? " is-next" : "") + '">' + fmtTime(r.w.at) + "</span>" : "";
        } else if (r.kind === "event") {
            lead = LEAD.event;
            sub = r.w.at ? (r.w.at < now ? "Earlier today" : relSoon(r.w.at, now)) : "All day";
            end = r.w.at ? '<span class="time-pill' + (opts.next ? " is-next" : "") + '">' + fmtTime(r.w.at) + "</span>" : '<span class="time-pill">All day</span>';
        } else {
            const over = r.amount >= thr;
            lead = LEAD.spend;
            sub = over ? "Payment · at or over your " + money(thr) + " limit" : "Payment";
            end = '<span class="amt' + (over ? " is-over" : "") + '">' + esc(money(r.amount)) + "</span>";
        }
        return '<li class="' + cls.join(" ") + '">' + lead +
            '<span class="item-main"><span class="item-title">' + esc(r.title) + '</span><span class="item-sub' + (opts.overdue ? " is-overdue" : "") + '">' + esc(sub) + "</span></span>" +
            '<span class="item-end">' + end + "</span></li>";
    }

    function renderBoard() {
        const board = $("board");
        if (!state.loaded) return;
        if (state.error) {
            board.innerHTML = '<div class="callout">' + icon("alert") + "<div><strong>Today couldn't load.</strong>" + esc(state.error) +
                '<div><button class="btn btn-sm" type="button" data-retry>Try again</button></div></div></div>';
            board.querySelector("[data-retry]").addEventListener("click", load);
            $("dayline").innerHTML = "";
            return;
        }
        const now = new Date();
        const g = collect(now);
        const tasksToday = [...g.timed, ...g.anytime].filter((r) => r.kind === "task");
        const open = tasksToday.filter((r) => !r.done).length;
        const done = tasksToday.length - open;
        $("todayMeta").textContent = tasksToday.length ? open + " to go · " + done + " done" : "";
        renderDayline(g, now);

        let html = "";
        if (g.overdue.length) {
            html += '<h3 class="group-head is-overdue">Overdue <span class="chip is-overdue">' + g.overdue.length + "</span></h3>";
            html += '<ul class="list">' + g.overdue.map((r) => rowHtml(r, now, { overdue: true })).join("") + "</ul>";
        }
        const todays = [...g.timed, ...g.anytime, ...g.spend];
        if (todays.length) {
            if (g.overdue.length) html += '<h3 class="group-head">Today</h3>';
            html += '<ul class="list">' + todays.map((r) => rowHtml(r, now, { next: g.next && r.id === g.next.id })).join("") + "</ul>";
        } else {
            html += '<div class="empty"' + (g.overdue.length ? ' style="margin-top:12px"' : "") + "><strong>Nothing planned for today.</strong>Add a task, event or payment on the right, or plan ahead in the <a href=\"calendar.html\">calendar</a>.</div>";
        }
        const undated = state.tasks.filter((t) => !t.dueDate && !t.completed).length;
        if (undated) html += '<p class="more-row"><a href="tasks.html">' + plural(undated, "open task") + " without a date</a></p>";
        board.innerHTML = html;
        state.fresh = null;
    }

    /* ---------- The day line ---------- */
    function renderDayline(g, now) {
        const el = $("dayline");
        const timed = g.timed;
        const earliest = timed.length ? Math.floor(minsOf(timed[0].w.at) / 60) : 24;
        const start = Math.min(6, earliest) * 60;
        const end = 24 * 60;
        const pct = (m) => Math.max(0, Math.min(100, ((m - start) / (end - start)) * 100));
        const nowPct = pct(minsOf(now));

        const narrow = el.clientWidth && el.clientWidth < 560;
        const step = narrow ? 6 : 3;
        el.classList.toggle("compact", !!narrow);
        let track = '<div class="dl-past" style="width:' + nowPct.toFixed(2) + '%"></div>';
        for (let h = start / 60 + 3; h < 24; h += 3) track += '<i class="dl-hour" style="left:' + pct(h * 60).toFixed(2) + '%"></i>';
        const evLefts = timed.filter((r) => r.kind === "event").map((r) => pct(minsOf(r.w.at)));
        timed.forEach((r) => {
            const left = pct(minsOf(r.w.at)).toFixed(2);
            // An event pill may run only as far as the next event (or the track's end).
            const nextLeft = evLefts.find((p) => p > Number(left) + 0.01);
            const room = (nextLeft !== undefined ? nextLeft : 100) - Number(left);
            const tip = esc(fmtTime(r.w.at) + " · " + r.title + (r.done ? " (done)" : ""));
            if (r.kind === "event") {
                track += '<span class="dl-ev' + (r.w.at < now ? " is-past" : "") + '" style="left:' + left + "%;max-width:min(calc(" + room.toFixed(2) + '% - 4px), 34%)" title="' + tip + '">' + esc(r.title) + "</span>";
            } else {
                track += '<span class="dl-task' + (r.done ? " done" : "") + '" style="left:' + left + '%" title="' + tip + '"></span>';
            }
        });
        track += '<span class="dl-now" style="left:' + nowPct.toFixed(2) + '%"></span>';

        let axis = "";
        for (let h = start / 60; h <= 24; h += step) {
            const p = pct(h * 60);
            if (Math.abs(p - nowPct) < (narrow ? 12 : 8)) continue;
            axis += '<span class="' + (h === start / 60 ? "first" : h === 24 ? "last" : "") + '" style="left:' + p.toFixed(2) + '%">' + (h === 24 ? "24:00" : String(h).padStart(2, "0") + ":00") + "</span>";
        }
        axis += '<span class="now-label' + (nowPct < 4 ? " first" : nowPct > 96 ? " last" : "") + '" style="left:' + nowPct.toFixed(2) + '%">' + fmtTime(now) + "</span>";

        const thr = threshold();
        const spent = g.spend.reduce((a, x) => a + x.amount, 0);
        const over = g.spend.some((x) => x.amount >= thr);
        const summary = "Today from " + String(start / 60).padStart(2, "0") + ":00 to midnight. " +
            (timed.length ? timed.map((r) => r.title + " at " + fmtTime(r.w.at)).join(", ") + ". " : "Nothing timed. ") +
            "Now " + fmtTime(now) + "." + (spent ? " " + money(spent) + " spent today." : "");

        el.innerHTML =
            '<div class="dl-track" role="img" aria-label="' + esc(summary) + '">' + track + "</div>" +
            '<div class="dl-axis" aria-hidden="true">' + axis + "</div>" +
            '<div class="dl-legend" aria-hidden="true"><span><i></i>Event</span><span><i class="ring"></i>Task with a time</span>' +
            (spent ? '<b class="' + (over ? "is-over" : "") + '">' + esc(money(spent)) + " spent today</b>" : "<b>No spending today</b>") + "</div>";
    }

    /* ---------- Greeting + tiles ---------- */
    function renderHeader(now) {
        const h = now.getHours();
        const part = h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
        const u = user();
        $("greeting").textContent = part + (u && u.name ? ", " + u.name.trim().split(/\s+/)[0] : "") + ".";
        document.title = "Today, " + fmtDay(now) + " · Syncrona";

        let fact = "";
        if (state.loaded && !state.error) {
            const g = collect(now);
            const left = [...g.timed, ...g.anytime].filter((r) => r.kind === "task" && !r.done).length;
            if (g.overdue.length) fact = "<strong>" + plural(g.overdue.length, "task") + " overdue</strong>" + (g.next ? ", and " + esc(g.next.title) + " at " + fmtTime(g.next.w.at) : "") + ".";
            else if (g.next) fact = "Next up, <strong>" + esc(g.next.title) + "</strong> at " + fmtTime(g.next.w.at) + (left > 1 ? ", with " + plural(left, "task") + " left today" : "") + ".";
            else if (left) fact = "<strong>" + plural(left, "task") + " left</strong> for today.";
            else fact = "Nothing else planned for today.";
        }
        $("dateLine").innerHTML = esc(fmtDayLong(now)) + (fact ? " · " + fact : "");
    }

    function renderTiles(now) {
        if (!state.loaded || state.error) return;
        const g = collect(now);
        const set = (k, v, cap) => { document.querySelector('[data-tile="' + k + '"]').textContent = v; document.querySelector('[data-cap="' + k + '"]').innerHTML = cap; };

        const tasksToday = [...g.timed, ...g.anytime].filter((r) => r.kind === "task");
        const open = tasksToday.filter((r) => !r.done).length;
        const done = tasksToday.length - open;
        set("due", open, g.overdue.length ? '<span class="is-overdue">' + plural(g.overdue.length, "overdue task") + "</span>"
            : tasksToday.length ? (done ? done + " done so far" : "None done yet") : "Nothing due");

        const events = [...g.timed, ...g.anytime].filter((r) => r.kind === "event");
        const nextEv = events.find((r) => r.w.at && r.w.at >= now);
        set("events", events.length, nextEv ? "Next: " + esc(nextEv.title) + ", " + fmtTime(nextEv.w.at) : events.length ? "No more today" : "Nothing scheduled");

        const y = now.getFullYear(), m = now.getMonth(), thr = threshold();
        const month = state.expenses.filter((x) => { const w = when(x.date); return w && w.day.getFullYear() === y && w.day.getMonth() === m; });
        const total = month.reduce((a, x) => a + x.amount, 0);
        const over = month.filter((x) => x.amount >= thr).length;
        document.querySelector('[data-label="spent"]').textContent = "Spent in " + MO_LONG[m];
        set("spent", money(total), month.length ? plural(month.length, "payment") + (over ? ' · <span class="is-overdue">' + over + " over limit</span>" : "") : "No payments yet");

        set("notes", state.notes.length, state.notes.length ? "Latest " + esc(timeAgo(state.notes[0].createdAt)) : "None yet");
    }

    /* ---------- Next 7 days ---------- */
    function renderWeek(now) {
        const el = $("week");
        if (!state.loaded || state.error) { el.innerHTML = ""; return; }
        const today = startOfDay(now);
        const rows = [];
        state.tasks.forEach((t) => {
            const w = when(t.dueDate);
            if (w && !t.completed) { const n = daysBetween(today, w.day); if (n >= 1 && n <= 7) rows.push({ kind: "task", id: t._id, title: t.title, w, done: false }); }
        });
        state.events.forEach((e) => {
            const w = when(e.date);
            if (w) { const n = daysBetween(today, w.day); if (n >= 1 && n <= 7) rows.push({ kind: "event", id: e._id, title: e.title, w }); }
        });
        rows.sort((a, b) => (a.w.day - b.w.day) || ((a.w.at ? minsOf(a.w.at) : -1) - (b.w.at ? minsOf(b.w.at) : -1)));
        if (!rows.length) {
            el.innerHTML = '<div class="empty"><strong>A quiet week ahead.</strong>Nothing is planned for the next 7 days.</div>';
            return;
        }
        let html = "", lastDay = null, shown = 0;
        for (const r of rows) {
            if (shown === WEEK_LIMIT) break;
            if (!lastDay || !sameDay(lastDay, r.w.day)) {
                if (lastDay) html += "</ul>";
                const n = daysBetween(today, r.w.day);
                html += '<h3 class="group-head">' + (n === 1 ? "Tomorrow" : esc(S.WD_LONG[r.w.day.getDay()])) + ' <span style="font-weight:500">' + esc(r.w.day.getDate() + " " + MO[r.w.day.getMonth()]) + '</span></h3><ul class="list">';
                lastDay = r.w.day;
            }
            const lead = r.kind === "task" ? checkBtn(r) : LEAD.event;
            html += '<li class="item' + (state.fresh === r.id ? " fresh" : "") + '">' + lead + '<span class="item-main"><span class="item-title">' + esc(r.title) + "</span></span>" +
                '<span class="item-end">' + (r.w.at ? '<span class="time-pill">' + fmtTime(r.w.at) + "</span>" : '<span class="muted">' + (r.kind === "event" ? "All day" : "Any time") + "</span>") + "</span></li>";
            shown++;
        }
        html += "</ul>";
        if (rows.length > WEEK_LIMIT) html += '<p class="more-row"><a href="calendar.html">' + (rows.length - WEEK_LIMIT) + " more in the calendar</a></p>";
        el.innerHTML = html;
    }

    /* ---------- Spending ---------- */
    function renderSpend(now) {
        const el = $("spend");
        if (!state.loaded || state.error) { el.innerHTML = ""; return; }
        const y = now.getFullYear(), m = now.getMonth();
        $("spendHead").textContent = "Spending in " + MO_LONG[m];
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
            el.innerHTML = '<div class="empty"><strong>No payments in ' + MO_LONG[m] + ' yet.</strong>Choose Expense in Add to log one. Anything at or over ' + esc(money(thr)) + " is flagged in red.</div>";
            return;
        }
        // Only the days so far (at least a week), so the bars have room.
        const shownDays = Math.max(7, now.getDate());
        const max = Math.max(...perDay);
        const peak = perDay.indexOf(max);
        // Square-root scale against the second-largest day when one day dwarfs the rest;
        // that day is drawn clipped with its value written above.
        const sorted = perDay.filter((v) => v > 0).sort((a, b) => b - a);
        const top = sorted.length > 1 && sorted[0] > 3 * sorted[1] ? sorted[1] * 1.6 : (sorted[0] || 1);
        const barH = (v) => (v ? Math.min(100, Math.max(8, Math.sqrt(v / top) * 100)) : 3);
        const bars = perDay.slice(0, shownDays).map((v, i) => {
            const future = i + 1 > now.getDate();
            const cls = future ? "future" : v === 0 ? "zero" : overDay[i] ? "over" : "";
            const clipped = v > top;
            return '<i class="' + cls + (clipped ? " clipped" : "") + (i + 1 === now.getDate() ? " today" : "") + '"' + (clipped ? ' data-v="' + esc(money(v)) + '"' : "") + ' style="height:' + barH(v).toFixed(1) + '%" title="' + esc((i + 1) + " " + MO[m] + ": " + money(v)) + '"></i>';
        }).join("");
        const largest = items.slice().sort((a, b) => b.amount - a.amount).slice(0, 3);
        el.innerHTML =
            '<div class="inset" style="padding-top:26px"><div class="bars" style="margin-top:0" role="img" aria-label="' + esc("Daily spending in " + MO_LONG[m] + ". Highest day " + (peak + 1) + " " + MO[m] + ", " + money(max) + ".") + '">' + bars + "</div>" +
            '<div class="bars-axis" aria-hidden="true"><span>1 ' + MO[m] + "</span><span>" + (shownDays === now.getDate() ? "Today" : shownDays + " " + MO[m]) + "</span></div></div>" +
            '<h3 class="group-head" style="margin-top:18px">Largest payments' + (overCount ? '<span class="sum is-over">' + overCount + " at or over " + esc(money(thr)) + "</span>" : "") + '</h3><ul class="mini" style="margin-top:0" aria-label="Largest payments">' + largest.map((x) =>
                '<li><span class="t"><b>' + esc(x.title) + "</b><span>" + esc(fmtDay(x.w.day)) + "</span></span>" +
                '<span class="amt' + (x.amount >= thr ? " is-over" : "") + '">' + esc(money(x.amount)) + (x.amount >= thr ? '<span class="sr-only"> (at or over your limit)</span>' : "") + "</span></li>").join("") + "</ul>";
    }

    /* ---------- Notes ---------- */
    function renderNotes() {
        const el = $("notes");
        if (!state.loaded || state.error) { el.innerHTML = ""; return; }
        if (!state.notes.length) {
            el.innerHTML = '<div class="empty"><strong>No notes yet.</strong>Use Quick note in the corner to jot one down from any screen.</div>';
            return;
        }
        el.innerHTML = state.notes.slice(0, 4).map((n) =>
            '<div class="note-mini"><p>' + esc(n.content) + "</p><small>" + esc(timeAgo(n.createdAt)) + "</small></div>").join("");
    }

    function renderAll() {
        const now = new Date();
        renderHeader(now); renderTiles(now); renderBoard(); renderWeek(now); renderSpend(now); renderNotes();
        navTasks(state.tasks);
    }

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

    /* ---------- Ticking tasks (Today and the week) ---------- */
    document.querySelector(".page").addEventListener("click", async (ev) => {
        const btn = ev.target.closest("[data-toggle]");
        if (!btn) return;
        const task = state.tasks.find((t) => t._id === btn.dataset.toggle);
        if (!task) return;
        task.completed = !task.completed;
        renderAll();
        try {
            await api("/tasks/" + task._id, { method: "PUT", body: { completed: task.completed } });
        } catch (err) {
            task.completed = !task.completed;
            renderAll();
            toastError(err);
        }
    });

    /* ---------- Add ---------- */
    const form = $("addbar");
    const kindOf = () => form.querySelector("input[name=kind]:checked").value;
    const PLACEHOLDER = { task: "Add a task", event: "Add an event", spend: "What did you pay for?" };
    const SUBMIT = { task: "Add task", event: "Add event", spend: "Log payment" };

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
                S.syncEmpty();
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

    document.addEventListener("note:created", (e) => { state.notes.unshift(e.detail); renderNotes(); renderTiles(new Date()); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && state.loaded) load(); });

    everyMinute(() => { if (state.loaded) renderAll(); else renderHeader(new Date()); });
    load();
})();
