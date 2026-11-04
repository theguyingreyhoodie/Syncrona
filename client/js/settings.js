/* Settings: colour theme, threshold, account. */
(function () {
    "use strict";
    const { store, user, signOut, threshold, money, esc, PALETTES, currentPalette, setPalette } = window.S;
    const $ = (id) => document.getElementById(id);

    /* Colour theme */
    const picker = $("palettePicker");
    const chosen = currentPalette().id;
    picker.innerHTML = PALETTES.map((p) =>
        '<label><input type="radio" name="palette" value="' + esc(p.id) + '"' + (p.id === chosen ? " checked" : "") + ">" +
        '<span><b class="dots" aria-hidden="true">' + p.dots.map((c) => '<i style="background:' + esc(c) + '"></i>').join("") + "</b>" +
        esc(p.name) + "</span></label>").join("");
    picker.addEventListener("change", (e) => setPalette(e.target.value));

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
