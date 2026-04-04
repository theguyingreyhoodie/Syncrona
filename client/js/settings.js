const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '';

let token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const threshInput = document.getElementById("settingsThresholdInput");
    if(threshInput) {
        threshInput.value = localStorage.getItem('expenseThreshold') || 500;
    }
    
    // Partially censor token for diagnostic rendering
    const tokenDisplay = document.getElementById("tokenDisplay");
    if(tokenDisplay && token) {
        const censored = token.substring(0, 15) + "••••••••" + token.substring(token.length - 10);
        tokenDisplay.textContent = `Token Identifier ID: ${censored}`;
    }
});

function saveSettingsThreshold() {
    const threshold = document.getElementById("settingsThresholdInput").value;
    if (threshold) {
        localStorage.setItem('expenseThreshold', threshold);
        // UI feedback logic
        const btn = document.querySelector('button[onclick="saveSettingsThreshold()"]');
        const oldText = btn.textContent;
        btn.textContent = 'Success!';
        btn.style.backgroundColor = '#10b981';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.textContent = oldText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 1500);
    }
}

function clearDiagnosticStorage() {
    if(confirm("Are you securely flushing cache tokens? You will be signed out and your preferences cleared!")) {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function go(p) {
    window.location.href = p;
}
