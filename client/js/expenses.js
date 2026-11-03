/* Expenses: one month at a time, grouped by day. */
(function () {
    "use strict";
    const { api, esc, when, sameDay, startOfDay, fmtDay, MO_LONG, money, threshold, icon, ymd, toastError, busy, undoable } = window.S;

    const $ = (id) => document.getElementById(id);
    const now = new Date();
    const state = { expenses: [], loaded: false, error: null, month: new Date(now.getFullYear(), now.getMonth(), 1), fresh: null };

    const inMonth = (x, m) => { const w = when(x.date); return w && w.day.getFullYear() === m.getFullYear() && w.day.getMonth() === m.getMonth(); };
    const sum = (arr) => arr.reduce((a, x) => a + x.amount, 0);

    function render() {
        const m = state.month;
        const isCurrent = m.getFullYear() === now.getFullYear() && m.getMonth() === now.getMonth();
        $("monthLabel").textContent = MO_LONG[m.getMonth()] + " " + m.getFullYear();
        $("nextMonth").disabled = isCurrent;
        if (!state.loaded) return;

        if (state.error) {
            $("summary").innerHTML = "";
            $("list").innerHTML = '<div class="callout">' + icon("alert") + "<div><strong>Expenses couldn't load.</strong>" + esc(state.error) + "</div></div>";
            return;
        }

        const thr = threshold();
        const items = state.expenses.filter((x) => inMonth(x, m));
        const prevM = new Date(m.getFullYear(), m.getMonth() - 1, 1);
        const prev = sum(state.expenses.filter((x) => inMonth(x, prevM)));
        const total = sum(items);
        const over = items.filter((x) => x.amount >= thr).length;
        const all = sum(state.expenses);

        $("allTime").textContent = state.expenses.length
            ? "All time: " + money(Math.round(all)) + " across " + state.expenses.length + " payment" + (state.expenses.length > 1 ? "s" : "")
            : "Log what you spend and see it by month and on the calendar.";

        let delta = "";
        if (prev) {
            const diff = total - prev;
            const pct = Math.round((Math.abs(diff) / prev) * 100);
            delta = '<div>vs ' + esc(MO_LONG[prevM.getMonth()]) + '<b class="' + (diff > 0 ? "delta-up" : diff < 0 ? "delta-down" : "") + '">' +
                (diff === 0 ? "Same" : (diff > 0 ? "+" : "−") + esc(money(Math.abs(diff))) + " (" + pct + "%)") + "</b></div>";
        }
        $("summary").innerHTML =
            '<div><div class="section-title">Spent in ' + esc(MO_LONG[m.getMonth()]) + '</div><div class="spend-total">' + esc(money(total)) + "</div></div>" +
            '<div class="money-facts">' +
            "<div>Payments<b>" + items.length + "</b></div>" +
            "<div>At or over " + esc(money(thr)) + '<b class="' + (over ? "delta-up" : "") + '">' + over + "</b></div>" +
            (items.length ? "<div>Largest<b>" + esc(money(Math.max(...items.map((x) => x.amount)))) + "</b></div>" : "") +
            delta + "</div>";

        $("listHead").textContent = "Payments in " + MO_LONG[m.getMonth()];
        $("listMeta").innerHTML = '<a href="settings.html">Change threshold</a>';

        if (!items.length) {
            $("list").innerHTML = '<div class="empty"><strong>No payments in ' + esc(MO_LONG[m.getMonth()]) + ".</strong>" +
                (isCurrent ? "Log one above. Anything at or over " + esc(money(thr)) + " is marked red here, on Today and in the calendar." : "Pick another month, or add a past payment with its date above.") + "</div>";
            return;
        }

        const byDay = new Map();
        items.map((x) => ({ ...x, w: when(x.date) }))
            .sort((a, b) => b.w.day - a.w.day || new Date(b.createdAt) - new Date(a.createdAt))
            .forEach((x) => {
                const k = ymd(x.w.day);
                if (!byDay.has(k)) byDay.set(k, []);
                byDay.get(k).push(x);
            });

        let html = '<table class="timetable"><thead><tr><th scope="col">Item</th><th scope="col" style="text-align:right">Amount</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>';
        byDay.forEach((list, k) => {
            const d = S.parseYmd(k);
            const label = sameDay(d, startOfDay(now)) ? "Today · " + fmtDay(d) : fmtDay(d);
            html += '<tr class="day-row"><td class="d">' + esc(label) + '</td><td class="s">' + esc(money(sum(list))) + "</td><td></td></tr>";
            list.forEach((x) => {
                const isOver = x.amount >= thr;
                html += '<tr class="k-spend' + (state.fresh === x._id ? " fresh" : "") + '">' +
                    '<td class="tt-item"><span class="title">' + esc(x.title) + "</span></td>" +
                    '<td class="tt-status"><span class="tt-status-inner">' + (isOver ? '<span class="over-mark" title="At or over your ' + esc(money(thr)) + ' threshold"></span>' : "") +
                    '<span class="tt-amount' + (isOver ? " is-over" : "") + '">' + esc(money(x.amount)) + (isOver ? '<span class="sr-only"> (at or over threshold)</span>' : "") + "</span></span></td>" +
                    '<td class="tt-act"><span class="row-actions"><button class="icon-btn danger" type="button" data-delete="' + esc(x._id) + '" aria-label="' + esc("Delete " + x.title) + '">' + icon("trash") + "</button></span></td></tr>";
            });
        });
        $("list").innerHTML = html + "</tbody></table>";
        state.fresh = null;
    }

    async function load() {
        try { state.expenses = await api("/expenses"); state.error = null; }
        catch (e) { state.error = e.message; }
        state.loaded = true;
        render();
    }

    $("prevMonth").innerHTML = icon("left");
    $("nextMonth").innerHTML = icon("right");
    $("prevMonth").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); render(); });
    $("nextMonth").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); render(); });

    $("list").addEventListener("click", (e) => {
        const del = e.target.closest("[data-delete]");
        if (!del) return;
        const i = state.expenses.findIndex((x) => x._id === del.dataset.delete);
        if (i < 0) return;
        const x = state.expenses[i];
        undoable({
            message: "Deleted " + money(x.amount) + " · " + (x.title.length > 30 ? x.title.slice(0, 30) + "…" : x.title),
            path: "/expenses/" + x._id,
            apply: () => { state.expenses.splice(i, 1); render(); },
            revert: () => { state.expenses.splice(Math.min(i, state.expenses.length), 0, x); render(); }
        });
    });

    $("exDate").value = ymd(now);
    $("exSubmit").innerHTML = icon("plus") + "Log expense";
    $("addExpense").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $("exTitle").value.trim();
        const amount = parseFloat($("exAmount").value);
        const date = $("exDate").value || ymd(new Date());
        const err = $("exError");
        if (!title) { err.textContent = "Say what the payment was for."; $("exTitle").setAttribute("aria-invalid", "true"); $("exTitle").focus(); return; }
        if (!(amount > 0)) { err.textContent = "Enter an amount above ₹0."; $("exAmount").setAttribute("aria-invalid", "true"); $("exAmount").focus(); return; }
        err.textContent = "";
        $("exTitle").removeAttribute("aria-invalid");
        $("exAmount").removeAttribute("aria-invalid");
        busy($("exSubmit"), async () => {
            try {
                const created = await api("/expenses", { method: "POST", body: { title, amount, date } });
                state.expenses.unshift(created);
                state.fresh = created._id;
                const d = S.parseYmd(date);
                state.month = new Date(d.getFullYear(), d.getMonth(), 1);
                $("exTitle").value = "";
                $("exAmount").value = "";
                render();
                $("exTitle").focus();
            } catch (er) { err.textContent = er.message; }
        });
    });

    render();
    load();
})();
