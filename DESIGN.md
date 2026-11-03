---
name: Syncrona
description: A calm personal home for one day, with soft stone panels holding real things to tick, add and read, and deep teal as the only colour that acts.
colors:
  ground: "#ffffff"
  panel: "#f3f5f4"
  panel-2: "#e9edeb"
  card: "#ffffff"
  card-line: "#e3e8e6"
  card-line-2: "#cfd6d3"
  ink: "#1b1f1e"
  ink-2: "#59615e"
  ink-3: "#636b68"
  accent: "#1b6e66"
  accent-hover: "#15584f"
  accent-ink: "#ffffff"
  accent-soft: "#dcefeb"
  accent-line: "#a9d3cc"
  red: "#b42318"
  red-soft: "#fdecea"
  toast: "#1b1f1e"
  toast-ink: "#f3f5f4"
  toast-action: "#8fd6cb"
  scrim: "rgba(16, 22, 20, 0.32)"
  dark-ground: "#0e1110"
  dark-panel: "#161a19"
  dark-panel-2: "#1f2422"
  dark-card: "#1c2120"
  dark-card-line: "#272d2b"
  dark-card-line-2: "#39413e"
  dark-ink: "#e9edeb"
  dark-ink-2: "#a5ada9"
  dark-ink-3: "#8f9894"
  dark-accent: "#5cc2b4"
  dark-accent-hover: "#7ad1c5"
  dark-accent-ink: "#062320"
  dark-accent-soft: "rgba(92, 194, 180, 0.15)"
  dark-accent-line: "rgba(92, 194, 180, 0.42)"
  dark-red: "#ff8a7e"
  dark-red-soft: "rgba(255, 138, 126, 0.13)"
  dark-toast: "#e9edeb"
  dark-toast-ink: "#0e1110"
  dark-toast-action: "#15584f"
  dark-scrim: "rgba(0, 0, 0, 0.55)"
typography:
  greeting:
    fontFamily: "Instrument Serif, ui-serif, Georgia, serif"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  auth-title:
    fontFamily: "Instrument Serif, ui-serif, Georgia, serif"
    fontSize: "46px"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  figure:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\" 1"
  headline:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  panel-title:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  row-title:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14.5px"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.5
    fontFeature: "\"tnum\" 1"
  axis:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"tnum\" 1"
rounded:
  panel: "22px"
  card: "12px"
  pill: "999px"
  control: "10px"
spacing:
  row-gap: "6px"
  inline: "8px"
  cell: "12px"
  gap: "16px"
  panel: "20px"
  head: "28px"
  greet: "36px"
  page-x: "40px"
  page-top: "44px"
  sidebar: "240px"
  column: "1100px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-ink}"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  button-ghost-hover:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "{colors.card}"
    textColor: "{colors.red}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  button-danger-hover:
    backgroundColor: "{colors.red-soft}"
    textColor: "{colors.red}"
  button-small:
    rounded: "{rounded.pill}"
    padding: "0 13px"
    height: "32px"
  icon-button:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    size: "32px"
  icon-button-hover:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0 14px"
    height: "40px"
  nav-item:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "34px"
  nav-item-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  nav-item-active:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
  nav-count:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "0 7px"
    height: "20px"
  nav-count-overdue:
    backgroundColor: "{colors.red-soft}"
    textColor: "{colors.red}"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  tile:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "16px 18px"
    height: "128px"
  tile-hover:
    backgroundColor: "{colors.panel-2}"
  row-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "9px 12px 9px 14px"
    height: "56px"
  time-pill:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "24px"
  time-pill-next:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
  time-pill-overdue:
    backgroundColor: "{colors.red-soft}"
    textColor: "{colors.red}"
  chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 7px"
    height: "20px"
  check:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.pill}"
    size: "22px"
  check-done:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  segmented:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "3px"
  segmented-selected:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 13px"
    height: "30px"
  day-line-track:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
    height: "54px"
  day-line-event:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    height: "22px"
  calendar-day:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "8px"
    height: "84px"
  calendar-day-today-number:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    size: "26px"
  toast:
    backgroundColor: "{colors.toast}"
    textColor: "{colors.toast-ink}"
    rounded: "{rounded.pill}"
    padding: "7px 7px 7px 18px"
    height: "44px"
  toast-error:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ground}"
  fab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "0 18px 0 15px"
    height: "46px"
  quick-note:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.panel}"
    padding: "16px"
    width: "380px"
