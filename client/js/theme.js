// theme.js
// Instantly apply dark mode on load to prevent flashing
const themePref = localStorage.getItem('theme');
if (themePref === 'dark') {
    document.body.classList.add('dark-mode');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon(document.body.classList.contains('dark-mode'));
});

function updateThemeIcon(isDark) {
    // Select all potential theme toggle icons across pages
    const iconPaths = document.querySelectorAll('.theme-toggle-icon path');
    iconPaths.forEach(iconPath => {
        if (isDark) {
            // Sun icon for switching back to light mode
            iconPath.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
        } else {
            // Moon icon for switching to dark mode
            iconPath.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
        }
    });
}
