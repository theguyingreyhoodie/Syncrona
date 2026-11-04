/* Settings: theme, accent colour, threshold, account. */
(function () {
    "use strict";
    const { store, user, signOut, setTheme, threshold, money, esc, ACCENTS, currentAccent, setAccent } = window.S;
    const $ = (id) => document.getElementById(id);

    /* Theme */
    const current = store.get("theme") || "system";
    const radio = document.querySelector('input[name=theme][value="' + current + '"]');
    if (radio) radio.checked = true;
    document.querySelectorAll("input[name=theme]").forEach((r) => r.addEventListener("change", () => setTheme(r.value)));
    document.addEventListener("themechange", () => {
        const v = store.get("theme") || "system";
        document.querySelector('input[name=theme][value="' + v + '"]').checked = true;
    });

    /* Accent colour */
    const picker = $("accentPicker");
    const chosen = currentAccent().id;
    picker.innerHTML = ACCENTS.map((a) =>
        '<label><input type="radio" name="accent" value="' + esc(a.id) + '"' + (a.id === chosen ? " checked" : "") + ">" +
        '<span><i style="--sw:' + esc(a.swatch) + ";--swd:" + esc(a.swatchDark) + '"></i>' + esc(a.name) + "</span></label>").join("");
    picker.addEventListener("change", (e) => setAccent(e.target.value));

    /* Threshold */
    $("threshold").value = threshold();
    let savedTimer;
    $("thresholdForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const v = parseFloat($("threshold").value);
        if (!(v > 0)) {
            $("thresholdError").textContent = "Enter an amount above ₹0.";
            $("threshold").setAttribute("aria-invalid", "true");
            $("threshold").focus();
            return;
        }
        $("thresholdError").textContent = "";
        $("threshold").removeAttribute("aria-invalid");
        store.set("expenseThreshold", String(v));
        $("savedNote").textContent = "Saved · " + money(v);
        clearTimeout(savedTimer);
        savedTimer = setTimeout(() => { $("savedNote").textContent = ""; }, 2500);
    });

    /* Account */
    const u = user();
    if (u && u.name) {
        $("accountName").textContent = "Signed in as " + u.name;
        $("accountEmail").textContent = u.email || "";
    } else {
        $("accountEmail").textContent = "This browser holds an active session.";
    }
    $("signOut").addEventListener("click", () => signOut());

    /* Reset: two-step confirm in place */
    const reset = $("reset");
    let armed = null;
    reset.addEventListener("click", () => {
        if (armed) {
            store.clear();
            location.replace("login.html");
            return;
        }
        reset.textContent = "Click again to reset";
        armed = setTimeout(() => { reset.textContent = "Reset"; armed = null; }, 4000);
    });
})();