---

# Design System: Syncrona

## Overview

**Creative North Star: "A Calm Home for One Day"**

Syncrona is a personal planner that reads like a quiet room rather than an office. A white page holds soft stone panels one step off white; inside the panels sit white row cards, each one a real thing you can tick, add or read. The page opens with a serif greeting and one sentence of fact about the day ("1 task overdue, and Finish portfolio case study draft at 17:00"), then four count tiles, then the Today panel with the day line, its signature. Every other screen (tasks, calendar, expenses, notes, settings) is built from the same panels and rows, so the product feels like one place.

Depth is tonal, not cast. Three grounds (page, panel, card) do all the layering, and nothing at rest carries a shadow. Colour is nearly absent: a cool grey-green neutral family and one deep teal that marks every action, every selection and the day's own data. Red appears only when something is late or over the limit, or when something has gone wrong. Density is comfortable desktop-app density (14px body, 56px rows, 16px gutters) in the Linear, Things and Raycast register, with Instrument Sans throughout and Instrument Serif for a single line of greeting.

The world refuses the spreadsheet. Lists are stacks of separate row cards with 6px between them, never ruled tables; the calendar is a grid of separate cards, never a ruled month; numbers are tabular figures inside rows, never columns of cells.

**Key Characteristics:**
- White page, stone panels, white row cards: three grounds, no shadows at rest.
- Deep teal is the only hue that acts or marks today's data; red only for late, over-limit and error.
- Instrument Sans for everything; Instrument Serif for the greeting and auth titles alone.
- Three radii: 22px panels, 12px row cards, full pills on controls.
- Centred 1100px column on a 12-column, 16px-gap grid beside a 240px labelled sidebar.
- The day line: 06:00 to midnight, teal event pills, task rings, a live now marker and the day's spend at its end.
- Motion is press-scale and a quick settle; nothing performs an entrance.

## Colors

A cool, nearly colourless grey-green neutral family carries everything; one deep teal does all the acting, and one brick red flags only what is late, over the limit or broken. Every light token has a dark counterpart (the `dark-*` keys), applied by `prefers-color-scheme: dark` unless the user has chosen light, or forced by the theme toggle.

### Primary
- **Deep Lagoon Teal** (`accent`; dark: `dark-accent`, a lifted aqua): the only hue that acts. Primary buttons, the checked task box, the today number in the calendar, the selected calendar day's ring, the now marker and now label on the day line, spend bars on ordinary days, focus outlines, the text caret, the "Saved" confirmation, the brand mark and the avatar initial.
- **Lagoon Deep** (`accent-hover`): primary button hover. In dark mode it reappears as the toast's action text on the light toast.
- **Lagoon Wash** (`accent-soft`) and **Lagoon Edge** (`accent-line`): the soft teal ground and inset edge for the day line's event pills, the "next up" time pill, the sidebar task count, the input focus ring, search highlights in notes and text selection.
- **On Teal** (`accent-ink`): text and tick on solid teal.

### Secondary
- **Brick Red** (`red`; dark: `dark-red`, a soft coral) with **Red Wash** (`red-soft`): overdue tasks (check ring, sub line, time pill, group head and its chip, sidebar count when any are late), payments at or over the user's threshold (amount text, bar, cell total, tile figure), and in chrome only errors and destruction: invalid inputs, form errors, the error callout, the error toast, the danger button and the delete icon's hover.

