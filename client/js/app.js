/* Syncrona — shared runtime: API, auth, dates, money, palettes, shell,
   quick note, toasts. Loaded (deferred) before each page script. */
(function () {
    "use strict";

    const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
    // Local dev: API on :5000 unless overridden (macOS AirPlay also listens on 5000).
    // localStorage.apiBase = "http://localhost:5001" points elsewhere; "" means same origin.
    let apiOverride = null;
    try { apiOverride = localStorage.getItem("apiBase"); } catch (e) { /* ignore */ }
    const API_BASE = apiOverride !== null ? apiOverride : isLocal && location.port !== "5000" ? "http://localhost:5000" : "";

    /* ---------- Storage (never throws) ---------- */
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
        remove(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
        clear() { try { localStorage.clear(); } catch (e) { /* ignore */ } }
    };

    /* ---------- Escaping ---------- */
    const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ESC[c]);

    /* ---------- Auth ---------- */
    const token = () => store.get("token");
    function user() {
        try { return JSON.parse(store.get("user")) || null; } catch (e) { return null; }
    }
    function signOut(reason) {
        store.remove("token");
        store.remove("user");
        location.replace("login.html" + (reason ? "?" + reason : ""));
    }

    /* ---------- API ---------- */
    async function api(path, opts = {}) {
        const headers = { Authorization: "Bearer " + token() };
        if (opts.body !== undefined) headers["Content-Type"] = "application/json";
        let res;
        try {
            res = await fetch(API_BASE + "/api" + path, {
                method: opts.method || "GET",
                headers,
                body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
                cache: "no-store",
                keepalive: !!opts.keepalive
            });
        } catch (e) {
            const err = new Error("Can't reach the Syncrona server. Check your connection and try again.");
            err.offline = true;
            throw err;
        }
        if (res.status === 401) {
            signOut("expired");
            throw new Error("Your session has ended. Sign in again.");
        }
        let data = null;
        try { data = await res.json(); } catch (e) { /* empty body */ }
        if (!res.ok) {
            throw new Error((data && (data.msg || data.message || data.error)) || "Something went wrong (" + res.status + ").");
        }
        return data;
    }

    /* ---------- Dates ----------
       The API stores dates as JS Dates. Date-only values arrive as UTC
       midnight ("2026-11-03" -> 2026-11-03T00:00:00.000Z). Items with a time
       are sent as full local timestamps with 1ms set, so they can never be
       mistaken for a date-only value. */
    const pad = (n) => String(n).padStart(2, "0");
    const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    function parseYmd(s) {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m - 1, d);
    }
    function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
    function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
    function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }

    /* Returns { day: local midnight Date, at: Date | null } */
    function when(value) {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d)) return null;
        const dateOnly = d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0 && d.getUTCMilliseconds() === 0;
        if (dateOnly) return { day: new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), at: null };
        return { day: startOfDay(d), at: d };
    }

    function toPayload(dateStr, timeStr) {
        if (!dateStr) return null;
        if (!timeStr) return dateStr;
        const [y, m, d] = dateStr.split("-").map(Number);
        const [h, mi] = timeStr.split(":").map(Number);
        return new Date(y, m - 1, d, h, mi, 0, 1).toISOString();
    }

    const fmtTime = (d) => pad(d.getHours()) + ":" + pad(d.getMinutes());
    const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const WD_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const MO_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const fmtDay = (d) => WD[d.getDay()] + " " + d.getDate() + " " + MO[d.getMonth()];
    const fmtDayLong = (d) => WD_LONG[d.getDay()] + " " + d.getDate() + " " + MO_LONG[d.getMonth()];
    const fmtDate = (d) => d.getDate() + " " + MO[d.getMonth()] + " " + d.getFullYear();

    function relDay(day, now = new Date()) {
        const n = daysBetween(now, day);
        if (n === 0) return "today";
        if (n === 1) return "tomorrow";
        if (n === -1) return "yesterday";
        if (n > 1 && n < 7) return WD_LONG[day.getDay()];
        if (n < 0) return Math.abs(n) + " days ago";
        return "in " + n + " days";
    }

    function relTime(at, now = new Date()) {
        const mins = Math.round((at - now) / 60000);
        if (Math.abs(mins) < 1) return "now";
        const abs = Math.abs(mins);
        const h = Math.floor(abs / 60), m = abs % 60;
        const span = h ? h + " h" + (m ? " " + m + " min" : "") : m + " min";
        return mins > 0 ? "in " + span : span + " ago";
    }

    /* Relative time for nearby items: minutes and hours only when soon. */
    function relSoon(at, now = new Date()) {
        const mins = (at - now) / 60000;
        if (Math.abs(mins) < 360) return relTime(at, now);
        if (sameDay(at, now)) return mins > 0 ? "later today" : "earlier today";
        return relDay(startOfDay(at), now);
    }

    function timeAgo(value) {
        const d = new Date(value);
        const s = Math.floor((Date.now() - d) / 1000);
        if (s < 60) return "just now";
        if (s < 3600) return Math.floor(s / 60) + " min ago";
        if (s < 86400) return Math.floor(s / 3600) + " h ago";
        const days = Math.floor(s / 86400);
        if (days === 1) return "yesterday";
        if (days < 7) return days + " days ago";
        return fmtDate(d);
    }

    /* ---------- Money ---------- */
    const inr0 = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
    const inr2 = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const money = (n) => (Math.round(n * 100) % 100 === 0 ? inr0 : inr2).format(n || 0);
    function threshold() {
        const v = parseFloat(store.get("expenseThreshold"));
        return isFinite(v) && v > 0 ? v : 500;
    }

    /* ---------- Icons (24px grid, 1.75 stroke) ---------- */
    const P = {
        today: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        tasks: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
        calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        expenses: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10"/>',
        notes: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"/>',
        settings: '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
        logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
        plus: '<path d="M5 12h14M12 5v14"/>',
        left: '<path d="m15 18-6-6 6-6"/>',
        right: '<path d="m9 18 6-6-6-6"/>',
        trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
        x: '<path d="M18 6 6 18M6 6l12 12"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        pencil: '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5Z"/>',
        check: '<path d="M20 6 9 17l-5-5"/>',
        alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
        pen: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.38 2.62a1 1 0 0 1 3 3l-9.01 9.02a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86Z"/>',
        event: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2.5v3M16 2.5v3M3 9.5h18"/><circle cx="12" cy="15" r="1.6" fill="currentColor" stroke="none"/>',
        rupee: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10"/>'
    };
    function icon(name, extra) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (name === "check" ? 3 : 1.75) +
            '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra ? " " + extra : "") + ">" + P[name] + "</svg>";
    }
    // The mark: two arcs chasing round one day, drawn in the accent.
    const MARK = '<svg viewBox="0 0 26 26" fill="none" aria-hidden="true">' +
        '<path d="M4.6 15.2A8.6 8.6 0 0 1 19.4 7.4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>' +
        '<path d="M21.4 10.8A8.6 8.6 0 0 1 6.6 18.6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>' +
        '<circle cx="19.4" cy="7.4" r="2.3" fill="currentColor"/></svg>';

    /* ---------- Kind marks (the leading glyph on a row) ---------- */
    const LEAD = {
        event: '<span class="item-lead k-event" title="Event">' + icon("event") + '<span class="sr-only">Event: </span></span>',
        spend: '<span class="item-lead k-spend" title="Payment">' + icon("rupee") + '<span class="sr-only">Payment: </span></span>'
    };
    function checkBtn(t, overdue) {
        return '<button class="check' + (overdue ? " is-overdue" : "") + '" type="button" data-toggle="' + esc(t._id || t.id) + '" aria-pressed="' + !!(t.completed || t.done) +
            '" aria-label="' + esc(((t.completed || t.done) ? "Mark not done: " : "Mark done: ") + t.title) + '">' + icon("check") + "</button>";
    }

    /* ---------- Colour palettes ----------
       Each id matches a :root[data-palette] block in style.css; the first is
       the default and needs no attribute. `dots` are the palette's three
       defining colours for the Settings picker; `mark` and `ink` colour the
       favicon. */
    const PALETTES = [
        { id: "wine", name: "Wine", dots: ["#1b2a3d", "#ede3c8", "#5c1f2e"], mark: "#5c1f2e", ink: "#fff" },
        { id: "forest", name: "Forest", dots: ["#1b2a3d", "#ede3c8", "#2f5a46"], mark: "#2f5a46", ink: "#fff" },
        { id: "ember", name: "Ember", dots: ["#6b1f2f", "#f2dfa0", "#c8571e"], mark: "#b44d17", ink: "#fff8ec" },
        { id: "blossom", name: "Blossom", dots: ["#5a895e", "#f8e8d5", "#ea9eb6"], mark: "#ea9eb6", ink: "#1e3323" },
        { id: "iris", name: "Iris", dots: ["#8c974a", "#dfddd1", "#6e5bb1"], mark: "#6e5bb1", ink: "#fff" },
        { id: "lagoon", name: "Lagoon", dots: ["#023436", "#a3d95b", "#f76f8e"], mark: "#023436", ink: "#a3d95b" },
        { id: "midnight", name: "Midnight", dots: ["#111b28", "#ede3c8", "#96394d"], mark: "#1b2a3d", ink: "#ede3c8" }
    ];
    const currentPalette = () => PALETTES.find((x) => x.id === store.get("palette")) || PALETTES[0];
    function paintFavicon(p) {
        const link = document.querySelector('link[rel="icon"]');
        if (!link) return;
        if (p === PALETTES[0]) { link.href = "favicon.svg"; return; }
        link.href = "data:image/svg+xml," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="' + p.mark + '"/>' +
            '<g transform="translate(3 3)" fill="none" stroke="' + p.ink + '" stroke-width="2.6" stroke-linecap="round"><path d="M4.6 15.2A8.6 8.6 0 0 1 19.4 7.4"/>' +
            '<path d="M21.4 10.8A8.6 8.6 0 0 1 6.6 18.6" opacity=".6"/></g><circle cx="22.4" cy="10.4" r="2.3" fill="' + p.ink + '"/></svg>');
    }
    function setPalette(id) {
        const p = PALETTES.find((x) => x.id === id) || PALETTES[0];
        if (p === PALETTES[0]) { delete document.documentElement.dataset.palette; store.remove("palette"); }
        else { document.documentElement.dataset.palette = p.id; store.set("palette", p.id); }
        paintFavicon(p);
        document.dispatchEvent(new CustomEvent("palettechange"));
    }
    if (currentPalette() !== PALETTES[0]) paintFavicon(currentPalette());

    /* ---------- Shell ---------- */
    const NAV = [
        ["today", "Today", "dashboard.html"],
        ["tasks", "Tasks", "tasks.html"],
        ["calendar", "Calendar", "calendar.html"],
        ["expenses", "Expenses", "expenses.html"],
        ["notes", "Notes", "notes.html"],
        ["settings", "Settings", "settings.html"]
    ];

    function renderShell(page) {
        const rail = document.getElementById("rail");
        if (!rail) return;
        const u = user();
        const first = u && u.name ? u.name.trim().split(/\s+/)[0] : "";
        rail.innerHTML =
            '<a class="brand" href="dashboard.html">' + MARK + "Syncrona</a>" +
            '<p class="scope">' + (first ? esc(first) + "’s planner" : "Personal planner") + "</p>" +
            '<ul class="nav">' + NAV.map(([id, label, href]) =>
                '<li><a href="' + href + '"' + (id === page ? ' aria-current="page"' : "") + ">" + icon(id) + "<span>" + label + "</span>" +
                (id === "tasks" ? '<span class="count" data-nav-count hidden></span>' : "") + "</a></li>").join("") +
            "</ul>" +
            '<div class="side-foot">' +
            '<div class="user-row">' +
            '<span class="avatar" aria-hidden="true">' + esc((first || "S").charAt(0).toUpperCase()) + "</span>" +
            '<span class="who"><strong>' + esc(u && u.name ? u.name : "Signed in") + "</strong><span>" + esc((u && u.email) || "") + "</span></span>" +
            '<button class="icon-btn" type="button" data-signout aria-label="Sign out" title="Sign out">' + icon("logout") + "</button>" +
            "</div></div>";

        const current = NAV.find(([id]) => id === page);
        const top = document.createElement("header");
        top.className = "topbar";
        top.innerHTML =
            '<button class="icon-btn" type="button" data-nav-open aria-label="Open navigation" aria-expanded="false" aria-controls="rail">' + icon("menu") + "</button>" +
            '<span class="topbar-title">' + esc(current ? current[1] : "Syncrona") + "</span>" +
            '<span class="topbar-spacer" aria-hidden="true"></span>';
        document.body.prepend(top);

        const scrim = document.createElement("div");
        scrim.className = "nav-scrim";
        document.body.appendChild(scrim);

        const openBtn = top.querySelector("[data-nav-open]");
        const setOpen = (open) => {
            document.body.classList.toggle("nav-open", open);
            openBtn.setAttribute("aria-expanded", String(open));
            if (open) setTimeout(() => rail.querySelector('[aria-current="page"]')?.focus(), 60);
        };
        openBtn.addEventListener("click", () => setOpen(true));
        scrim.addEventListener("click", () => setOpen(false));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setOpen(false); openBtn.focus(); }
        });

        rail.querySelector("[data-signout]").addEventListener("click", () => signOut());
    }

    /* Sidebar count: open tasks due today or overdue — a queue that needs action. */
    function navTasks(tasks) {
        const el = document.querySelector("[data-nav-count]");
        if (!el || !Array.isArray(tasks)) return;
        const today = startOfDay(new Date());
        let due = 0, late = 0;
        tasks.forEach((t) => {
            if (t.completed) return;
            const w = when(t.dueDate);
            if (!w || w.day > today) return;
            due++;
            if (w.day < today) late++;
        });
        el.hidden = !due;
        el.textContent = due;
        el.classList.toggle("is-overdue", late > 0);
        el.title = late ? late + " overdue, " + (due - late) + " due today" : due + " due today";
        const label = el.parentElement.querySelector(".sr-only") || el.parentElement.appendChild(Object.assign(document.createElement("span"), { className: "sr-only" }));
        label.textContent = due ? " (" + el.title + ")" : "";
    }

    /* ---------- Toasts ---------- */
    let toastHost;
    function toast(message, opts = {}) {
        if (!toastHost) {
            toastHost = document.createElement("div");
            toastHost.className = "toasts";
            toastHost.setAttribute("role", "status");
            toastHost.setAttribute("aria-live", "polite");
            document.body.appendChild(toastHost);
        }
        const el = document.createElement("div");
        el.className = "toast entering" + (opts.error ? " error" : "") + (opts.action ? "" : " plain");
        el.innerHTML = "<span>" + esc(message) + "</span>" + (opts.action ? '<button type="button">' + esc(opts.action) + "</button>" : "");
        toastHost.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("entering")));

        let timer;
        let closed = false;
        const close = (byAction) => {
            if (closed) return;
            closed = true;
            clearTimeout(timer);
            el.classList.add("leaving");
            setTimeout(() => el.remove(), 160);
            if (!byAction && opts.onTimeout) opts.onTimeout();
        };
        const start = () => { timer = setTimeout(() => close(false), opts.duration || 4000); };
        el.addEventListener("mouseenter", () => clearTimeout(timer));
        el.addEventListener("mouseleave", () => { if (!closed) start(); });
        if (opts.action) {
            el.querySelector("button").addEventListener("click", () => { close(true); opts.onAction && opts.onAction(); });
        }
        start();
        return { close: () => close(false) };
    }
    const toastError = (err) => toast(err && err.message ? err.message : String(err), { error: true, duration: 6000 });

    /* ---------- Undoable delete ----------
       Hide locally now, delete on the server when the toast expires (or the
       page is left). Undo restores without a round trip. */
    const pending = new Set();
    function undoable({ message, apply, revert, path }) {
        apply();
        const job = { path, done: false };
        pending.add(job);
        const commit = async () => {
            if (job.done) return;
            job.done = true;
            pending.delete(job);
            try { await api(path, { method: "DELETE" }); }
            catch (e) { revert(); toastError(e); }
        };
        toast(message, {
            action: "Undo",
            duration: 5000,
            onAction: () => { job.done = true; pending.delete(job); revert(); },
            onTimeout: commit
        });
    }
    addEventListener("pagehide", () => {
        pending.forEach((job) => {
            job.done = true;
            api(job.path, { method: "DELETE", keepalive: true }).catch(() => {});
        });
        pending.clear();
    });

    /* ---------- Busy buttons ---------- */
    async function busy(btn, fn) {
        if (!btn || btn.getAttribute("aria-busy") === "true") return;
        btn.setAttribute("aria-busy", "true");
        try { return await fn(); }
        finally { btn.removeAttribute("aria-busy"); }
    }

    /* ---------- Minute ticker ---------- */
    function everyMinute(cb) {
        cb();
        const schedule = () => setTimeout(() => { cb(); schedule(); }, 60000 - (Date.now() % 60000) + 50);
        schedule();
        document.addEventListener("visibilitychange", () => { if (!document.hidden) cb(); });
    }

    /* ---------- Quick note ---------- */
    function renderQuickNote() {
        const fab = document.createElement("button");
        fab.type = "button";
        fab.className = "fab";
        fab.setAttribute("aria-expanded", "false");
        fab.setAttribute("aria-controls", "quicknote");
        fab.innerHTML = icon("pen") + '<span class="fab-label">Quick note</span>';

        const pop = document.createElement("section");
        pop.className = "quicknote";
        pop.id = "quicknote";
        pop.dataset.state = "closed";
        pop.setAttribute("role", "dialog");
        pop.setAttribute("aria-label", "Quick note");
        pop.innerHTML =
            '<div class="qn-head"><h2>Quick note</h2><button class="icon-btn" type="button" data-close aria-label="Close quick note">' + icon("x") + "</button></div>" +
            '<form><label class="sr-only" for="qn-text">Note</label>' +
            '<textarea id="qn-text" class="input" placeholder="Write it down before it slips…" required></textarea>' +
            '<div class="qn-foot"><span><kbd>' + (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl") + '</kbd> <kbd>Enter</kbd> to save</span><button class="btn btn-primary btn-sm" type="submit">Save note</button></div></form>' +
            '<div class="qn-recent" aria-live="polite"></div>';

        document.body.append(pop, fab);
        const ta = pop.querySelector("textarea");
        const recent = pop.querySelector(".qn-recent");
        const form = pop.querySelector("form");

        const loadRecent = async () => {
            try {
                const notes = await api("/notes");
                recent.innerHTML = notes.length
                    ? notes.slice(0, 3).map((n) => "<p><span>" + esc(n.content) + "</span></p>").join("") + '<a href="notes.html">All notes (' + notes.length + ")</a>"
                    : "";
            } catch (e) { recent.innerHTML = ""; }
        };
        const open = (state) => {
            pop.dataset.state = state ? "open" : "closed";
            fab.setAttribute("aria-expanded", String(state));
            if (state) { setTimeout(() => ta.focus(), 30); loadRecent(); }
        };
        fab.addEventListener("click", () => open(pop.dataset.state !== "open"));
        pop.querySelector("[data-close]").addEventListener("click", () => { open(false); fab.focus(); });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && pop.dataset.state === "open") { open(false); fab.focus(); }
        });
        document.addEventListener("pointerdown", (e) => {
            if (pop.dataset.state === "open" && !pop.contains(e.target) && !fab.contains(e.target)) open(false);
        });
        ta.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); form.requestSubmit(); }
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const content = ta.value.trim();
            if (!content) { ta.focus(); return; }
            busy(form.querySelector("[type=submit]"), async () => {
                try {
                    const note = await api("/notes", { method: "POST", body: { content } });
                    ta.value = "";
                    toast("Note saved");
                    loadRecent();
                    document.dispatchEvent(new CustomEvent("note:created", { detail: note }));
                } catch (err) { toastError(err); }
            });
        });
    }

    /* ---------- Empty date/time fields read as hints, not values ---------- */
    function syncEmpty(root) {
        (root || document).querySelectorAll('input[type="date"], input[type="time"]').forEach((i) => i.classList.toggle("is-empty", !i.value));
    }
    ["input", "change"].forEach((t) => document.addEventListener(t, (e) => {
        if (e.target.matches && e.target.matches('input[type="date"], input[type="time"]')) syncEmpty(e.target.parentElement);
    }, true));
    document.addEventListener("submit", () => setTimeout(syncEmpty, 1500), true);
    addEventListener("DOMContentLoaded", () => syncEmpty());

    /* ---------- Boot ---------- */
    const page = document.body.dataset.page;
    const signedIn = document.body.dataset.auth === "required";
    if (signedIn && !token()) signOut();
    if (signedIn) {
        renderShell(page);
        if (page !== "notes") renderQuickNote();
        // Pages that load tasks themselves keep the count fresh via S.navTasks.
        if (!["today", "tasks", "calendar"].includes(page)) api("/tasks").then(navTasks).catch(() => {});
    }

    window.S = {
        API_BASE, store, esc, api, token, user, signOut,
        pad, ymd, parseYmd, startOfDay, addDays, sameDay, daysBetween, when, toPayload,
        fmtTime, fmtDay, fmtDayLong, fmtDate, relDay, relTime, relSoon, timeAgo, WD, WD_LONG, MO, MO_LONG,
        money, threshold, icon, LEAD, checkBtn, MARK, navTasks,
        syncEmpty, PALETTES, currentPalette, setPalette,
        toast, toastError, undoable, busy, everyMinute
    };
})();
