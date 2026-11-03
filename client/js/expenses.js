/* Expenses: one month at a time, day by day. */
(function () {
    "use strict";
    const { api, esc, when, sameDay, startOfDay, fmtDay, MO_LONG, money, threshold, icon, LEAD, ymd, toastError, busy, undoable } = window.S;

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

        const tile = (i, value, cap, cls) => {
            const t = $("summary").children[i];
            t.querySelector(".tile-value").textContent = value;
            t.querySelector(".tile-value").className = "tile-value" + (cls ? " " + cls : "");
            t.querySelector(".tile-cap").innerHTML = cap;
        };
        $("summary").children[0].querySelector(".tile-label").textContent = "Spent in " + MO_LONG[m.getMonth()];
        tile(0, money(total), items.length ? "Across " + new Set(items.map((x) => ymd(when(x.date).day))).size + " days" : "Nothing logged");
        tile(1, items.length, items.length ? "Largest " + esc(money(Math.max(...items.map((x) => x.amount)))) : "&nbsp;");
        tile(2, over, 'Your limit is <a href="settings.html">' + esc(money(thr)) + "</a>", over ? "is-over" : "");
        if (prev) {
            const diff = total - prev;
            const pct = Math.round((Math.abs(diff) / prev) * 100);
            tile(3, diff === 0 ? "Same" : (diff > 0 ? "+" : "−") + money(Math.abs(diff)), (diff === 0 ? "Level with " : pct + "% " + (diff > 0 ? "more than " : "less than ")) + esc(MO_LONG[prevM.getMonth()]), diff > 0 ? "delta-up" : diff < 0 ? "delta-down" : "");
        } else {
            tile(3, "–", "Nothing logged in " + esc(MO_LONG[prevM.getMonth()]));
        }

        renderChart(m, items, thr, isCurrent);
        $("listHead").textContent = "Payments in " + MO_LONG[m.getMonth()];
        $("listMeta").textContent = items.length ? items.length + " payment" + (items.length > 1 ? "s" : "") : "";

        if (!items.length) {
            $("list").innerHTML = '<div class="empty"><strong>No payments in ' + esc(MO_LONG[m.getMonth()]) + ".</strong>" +
                (isCurrent ? "Log one with the form above. Anything at or over " + esc(money(thr)) + " is flagged in red here, on Today and in the calendar." : "Pick another month, or log a past payment with its date.") + "</div>";
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

        let html = "";
        byDay.forEach((list, k) => {
            const d = S.parseYmd(k);
            const label = sameDay(d, startOfDay(now)) ? "Today · " + fmtDay(d) : fmtDay(d);
            html += '<h3 class="group-head">' + esc(label) + '<span class="sum">' + esc(money(sum(list))) + "</span></h3><ul class=\"list\">";
            list.forEach((x) => {
                const isOver = x.amount >= thr;
                html += '<li class="item' + (state.fresh === x._id ? " fresh" : "") + '">' + LEAD.spend +
                    '<span class="item-main"><span class="item-title">' + esc(x.title) + "</span>" + (isOver ? '<span class="item-sub is-over">At or over your ' + esc(money(thr)) + " limit</span>" : "") + "</span>" +
                    '<span class="item-end"><span class="amt' + (isOver ? " is-over" : "") + '">' + esc(money(x.amount)) + "</span></span>" +
                    '<span class="item-actions"><button class="icon-btn danger" type="button" data-delete="' + esc(x._id) + '" aria-label="' + esc("Delete " + x.title) + '">' + icon("trash") + "</button></span></li>";
            });
            html += "</ul>";
        });
        $("list").innerHTML = html;
        state.fresh = null;
    }

    function renderChart(m, items, thr, isCurrent) {
        const y = m.getFullYear(), mo = m.getMonth();
        const days = new Date(y, mo + 1, 0).getDate();
        const perDay = new Array(days).fill(0);
        const overDay = new Array(days).fill(false);
        items.forEach((x) => { const i = when(x.date).day.getDate() - 1; perDay[i] += x.amount; if (x.amount >= thr) overDay[i] = true; });
        const max = Math.max(...perDay);
        const active = perDay.filter((v) => v > 0).length;
        $("chartMeta").textContent = max ? "Busiest day " + (perDay.indexOf(max) + 1) + " " + S.MO[mo] + ", " + money(max) : "";
        if (!items.length) {
            $("chart").innerHTML = '<div class="inset"><div class="bars" style="margin-top:0;height:120px" aria-hidden="true">' + perDay.map(() => '<i class="zero"></i>').join("") +
                '</div><div class="bars-axis"><span>1 ' + S.MO[mo] + "</span><span>" + days + " " + S.MO[mo] + "</span></div></div>";
            return;
        }
        const today = now.getDate();
        const shownDays = isCurrent ? Math.max(7, today) : days;
        // Square-root scale against the second-largest day when one day dwarfs the rest;
        // that day is drawn clipped with its value written above.
        const sorted = perDay.filter((v) => v > 0).sort((a, b) => b - a);
        const top = sorted.length > 1 && sorted[0] > 3 * sorted[1] ? sorted[1] * 1.6 : (sorted[0] || 1);
        const barH = (v) => (v ? Math.min(100, Math.max(8, Math.sqrt(v / top) * 100)) : 3);
        const bars = perDay.slice(0, shownDays).map((v, i) => {
            const future = isCurrent && i + 1 > today;
            const cls = future ? "future" : v === 0 ? "zero" : overDay[i] ? "over" : "";
            const clipped = v > top;
            return '<i class="' + cls + (clipped ? " clipped" : "") + (isCurrent && i + 1 === today ? " today" : "") + '"' + (clipped ? ' data-v="' + esc(money(v)) + '"' : "") + ' style="height:' + barH(v).toFixed(1) + '%" title="' + esc((i + 1) + " " + S.MO[mo] + ": " + money(v)) + '"></i>';
        }).join("");
        $("chart").innerHTML = '<div class="inset" style="padding-top:28px"><div class="bars" style="margin-top:0;height:150px" role="img" aria-label="' +
            esc("Spending per day in " + MO_LONG[mo] + ": " + active + " days with payments, highest " + money(max) + ".") + '">' + bars + "</div>" +
            '<div class="bars-axis" aria-hidden="true"><span>1 ' + S.MO[mo] + "</span><span>" + (isCurrent && shownDays === today ? "Today" : shownDays + " " + S.MO[mo]) + "</span></div></div>" +
            '<div class="dl-legend" style="margin-top:12px" aria-hidden="true"><span><i style="background:var(--accent);box-shadow:none"></i>Spent that day</span><span><i style="background:var(--red);box-shadow:none"></i>Includes a payment at or over ' + esc(money(thr)) + "</span></div>";
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
    $("exSubmit").innerHTML = icon("plus") + "Log payment";
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
