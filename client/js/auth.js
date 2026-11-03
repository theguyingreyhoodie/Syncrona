/* Sign in / create account. */
(function () {
    "use strict";
    const { API_BASE, store, esc, MARK, fmtDayLong, busy } = window.S;
    const $ = (id) => document.getElementById(id);
    const form = $("authForm");
    const mode = form.dataset.mode;
    const err = $("authError");

    document.querySelectorAll("[data-mark]").forEach((a) => { a.innerHTML = MARK + esc(a.textContent); });
    // The sample board keeps its fixed sample times; only the date is today's.
    document.querySelectorAll("[data-board-date]").forEach((el) => { el.textContent = fmtDayLong(new Date()); });

    if (mode === "login" && /expired/.test(location.search)) {
        err.textContent = "Your session ended. Sign in again to continue.";
    }

    document.querySelectorAll("[data-pw-toggle]").forEach((b) => b.addEventListener("click", () => {
        const input = $(b.getAttribute("aria-controls"));
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        b.textContent = show ? "Hide" : "Show";
        b.setAttribute("aria-pressed", String(show));
    }));

    async function post(path, body) {
        let res;
        try {
            res = await fetch(API_BASE + "/api/auth" + path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (e) {
            throw new Error("Can't reach the Syncrona server. Check your connection and try again.");
        }
        let data = {};
        try { data = await res.json(); } catch (e) { /* empty */ }
        if (!res.ok) throw new Error(friendly(data.msg) || "Something went wrong (" + res.status + "). Try again.");
        return data;
    }

    function friendly(msg) {
        if (msg === "User not found") return "No account uses that email. Check it, or create an account.";
        if (msg === "Invalid password") return "That password doesn't match. Try again.";
        if (msg === "User already exists") return "An account with that email already exists. Sign in instead.";
        return msg;
    }

    function invalid(id, message) {
        err.textContent = message;
        $(id).setAttribute("aria-invalid", "true");
        $(id).focus();
        return false;
    }

    function validate() {
        form.querySelectorAll("[aria-invalid]").forEach((i) => i.removeAttribute("aria-invalid"));
        if (mode === "signup" && !$("name").value.trim()) return invalid("name", "Enter your name.");
        if (!/^\S+@\S+\.\S+$/.test($("email").value.trim())) return invalid("email", "Enter a valid email address.");
        if (!$("password").value) return invalid("password", "Enter your password.");
        if (mode === "signup" && $("password").value.length < 8) return invalid("password", "Use at least 8 characters for your password.");
        return true;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        err.textContent = "";
        if (!validate()) return;
        const email = $("email").value.trim();
        const password = $("password").value;
        busy($("authSubmit"), async () => {
            try {
                if (mode === "signup") await post("/signup", { name: $("name").value.trim(), email, password });
                const data = await post("/login", { email, password });
                store.set("token", data.token);
                store.set("user", JSON.stringify(data.user || {}));
                location.replace("dashboard.html");
            } catch (e2) {
                err.textContent = e2.message;
            }
        });
    });
})();