### Neutral
- **White Ground** (`ground`): the page and the sidebar.
- **Cool Stone** (`panel`): every panel and tile, the composers, the search field at rest, the past portion of the day line, plain time pills and the nav hover.
- **Deeper Stone** (`panel-2`): the active nav pill, tile hover, segmented control track, ghost and icon button hover, zero-spend bars, skeletons, keyboard keys.
- **Card White** (`card`): row cards, insets, inputs, calendar cells, note previews, the quick-note popover, chips inside panels.
- **Card Line** (`card-line`) and **Card Line Strong** (`card-line-2`): the 1px card border, then the stronger border on hover, on inputs and secondary buttons, on the empty check ring and on dashed empty states.
- **Ink** (`ink`), **Ink Soft** (`ink-2`), **Ink Faint** (`ink-3`): primary text; secondary text, sub lines and labels; placeholders, axis labels, kind icons and the past-day count.
- **Toast Night** (`toast`, `toast-ink`, `toast-action`): the inverted toast and its mint action. In dark mode the toast inverts to light.
- **Scrim** (`scrim`): behind the mobile navigation sheet.

### Named Rules
**The One Teal Rule.** Teal is the only chromatic hue on the page. If it is teal, it can be pressed, it is selected, or it is today's data. Never use it as decoration, never introduce a second accent.

**The Red Means Late Rule.** In data, red marks exactly two things: a task past its due day, and a payment at or over the user's threshold. Nothing else in the data is red; in chrome, red is reserved for errors and destructive actions.

**The Three Grounds Rule.** Depth is the step from white page to stone panel to white card. A new surface takes one of those three grounds; it does not invent a fourth tint.

## Typography

**Display Font:** Instrument Serif (with ui-serif, Georgia)
**Body Font:** Instrument Sans, variable 400–700 (with ui-sans-serif, system-ui, -apple-system, Segoe UI)

**Character:** A plain, slightly narrow grotesque does all the work at small, quiet sizes; one condensed old-style serif line at the top says hello. The serif is the warmth, the sans is the tool.

### Hierarchy
- **Greeting** (Instrument Serif 400, 52px, 1.02; 38px under 900px): "Good afternoon, Asha." on Today only. The date and fact line beneath it is 16px Ink Soft with the fact in Ink 500.
- **Auth title** (Instrument Serif 400, 46px, 1.02): "Welcome back" and the sign-up title; the auth preview's sample greeting uses the same face at 38px.
- **Figure** (Sans 400, 34px, 1.1, -0.02em, tabular): tile values and the spend total; 28px on phones, 26px for the calendar month total, 24px in the auth preview tiles. Large numbers stay regular weight.
- **Headline** (Sans 600, 30px, 1.1, -0.025em; 26px under 900px): page titles such as Tasks, Expenses, November 2026.
- **Title** (Sans 600, 20px, -0.015em): the calendar's selected-day heading.
- **Panel title** (Sans 600, 15px, -0.005em): every panel head and the quick-note head.
- **Row title** (Sans 500, 14.5px): the title line of a row card and its amount.
- **Body** (Sans 400, 14px, 1.5): default text, buttons, inputs, nav. Notes read at 15px, 1.55.
- **Label** (Sans 500, 13px): tile labels, group heads (600), field labels, sub lines (400), panel links and meta.
- **Caption** (Sans 500, 12.5px, tabular): time pills, legends, hints, note footers.
- **Axis** (Sans 400, 11.5–12px, tabular): day-line hours, bar-chart axis, calendar overflow.

### Named Rules
**The One Line of Serif Rule.** Instrument Serif sets the greeting on Today and the titles on login and sign-up, nothing else. No serif panel titles, no serif numbers.

**The Tabular Figures Rule.** Every time, amount, count and date is set with tabular numerals so columns of rows align without becoming a table.

## Layout

A 240px labelled sidebar sits on the page ground with a 1px card-line edge. The main area centres a 1100px column (max-width 1180px including 40px side padding; 44px top, 120px bottom to clear the floating button). Inside the column is a 12-column grid with a 16px gap; consecutive grids are 16px apart. Today composes as four 3-column tiles; a 9-column Today panel beside a 3-column stack (Add, then Notes); then Next 7 days and Spending at 6 + 6. Expenses mirrors this with four tiles, a chart panel and a log panel. Settings uses a 5/7 label-and-panel split with 32px rows.

Inside panels: 20px padding, 14px under the panel head, 6px between row cards, 18px above a group head. Tiles are at least 128px tall with the figure pushed to the bottom.

