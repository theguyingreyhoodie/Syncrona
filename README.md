# Syncrona - Productivity App

Syncrona is a sleek, full-stack productivity web application designed with a premium, modern SaaS aesthetic. It provides users with a comprehensive suite of tools to manage their daily workflows, including tasks, notes, calendar events, and expenses.

##  Features

- **Dashboard:** Get a quick overview of your pending tasks, recent notes, and upcoming calendar events.
- **Task Management:** Create, track, and complete your daily to-dos.
- **Notes:** Jot down quick ideas via the floating action button or manage detailed notes on the dedicated page.
- **Calendar Integration:** Visual interactive calendar combining tasks, events, and conditionally highlighted expenses. It automatically aggregates total monthly costs and maps expenses to custom bracket thresholds (Low vs High cost highlighting).
- **Expense Tracking:** Monitor your spending natively synchronized with the calendar display.
- **Dedicated Settings Hub:** Centralized configuration panel to define your Expense bracket thresholds globally, securely reset local diagnostics, and manually toggle thematic preferences.
- **Elegant Theme Toggle:** Seamlessly switch between a crisp light mode and a deep immersive dark mode, with your preference saved automatically.
- **Authentication:** Secure user login and signup functionality handled dynamically across API base urls.

## Tech Stack

- **Frontend:** HTML5, CSS3 (Custom Modern SaaS UI with CSS Variables), Vanilla JavaScript
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
   Navigate to the local URL provided by the `serve` command (usually `http://localhost:3000`) and enjoy!

### Vercel Deployment

This application comes pre-configured with `vercel.json` routing logic out of the box.

1. Create a project on your [Vercel Dashboard](https://vercel.com/dashboard) linked directly to your GitHub repository.
2. The internal logic has already been tailored to natively export the Express app as a Serverless function.
3. Import your environment variables (`MONGO_URI`, `JWT_SECRET`) directly into the Vercel project configuration natively.
4. Deploy! Your API urls will dynamically execute gracefully under relative environments natively.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License

This project is licensed under the MIT License.
