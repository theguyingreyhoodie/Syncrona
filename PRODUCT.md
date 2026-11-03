# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary audience is people evaluating the author's work (recruiters, clients) through a live demo. The product itself must behave as a real personal planner, so the in-app user is one individual organising their own day: tasks, notes, events and spending.

## Product Purpose
Syncrona is a personal productivity suite: tasks, notes, calendar events and expenses in one signed-in workspace. Success means a viewer opening the demo immediately understands what it does and can use every feature without anything feeling broken or placeholder.

## Positioning
Tasks, events and expenses meet on one calendar. A day shows what you have to do, what is happening, and what you spent, and the month carries a running spend total with per-expense highlighting against a user-set threshold.

## Operating Context
Desktop browser first (demo setting), but must work on a phone. Single user per account; no sharing or collaboration.

## Capabilities and Constraints
- Screens: login, signup, dashboard, tasks, notes, calendar, expenses, settings.
- Data (MongoDB via Express REST API under `/api/*`, JWT bearer auth): Task {title, completed, dueDate?}, Note {content}, Event {title, date}, Expense {title, amount, date}. All have createdAt. The API supports list, create, delete; tasks also update `completed`. No editing of notes, events or expenses exists server-side.
- Settings: theme (light/dark, stored locally) and a high-expense threshold (stored locally, default 500).
- Currency is Indian rupees (₹) throughout.
- Frontend stays vanilla HTML/CSS/JS with no build step, deployed as static files on Vercel alongside the Node API (`vercel.json`). The backend is out of scope for the redesign.

## Brand Commitments
Name: Syncrona. No logo asset exists (current mark is a plain coloured square); no binding colours, fonts or voice.

## Evidence on Hand
No real user data, testimonials, metrics or screenshots exist. Do not fabricate usage numbers or claims.

## Product Principles
- Every number on screen is real data from the account, never filler.
- One place for the day: the calendar is the product's centre of gravity.
- Demo-ready means finished: empty, loading and error states are designed, not afterthoughts.
- Fast to capture: adding a task, note or expense is never more than one step away.