Responsive: at 1180px padding tightens to 28px and the Today side stack drops below the Today panel as a two-up split. At 900px the sidebar becomes a slide-in sheet behind a 52px sticky top bar (menu, centred page title, theme), the grid collapses to one column with tiles two-up, and auth drops its preview. At 640px panels go to 16px padding and 20px radius, the split stacks, composer fields wrap, segmented and month controls stretch full width, calendar cells shrink to 54px with dot counts only, and the Quick note button collapses to a 52px round icon.

**The Centred Column Rule.** Content never runs edge to edge on desktop; it sits in the 1100px column, and every panel snaps to the 12-column grid.

## Elevation & Depth

Flat by default. Surfaces at rest have no shadow; hierarchy comes from the three grounds and a 1px card border. Rings (focus, selected calendar day, selected segment, the today bar) are drawn with spread-only box-shadows and read as outlines, not lift. Only things that float above the page lift, and they share one soft two-layer shadow (`--float`): the Quick note button, the quick-note popover, toasts and the mobile navigation sheet.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 18px 40px -12px rgba(16, 28, 25, 0.22), 0 3px 8px rgba(16, 28, 25, 0.06)`; dark: `0 18px 44px -12px rgba(0, 0, 0, 0.7), 0 3px 8px rgba(0, 0, 0, 0.35)`): floating layers only.
- **Focus ring** (`box-shadow: 0 0 0 3px var(--accent-soft)` with an accent border): inputs and the notes composer; invalid swaps both to red.

### Named Rules
**The Only Floating Things Lift Rule.** If it scrolls with the page, it has no shadow. A shadow means the thing is above the page and can be dismissed.

## Shapes

Soft, generous corners in three sizes: 22px on panels, tiles and the quick-note popover; 12px on row cards, inputs, calendar cells, the day-line track and insets; full pills on every control (buttons, segmented control, time pills, chips, counts, toasts, month and calendar switchers, the search field). Smaller interactive pills inside the sidebar and icon buttons use 10px. Circles are reserved for the task check, the avatar and data dots. Borders are 1px; the check ring is 1.5px; the day-line task ring is 2px. Empty states use a 1px dashed strong card line.

**The Three Radii Rule.** Panel 22, card 12, control pill. A new component picks one by what it is, not by how big it is.

## Components

### Buttons
- **Shape:** full pill (999px), 38px tall, 16px side padding; small is 32px with 13px padding and 13px text; auth and composers use 40–44px.
- **Primary:** solid Deep Lagoon Teal with On Teal text, 14px weight 500, optional 16px leading icon ("+ Add task", "Log payment", "Sign in").
- **Secondary:** card white with a strong card-line border; hover darkens the border to Ink Faint.
- **Ghost:** transparent, Ink Soft; hover fills Deeper Stone.
- **Danger:** card white, red text; hover fills Red Wash with a red border.
- **Busy:** label goes transparent and a 16px spinning ring (600ms linear) sits in its place.
- **Press:** `scale(0.97)` over 140ms on the ease-out curve. Disabled is 50% opacity.
- **Icon button:** 32px square at 10px radius (40px in the mobile top bar), Ink Soft, hover fills Deeper Stone, press `scale(0.92)`; the delete variant hovers Red Wash.

### Chips and Pills
- **Time pill:** 24px pill on stone, 12.5px tabular 500, holding "15:00" or "All day". The next timed item today goes Lagoon Wash with teal text; an overdue task's date pill goes Red Wash with red text.
- **Count chip:** 20px pill beside a group head; card white with Ink Soft text, red on red wash for Overdue.

### Cards / Containers
- **Panel:** Cool Stone, 22px radius, 20px padding, no border, no shadow. Head row: panel title left, then meta ("3 to go · 1 done") or a quiet link ("All notes", "Calendar") pushed right.
- **Tile:** a panel at 128px minimum height, 13px label at top, 34px regular figure at the bottom, 13px caption that may carry a red overdue or over-limit fragment. Linked tiles hover to Deeper Stone.
- **Inset:** card white, 1px card line, 12px radius, 16px padding; frames the bar chart.
- **Empty state:** card white with a dashed strong border, a 15px bold first line and a sentence pointing at the next action.
- **Error callout:** Red Wash, 12px radius, alert icon in red, bold headline, then a small "Try again" button.

### Row Cards (the list item)
- **Structure:** a white 56px-minimum card with a 1px card-line border and 12px radius, 9px 12px 9px 14px padding, 12px gap. Left to right: a 22px lead (the check for tasks, a 17px teal calendar glyph for events, a 17px Ink Faint rupee glyph for payments); the main block with a 14.5px 500 title and a 13px Ink Soft sub line ("Due in 38 min", "Overdue · due 2 days ago", "Payment · at or over your ₹500 limit"); the end slot with a time pill or a 14.5px tabular amount (red when over the limit).
- **States:** hover strengthens the border; done strikes the title through in Ink Soft; timed items already past go Ink Soft; new rows arrive with the settle.
- **Hover actions:** on pointer devices, delete and edit icon buttons sit absolutely at the right edge on a card-white backing, hidden until the row is hovered or focused within. Touch devices show them inline.
- **Groups:** rows stack 6px apart under 13px 600 group heads ("Overdue", "Tomorrow 4 Nov", "Today · Tue 3 Nov") with an optional right-aligned total.

### Check
A 22px circle with a 1.5px strong card-line ring on card white. Hover turns the ring teal; pressed it scales to 0.88. Checked fills teal and the 12px tick (stroke 3) scales from 0.6 to 1 over 200ms. Overdue tasks get a red ring.

### Inputs / Fields
- **Style:** 40px, card white, 1px strong card-line border, 12px radius, 14px side padding; placeholders in Ink Faint. Textareas grow from 96px. Money inputs carry a "₹" prefix.
- **Focus:** border goes teal with a 3px Lagoon Wash ring; the caret is teal.
- **Error:** border and ring go red; a 13px red message sits below.
- **Composer row:** on Tasks and Expenses, fields sit borderless inside a 20px-radius stone strip with the primary button at the end; they wrap on phones.
- **Search:** a pill field on stone with a leading 16px icon; on focus it turns card white.

### Segmented Control
A Deeper Stone pill track with 3px padding holding 30px pill segments in 13px 500 Ink Soft. The selected segment is card white with Ink text and a 1px card-line ring; an optional tabular count follows the label. Used for Task / Event / Expense in Add and for Open / Done / All on Tasks.

### Navigation
- **Sidebar:** the teal mark and "Syncrona" at 16px 600, then "Asha's planner" in Ink Soft, then six 34px items (17px icon, 14px label) at 10px radius. Hover fills Cool Stone; the current page is a Deeper Stone pill in Ink 500. Tasks carries a teal-wash count of open tasks due today or overdue, which turns red when any are overdue. The foot holds the theme toggle and a user row (30px teal-wash avatar, name, email, sign-out) above a 1px rule.
- **Mobile:** under 900px a 52px sticky top bar (menu, centred page title, theme) replaces the sidebar; the sidebar becomes a sheet up to 320px wide (86vw) sliding in from the left over a scrim, with 42px items, closing on scrim tap or Escape.

### The Day Line (signature)
A 54px card-white track with 12px radius spanning 06:00 (or the earliest timed item) to midnight. The past is shaded Cool Stone up to a 2px teal now marker; faint 1px card-line ticks mark every three hours. Timed events sit on the upper lane as 22px teal-wash pills with a teal inset edge and 12px 600 titles, each clipped before the next event; past events turn grey. Timed tasks sit on the lower lane as 14px rings (Ink ring; teal fill when done; red ring when overdue). Below, an 11.5px tabular axis with the current time in teal 600, then a legend ending in the day's spend total ("₹1,420 spent today", red if any payment is over the limit). Payments carry no time and never sit on the track. Under 560px events collapse to 18px swatches and the axis steps every six hours. The track is one image with a full text summary for screen readers.

### Spend Chart
Daily bars in a 96px (150px on Expenses) inset, 3px apart, at most 28px wide, 4px top radius, on a square-root scale. Ordinary days are teal, days with a payment at or over the threshold are red, zero days are a 3px Deeper Stone stub, future days are stone. Today carries a two-ring outline. When one day dwarfs the rest it is drawn clipped: a card-coloured diagonal cut near the top and its value written above in 11px 600. Beneath, a "Largest payments" mini list in the row-card style.

### Calendar Cells
A 7-column grid of separate 84px card-white cells, 6px apart, 12px radius, 8px padding. The date sits in a 26px pill (solid teal for today); days outside the month lose their card. Each cell shows dot-and-count pairs (teal dot for events, Ink Faint dot for tasks, greyed when all done) and the day's spend total bottom right in tabular 12px (red when over the limit). The selected day gets a teal border with an inset teal ring. On phones cells shrink to 54px and show dots only, plus an Ink or red spend dot.

### Toasts
A centred pill near the bottom: 44px, inverted (Toast Night with light text; light in dark mode), Float shadow, optional mint "Undo" action button. Errors are solid red. Toasts enter from 12px below at 0.98 scale over 240ms, leave in 150ms, and pause their timer on hover. Deletes are undoable for five seconds before reaching the server.

### Quick Note
A dark Ink pill button fixed bottom right (46px, pen icon and "Quick note"; a 52px circle on phones) on every signed-in screen except Notes. It opens a 380px card-white popover with a 22px radius and the Float shadow, scaling from its bottom-right corner (`transform-origin: bottom right`) from 0.96 and 6px down over 200ms. It holds a textarea, a "⌘ Enter to save" hint with key caps, a small primary Save, and the three latest notes. Escape or an outside press closes it.

### Motion
- **Curve:** one ease-out, `cubic-bezier(0.23, 1, 0.32, 1)`, for presses, checks, settles, the popover and toasts; the mobile sheet uses a drawer curve, `cubic-bezier(0.32, 0.72, 0, 1)`, at 300–320ms.
- **Durations:** 150ms for colour and border hovers, 140–200ms for presses and checks, 280ms for the settle, 600ms for the busy spinner.
- **Press scale:** buttons 0.97, Quick note 0.96, icon buttons 0.92, check 0.88.
- **Settle:** newly created rows fade in from 6px below over 280ms. Nothing else animates on arrival.
- **Hover gating:** every hover rule sits inside `@media (hover: hover)`, so touch never sticks.
- **Reduced motion:** `prefers-reduced-motion: reduce` collapses every animation and transition to near zero.

**The Press and Settle Rule.** Motion answers the user's own action: a press scales, a check fills, a new row settles. Nothing performs an entrance on page load.

## Do's and Don'ts

### Do:
- **Do** build every new screen from the same three grounds: white page, stone panel (22px), white row cards (12px) inside it.
- **Do** use teal for the one primary action per area, for selection, and for today's data; keep everything else neutral.
- **Do** use red only for overdue tasks, payments at or over the threshold, errors and destructive actions.
- **Do** show lists as row cards with a lead, a title, a sub line and an end slot, 6px apart, with actions revealed on hover.
- **Do** set times, amounts, counts and dates in tabular figures, with amounts in rupees (₹).
- **Do** keep controls as full pills (buttons 38px, segments 30px, time pills 24px).
- **Do** gate hover styles behind `(hover: hover)`, give presses a 0.97 scale on the ease-out curve, and respect reduced motion.
- **Do** design empty, loading (skeleton rows) and error (callout with Try again) states for every list.

### Don't:
- **Don't** put a shadow on anything that scrolls with the page; only the Quick note button, its popover, toasts and the mobile sheet lift.
- **Don't** use gradients anywhere.
- **Don't** lay data out as a ruled table or spreadsheet grid; separate cards replace ruled rows and cells. Hairlines are kept for the sidebar edge, the user-row and settings separators, and the day line's three-hour ticks.
- **Don't** introduce a second accent hue or use teal as decoration.
- **Don't** use Instrument Serif outside the greeting and the auth titles.
- **Don't** set large figures bold; tile figures and totals stay at weight 400.
- **Don't** put payments on the day line's track; they have no time and live in the legend total and the rows.
