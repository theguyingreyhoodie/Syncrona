---
name: Syncrona
description: Your day set like a station timetable, with tasks, events and spending on one board read against a red now-line.
colors:
  ink: "#141414"
  board: "#17222d"
  board-2: "#223140"
  board-ink: "#c8d1d9"
  board-ink-2: "#8a97a3"
  board-rule: "#2a3946"
  board-bright: "#ffffff"
  red: "#d2241a"
  red-wash: "#fdecea"
  on-red: "#ffffff"
  line-task: "#141414"
  line-event: "#2459c4"
  line-spend: "#0d7a4b"
  line-note: "#9a6200"
  on-line: "#ffffff"
  event-wash: "#e9f0fc"
  spend-wash: "#e5f3ec"
  focus: "#2459c4"
  paper: "#ffffff"
  paper-2: "#f4f5f3"
  paper-3: "#eceeeb"
  ink-2: "#53575c"
  ink-3: "#6b7075"
  rule: "#e1e3df"
  rule-2: "#c9ccc7"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "52px"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 68"
  figure:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "46px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.005em"
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 68"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1
    fontVariation: "\"wdth\" 68"
  time:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    letterSpacing: "0.01em"
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 68"
  amount:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 84"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 600
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  control:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.06em"
  meta:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  badge:
    fontFamily: "Archivo, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "11.5px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  tag: "3px"
  badge: "4px"
  inset: "5px"
  control: "6px"
  panel: "8px"
  popover: "10px"
  pill: "24px"
  circle: "50%"
spacing:
  2xs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "38px"
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, #141414 86%, #ffffff)"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "38px"
  button-secondary-hover:
    backgroundColor: "{colors.paper-2}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "38px"
  button-danger:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.red}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "38px"
  button-danger-hover:
    backgroundColor: "{colors.red-wash}"
  button-sm:
    padding: "0 10px"
    height: "32px"
  icon-button:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    size: "32px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "38px"
  segmented:
    backgroundColor: "{colors.paper-3}"
    rounded: "{rounded.panel}"
    padding: "3px"
  segmented-option:
    textColor: "{colors.ink-2}"
    typography: "{typography.control}"
    rounded: "{rounded.inset}"
    padding: "0 12px"
    height: "32px"
  segmented-option-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  line-badge-task:
    backgroundColor: "{colors.line-task}"
    textColor: "{colors.on-line}"
    typography: "{typography.badge}"
    rounded: "{rounded.badge}"
    padding: "0 5px"
    height: "20px"
    width: "26px"
  line-badge-event:
    backgroundColor: "{colors.line-event}"
    textColor: "{colors.on-line}"
  line-badge-spend:
    backgroundColor: "{colors.line-spend}"
    textColor: "{colors.on-line}"
  line-badge-note:
    backgroundColor: "{colors.line-note}"
    textColor: "{colors.on-line}"
  now-tag:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.tag}"
    padding: "0 7px"
    height: "19px"
  status-mark:
    textColor: "{colors.paper}"
    rounded: "{rounded.circle}"
    size: "22px"
  status-mark-done:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  timetable-row:
    typography: "{typography.body}"
    padding: "0 10px"
    height: "50px"
  rail:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-ink}"
    padding: "24px 14px 16px"
    width: "232px"
  nav-item:
    textColor: "{colors.board-ink}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "40px"
  nav-item-active:
    backgroundColor: "{colors.board-2}"
    textColor: "{colors.board-bright}"
  addbar:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.panel}"
    padding: "12px"
  callout-error:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "14px 16px"
  toast:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-bright}"
    rounded: "{rounded.panel}"
    padding: "6px 6px 6px 16px"
  toast-error:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
  fab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 18px 0 14px"
    height: "48px"
  quicknote:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.popover}"
    width: "360px"
---

# Design System: Syncrona

## Overview

**Creative North Star: "The Personal Departures Board"**

Syncrona sets a person's day the way a station sets its departures: every task, event and payment has a time, a line and a status, read top to bottom against a red NOW rule. The surface is white timetable paper printed in near-black ink, framed by a board-navy rail. Nothing floats in tiles; rows sit between hairline rules, section heads are ruled in ink, and the eye runs down a time column set in condensed figures.

