---
version: 1
slug: "client-dashboard-html"
primary_target: "client/dashboard.html"
related_targets: ["client/tasks.html","client/calendar.html","client/expenses.html","client/notes.html","client/settings.html","client/login.html","client/signup.html"]
---

# Syncrona app shell (all signed-in screens + auth)

Scope: dashboard (Today), tasks, calendar, expenses, notes, settings, login, signup. Visitor mode: Operate (auth screens lean Persuade for portfolio visitors, inside the same world).

Audience and job: a portfolio visitor exploring a working demo; in-app, one person planning their day and tracking spend. Must keep: light/dark toggle, floating quick-note button. Must avoid: generic SaaS template look, playful/cute tone. Code-led build; vanilla HTML/CSS/JS, no build step.

## Direction contract

THESIS: Syncrona sets your day like a station timetable: every task, event and payment has a time, a line and a status, read top to bottom against a red now-line. It refuses the SaaS greeting-plus-stat-cards dashboard.

OWN-WORLD: White timetable paper, near-black ink, a board-navy nav rail. Archivo only: condensed width for times, dates and money, normal width for prose. Hairline rules instead of cards. Line badges mark item type (T ink, E blue, ₹ green, N amber). Signal red only for the now-line, overdue and over-threshold. Night theme: board-navy ground, same roles.

STORY: Within seconds the visitor sees what is next and what has been spent, captures a task, event or expense in one line, and meets the same vocabulary on every screen.

FIRST VIEWPORT: Rail left. Header ruled in ink: condensed date and live clock. Quick-add line. "Next up" timetable (time, line, item, status) cut by the red NOW rule. Right column: month spend with a day strip, largest payments, latest notes.

FORM: Station timetable, #5 of 7 on the ordered list. seed:4d80328b7f854b57. Signature move: the departures table with a live NOW rule; motion grammar is a split-second row settle, nothing decorative.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
