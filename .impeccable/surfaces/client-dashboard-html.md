---
version: 1
slug: "client-dashboard-html"
primary_target: "client/dashboard.html"
related_targets: ["client/tasks.html","client/calendar.html","client/expenses.html","client/notes.html","client/settings.html","client/login.html","client/signup.html"]
---

# Syncrona app shell (all signed-in screens + auth)

Scope: Today, tasks, calendar, expenses, notes, settings, login, signup. Visitor mode: Operate (auth screens lean Persuade for portfolio visitors, inside the same world).

Audience and job: a portfolio visitor exploring a working demo; in-app, one person planning their day and tracking spend. Must keep: light/dark toggle, floating quick-note button, every existing function. User verdict on the previous build (Station Timetable): "too plain/empty, looks like a spreadsheet, dull, no personality". User-pinned direction: a fresh, polished app look in the class of Linear, Things and Raycast. Code-led build; vanilla HTML/CSS/JS, no build step.

## Direction contract

THESIS: Syncrona is a calm personal home for one day: a greeting that tells you the day's one fact, then soft tonal panels holding real things you can tick, add and read. It refuses the spreadsheet: no ruled tables, no hairline grids, no data set as columns where a row card will do.

OWN-WORLD: White page, cool stone panels (#f4f6f5) one step off white, white row cards inside them, deep teal (#1b6e66) as the only hue on actions, selection and the day's data; red only for overdue and over-threshold. Instrument Sans for everything, Instrument Serif for the greeting alone. Radius 22 on panels, 12 on row cards, full pills on controls. No shadows at rest; only floating things (popover, toast, sheet, FAB) lift.

STORY: Within seconds the visitor reads who the day belongs to and what matters in it, sees today laid out on a day line, adds a task, event or payment in one place, and meets the same panels and rows on every screen.

FIRST VIEWPORT: Labelled sidebar on the page ground (mark, nav with grey active pill, user and theme at the foot). Centred 1100px column: serif greeting with the day's fact, grey date line; four count tiles (open tasks, events today, spent this month, notes); a 9-col Today panel with the day line and agenda rows beside a 3-col Add panel; then Next 7 days and Spending side by side.

FORM: User-pinned polished-app canon (Linear / Things / Raycast bar), taken over assigned #5. seed:62910ccc9fa88a5f. Signature move: the day line, a 06:00 to midnight strip where timed events sit as teal pills and timed tasks as rings, with a live now marker and the day's spend total at its end (payments carry no time); motion grammar is press-scale and a quick settle on checks and arriving rows, nothing performing an entrance.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