Density is operational, not airy. Rows are 50px, the page runs to 1240px, and the first viewport carries the clock, a one-line add bar, the next-up timetable and the month's spend at once. Expression comes from one variable family, Archivo, pulled between two widths: condensed for anything you would read off a board (times, dates, money, page titles, day numbers) and normal width for prose and controls. Colour is reserved for meaning. Four line colours say what kind of item a row is; signal red says now, late, over or failed.

The world explicitly refuses the SaaS greeting-plus-stat-cards dashboard. The night theme is the same board on a navy ground: every role keeps its job, only the token values change.

**Key Characteristics:**
- Timetable rows (time, line badge, item, status) between 1px hairlines, under a 1.5px ink column head.
- A red NOW rule with a NOW HH:MM tag cuts any time-ordered list that spans the present.
- One family, two widths: Archivo condensed (wdth 68) for figures, normal width for prose.
- Line badges mark item type everywhere: T ink, E blue, ₹ green, N amber.
- Board-navy frame (rail, mobile topbar, toasts, auth board) around white paper content.
- Motion is functional only: a 900ms row settle, 120–140ms state changes, short popover and drawer transitions.

## Colors

A monochrome ink-on-paper timetable with one navy frame, four line colours that encode item type, and a single signal red that encodes urgency.

### Primary
- **Timetable Ink** (#141414; night #eef1f4): text, primary buttons, the 2px page-head rule, the 1.5px column-head rules, the today chip on the calendar, done status marks, the floating quick-note button. Ink is the brand: the product reads as printed matter.

### Secondary
- **Board Navy** (#17222d; night #080d12): the frame. Desktop nav rail, mobile topbar and drawer, toast background, the auth screen's sample board. Never used inside content.
- **Board Navy Raised** (#223140; night #16212b): the active nav item.
- **Board Ink** (#c8d1d9) and **Board Ink Muted** (#8a97a3; night #7f8c98): nav labels and secondary rail text (user email, icons at rest).
- **Board Rule** (#2a3946; night #1b2630): hairlines on the board (rail footer divider, auth board rows).
- **Board Bright** (#ffffff): the brand wordmark, the active and hovered nav item, toast text, the auth board's head rule text.

### Tertiary
- **Signal Red** (#d2241a; night #ff5a4e): the NOW rule and tag, the clock colon, overdue tasks and their group head, spend at or over the user's threshold, month-over-month increase, form errors, invalid inputs, destructive buttons and error toasts.
- **Red Wash** (#fdecea; night #3a1513): error callout fill and danger-button hover.
- **On Red** (#ffffff; night #160605): text on the NOW tag and error toast.

### Line Colors
- **Task Line** (#141414; night #eef1f4): the T badge and calendar task dot.
- **Event Line** (#2459c4; night #6f9dff): the E badge and calendar event dot. **Event Wash** (#e9f0fc; night #142338) is the settle fill for a new event row.
- **Spend Line** (#0d7a4b; night #3cc28c): the ₹ badge, spend strip bars, per-day spend on the calendar. **Spend Wash** (#e5f3ec; night #0f2a20) is the settle fill for a new expense row.
- **Note Line** (#9a6200; night #e2a640): the N badge and the search-match highlight on notes (at 30% mix).
- **On Line** (#ffffff; night #0e151c): the letter inside every line badge.
- **Focus Blue** (#2459c4; night #6f9dff): focus outlines, the caret, input focus halo (22% mix) and text selection (26% mix). It shares the event hue by construction.

### Neutral
- **Timetable Paper** (#ffffff; night #0e151c): the page and every resting surface.
- **Paper Tint** (#f4f5f3; night #131d26): the add bar well, hover fills, calendar days outside the month.
- **Paper Shade** (#eceeeb; night #1a2631): segmented-control track, skeleton base, task settle fill.
- **Ink Secondary** (#53575c; night #a3aeb8): sub-lines, status text, meta, column heads.
- **Ink Tertiary** (#6b7075; night #8794a0): placeholders, done items, past times, the soft year in page titles.
- **Hairline** (#e1e3df; night #22303c): row rules, calendar grid lines.
- **Hairline Strong** (#c9ccc7; night #34444f): input borders, group-row rules, empty strip bars.

### Named Rules
**The Signal Red Rule.** Red means now, late, over or failed, and nothing else: the NOW rule, the clock colon, overdue, at-or-over-threshold spend, errors and destructive actions. It is never a brand accent, a category or decoration.

**The Line Colour Rule.** Each item type owns one line colour and keeps it on every screen: badge, calendar dot, settle wash, strip bar. Line colours say what kind of thing a row is, never how it is doing.

**The Frame Rule.** Board navy is the frame around the content (rail, topbar, toasts, auth board), never a fill inside it.

## Typography

**Display Font:** Archivo, condensed (wdth 68), with ui-sans-serif, system-ui fallback
**Body Font:** Archivo, normal width (wdth 100)
**Label/Mono Font:** none; Archivo with tabular figures does all numeric work

**Character:** One grotesque pulled between two widths. Condensed bold figures give the board its station-sign voice; normal-width Archivo keeps prose and controls quiet and legible. Archivo is loaded from Google Fonts on the variable axes wdth 62–125 and wght 400–800.

### Hierarchy
- **Display** (700, 52px, 0.95, condensed): page titles ("Tue 3 Nov 2026", "November 2026", "Sign in" at 48px) and the live clock (600). Drops to 40px at 720px. A trailing soft part (the year) is set in Ink Tertiary at 500.
- **Figure** (700, 46px, 1, condensed, tabular): the month spend total. 56px on Expenses, 34px in the calendar footer.
- **Headline** (700, 30px, 1, condensed): the calendar day panel title.
- **Time** (700, 21px, condensed, tabular): the timetable time column. Calendar day numbers use the same treatment at 20px, expense day rows at 17px. A small 14px/600 suffix carries a secondary time ("Fri 10:30").
- **Amount** (700, 16px, semi-condensed wdth 84, tabular): money inside rows and lists.
- **Title** (600, 16px): setting names, empty-state leads.
- **Body** (400, 15px, 1.45): rows, prose, inputs. Note bodies run at 15.5px/1.55; the composer at 16px. Empty states cap at 52ch.
- **Control** (600, 14px): buttons, segmented options, the FAB. Nav items use 15px/500, active 600.
- **Label** (700, 13px, 0.06em, uppercase): section titles ("NEXT UP", "NOVEMBER SPEND") and, at 12px, timetable group rows ("OVERDUE", "TODAY").
- **Meta** (400, 13px, Ink Secondary): sub-lines, hints, timestamps. Column heads use 12px/600.
- **Badge** (700, 11.5px, 0.02em): line badge letters; the NOW tag uses 11px/700/0.06em.

### Named Rules
**The Two Widths Rule.** If you would read it off a station board (a time, a date, a day number, a sum of money, a page title), set it condensed. Everything else stays normal width. No second typeface.

**The Tabular Rule.** Every number that changes or aligns in a column uses tabular figures: times, amounts, counts, dates, the clock.

## Layout

The signed-in shell is a two-column grid: a 232px sticky board rail and a fluid main column padded 28px top, 44px sides, 96px bottom, with page content capped at 1240px. Every page opens with a page head: condensed title left, live figure or tools right, ruled underneath in 2px ink, then 20px to content.

Today places the timetable beside a 340px aside (gap 44px); Calendar places the month grid beside a 340px sticky day panel (gap 32px). The aside stacks its sections 32px apart. Notes flow in CSS columns (3 × min 280px, gap 32px). Settings caps at 760px. The auth screens split paper form and navy sample board at 1 : 1.05.

Spacing steps by 2px multiples on a working scale of 2, 4, 8, 12, 16, 24, 32 and 44px; 6, 10, 14, 20 and 28px appear inside components for optical fit. Controls are 38px tall (32px small); timetable rows 50px; nav items 40px.

Responsive behaviour:
- **≤1180px:** the Today aside and calendar day panel narrow to 300px.
- **≤980px:** the rail becomes an off-canvas drawer (min(280px, 84vw)) behind a 56px board-navy topbar with 44px icon buttons; content goes single column; main padding 20px.
- **≤720px:** main padding 16px; display type 40px; the add bar folds to two columns with the type switch, title and button full width; the time column narrows to 64px at 18px and rows grow to 54px; calendar cells become 64px squares showing dots only; the auth board hides; the FAB becomes a 52px circle.

## Elevation & Depth

The system is flat. Depth comes from rules of three weights (1px hairline, 1.5px ink column head, 2px ink page head) and from tonal steps between paper, paper tint and paper shade. A shadow appears only on layers that float above the page.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 12px 32px -8px rgba(15, 22, 30, 0.22), 0 2px 6px rgba(15, 22, 30, 0.08)`; night `0 14px 36px -8px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4)`): the quick-note FAB, quick-note popover and toasts.
- **Drawer** (`box-shadow: 12px 0 40px rgba(0, 0, 0, 0.3)`): the mobile rail while open, over a navy scrim.
- **Segment Lift** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--rule)`): the selected option of a segmented control, the one resting shadow in the system.
- **Focus Halo** (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 22%, transparent)`): focused inputs and the notes composer, paired with an ink border.

### Named Rules
**The Rules-Not-Cards Rule.** Content sits between hairline rules, never inside cards. Only input surfaces get a container: the add bar well, the notes composer, the quick-note popover, and the error callout.

**The Float-Only Shadow Rule.** Pop shadow belongs to layers floating above the page (FAB, popover, toast, open drawer). Resting surfaces are flat; the segmented control's selected option is the single exception.

## Shapes

Corners are small and functional: 6px on controls, nav items and icon buttons; 8px on container wells (add bar, composer, callout, toast, segmented track); 10px on the quick-note popover; 4px on line badges, calendar day chips and keycaps; 3px on the NOW tag, skeleton bars and focus outlines. Only two things are round: the 22px status marks (circles, 2px ink ring, red ring when overdue) and the quick-note FAB (24px pill, a full circle on phones). Calendar dots are 7px squares softened to 2px. Borders are 1px hairlines for structure, 1.5px ink on outline buttons and column heads, 2px ink on page heads and the selected calendar day (inset).

## Components

### Buttons
Printed, firm, and plain: an ink outline that fills on emphasis.
- **Shape:** gently squared (6px), 38px tall, 14px horizontal padding, 16px icons with an 8px gap.
- **Primary:** ink fill, paper text. Hover mixes ink 86% toward paper.
- **Secondary (default):** paper fill, ink text, 1.5px ink border. Hover fills Paper Tint.
- **Ghost:** transparent border and fill until hover (Paper Tint).
- **Danger:** paper fill, red border and text; hover Red Wash.
- **Small:** 32px tall, 10px padding, 13px text.
- **Press / busy / disabled:** press scales to 0.97 over 120ms ease-out; busy hides the label behind a 14px spinner; disabled drops to 45% opacity.
- **Icon button:** 32px square, Ink Secondary icon, Paper Tint hover; the danger variant hovers Red Wash with a red icon. 44px inside the mobile topbar.

### Chips
- **Line badges:** 26 × 20px, 4px corners, a single 11.5px bold letter (T, E, ₹, N) in On Line over the line colour. They mark item type only, carry a full-word title and screen-reader suffix, and sit in their own 44px column in timetables.
- **NOW tag:** red fill, On Red text, 3px corners, "NOW 01:23" in 11px bold tracked tabular figures, riding the left end of the NOW rule.

### Cards / Containers
There are no content cards (see The Rules-Not-Cards Rule).
- **Add bar:** Paper Tint well, 1px hairline border, 8px corners, 12px padding, one grid row: type switch, title, date, time or amount, primary button. Errors span the full row below.
- **Error callout:** Red Wash fill, 1px red border, 8px corners, 14px × 16px padding, red alert icon, bold lead line, and a retry button.
- **Empty state:** plain text on paper, 28px top padding, a 16px ink lead and Ink Secondary prose capped at 52ch, with an inline link to the next action.

### Inputs / Fields
- **Style:** paper fill, 1px Hairline Strong border, 6px corners, 38px tall, 12px padding, 15px text. Labels 13px/600 ink sit 6px above.
- **Hover / Focus:** hover darkens the border to Ink Tertiary; focus turns it ink and adds the Focus Halo.
- **Error / Disabled:** invalid fields take a red border; the message sits below in 14px red.
- **Money input:** a ₹ prefix inside the field at 11px from the left; amounts use tabular figures.
- **Segmented control:** Paper Shade track (3px padding, 8px corners), 32px options at 14px/600 in Ink Secondary; the selected option turns paper with ink text and the Segment Lift. Counts inside options sit at 500 weight in Ink Tertiary.

### Navigation
- **Rail:** board navy, 232px, padding 24px 14px 16px. The wordmark (19px/700 in Board Bright with the clock mark) sits 32px above the list.
- **Items:** 40px tall, 6px corners, 18px icons at 12px gap, 15px/500 Board Ink. Hover lays a 5% white wash and brightens to white; the current page fills Board Navy Raised in Board Bright at 600.
- **Foot:** a Board Rule divider, then the signed-in user (name 14px/600, email 13px muted) and 38px rail buttons for theme and sign out.
- **Mobile:** below 980px a 56px navy topbar (menu, wordmark, theme) opens the rail as a drawer sliding in over 260ms on cubic-bezier(0.32, 0.72, 0, 1), with a scrim and Escape to close.

### Timetable (signature)
The departures table. Columns: Time (92px, condensed 21px bold tabular), Line (44px, badge), Item (15.5px, optional 13px sub-line), Status (right-aligned, 14px Ink Secondary, with a status mark for tasks or an amount for expenses). Head cells are 12px/600 Ink Secondary over a 1.5px ink rule; rows are 50px over 1px hairlines.
- **Group rows:** 12px bold uppercase tracked labels ("OVERDUE", "TODAY", "THIS WEEK") with a count, over a Hairline Strong rule; the overdue group turns red.
- **NOW rule:** a zero-height row with a 2px red bottom border and the NOW tag, inserted where the present falls.
- **States:** done rows strike through in Ink Tertiary; past times dim to Ink Tertiary; overdue status and at-or-over amounts turn red.
- **Row actions:** hidden until hover or focus-within (always visible on touch).
- **Settle:** a newly added row fades from its line wash (Paper Shade for tasks) to transparent over 900ms on cubic-bezier(0.23, 1, 0.32, 1).
- **Loading:** skeleton rows at the same 50px rhythm with a 1.4s shimmer.

### Status Mark
A 22px circle with a 2px ink ring. Pressing it fills ink and scales a 12px check in (200ms ease-out); hovering an open mark previews the check at 35%. Overdue marks ring red. Press scales to 0.9.

### Spend Strip
A month of day bars (72px tall, 2px gaps, 1px top corners) on a 1.5px ink baseline: Spend Line for spent days, red for days at or over threshold, Hairline Strong for empty days, Hairline for future days, and a 1.5px ink outline on today. A 12px tabular axis labels the first and last day.

### Quick Note and Toasts
- **FAB:** fixed 24px from the bottom right, 48px ink pill with a 20px pen icon and "Quick note" label, Pop shadow, scale 0.96 on press.
- **Popover:** 360px paper panel, Hairline Strong border, 10px corners, Pop shadow; opens from the FAB's corner over 180–220ms ease-out (scale 0.96 and 6px rise), closes faster (120–140ms). Holds a textarea, a ⌘/Ctrl + Enter hint in keycaps, and the three latest notes.
- **Toasts:** centred at the bottom, board navy (#26333f at night), 8px corners, 14px text with an optional Undo action button; rise 12px into place over 260ms, leave over 140ms. Error toasts turn signal red.

## Do's and Don'ts

### Do:
- **Do** set every dated list as a timetable: condensed tabular time, line badge, item, status at the right, 50px rows between 1px hairlines under a 1.5px ink head.
- **Do** cut a time-ordered list that spans the present with the 2px red NOW rule and its NOW HH:MM tag.
- **Do** rule every page head in 2px ink with the condensed title on the left and the live figure (clock, month, tools) on the right.
- **Do** show money in rupees with tabular figures, condensed or semi-condensed, and turn it red only at or over the user's threshold.
- **Do** keep capture one line away: the add bar on Today, Tasks and Expenses, the day-panel form on Calendar, and the quick-note FAB on every signed-in screen except Notes.
- **Do** design empty (ruled prose with a next action), loading (50px skeleton rows) and error (red callout with retry) states for every list.
- **Do** keep motion functional: 120–140ms state changes, 0.97 press scale, the 900ms row settle, and nothing else; collapse transforms under prefers-reduced-motion.
- **Do** build the night theme by swapping tokens on the same roles; components never restyle per theme.

### Don't:
- **Don't** build a greeting-plus-stat-cards dashboard or KPI tiles; figures sit on paper under a section label.
- **Don't** wrap content items in cards, shadows or tinted tiles; separate them with rules.
- **Don't** use signal red for a category, a brand accent, a chart series or decoration.
- **Don't** use a line colour for status, or a line badge for anything other than item type.
- **Don't** add a second typeface or a monospace for numbers; Archivo's widths and tabular figures carry them.
- **Don't** put board navy inside the content column.
- **Don't** add decorative motion such as looping effects, parallax or staged entrances.
