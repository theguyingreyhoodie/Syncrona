# Syncrona - Productivity App

Syncrona is a sleek, full-stack productivity web application designed with a premium, modern SaaS aesthetic. It provides users with a comprehensive suite of tools to manage their daily workflows, including tasks, notes, calendar events, and expenses.

##  Features

- **Today:** Your day set like a departures board: overdue and due tasks, events and today's payments in time order against a live "now" line, plus this month's spending and your latest notes. Add a task, event or expense in one line.
- **Task Management:** Create, track, and complete your daily to-dos.
- **Notes:** Jot down quick ideas from any screen with the Quick note button, or search and edit notes on the Notes page.
- **Calendar Integration:** Visual interactive calendar combining tasks, events, and conditionally highlighted expenses. It automatically aggregates total monthly costs and maps expenses to custom bracket thresholds (Low vs High cost highlighting).
- **Expense Tracking:** Monitor your spending natively synchronized with the calendar display.
- **Settings:** Theme (system, light or dark), the high-expense threshold, sign out, and a browser reset.
- **Light and dark themes:** Follows your system by default; toggle from the sidebar.
- **Authentication:** Secure user login and signup functionality handled dynamically across API base urls.

## Tech Stack

- **Frontend:** HTML, CSS (one stylesheet, design tokens as custom properties, Archivo variable font), vanilla JavaScript (`client/js/app.js` holds the shared shell, API client, theme, toasts and quick note; one script per page). No build step.
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Architecture:** Token-based Authentication

## Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine and a running instance of MongoDB.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/productivity-app.git
   cd productivity-app
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and configure your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Start the Node server:
   ```bash
   npm start
   ```

3. **Setup the Frontend:**
   Open a new terminal session, navigate to the client folder, and start a local web server. You can use the `serve` package:
   ```bash
   cd client
   npx serve .
   ```

4. **Open in Browser:**
   Navigate to the local URL provided by the `serve` command (usually `http://localhost:3000`).

   On localhost the client calls the API at `http://localhost:5000`. On macOS, AirPlay Receiver also listens on port 5000; if the API can't start there, run it on another port (`PORT=5001`) and point the client at it from the browser console: `localStorage.apiBase = "http://localhost:5001"`.

### Vercel Deployment

`vercel.json` serves `client/` as static files and runs the Express app in `server/` as a serverless function under `/api`. The client calls the API on the same origin, so no URLs need changing.

1. **Database:** create a free MongoDB Atlas cluster, add a database user, and under *Network Access* allow `0.0.0.0/0` (Vercel functions don't have fixed IPs). Copy the connection string and add a database name, e.g. `.../syncrona?retryWrites=true&w=majority`.
2. **Project:** on the [Vercel dashboard](https://vercel.com/new), import this GitHub repository. Leave *Framework Preset* as **Other** and the root directory as the repository root.
3. **Environment variables:** add `MONGO_URI` (the Atlas string) and `JWT_SECRET` (a long random string, e.g. from `openssl rand -hex 32`).
4. **Deploy.** Every push to `main` redeploys automatically. If the API answers `503`, check that `MONGO_URI` is set and that Atlas allows the connection.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License

This project is licensed under the MIT License.
