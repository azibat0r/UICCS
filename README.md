PathToSWE

A platform for CS students to find internships and stay accountable on coding interview prep — together. Internship listings are pulled automatically from multiple sources and deduplicated into one feed. Study groups verify your LeetCode or NeetCode activity automatically, so accountability isn't on the honor system.

Live at: pathtoswe.netlify.app

Features
Auto-aggregated internship feed — pulls listings from multiple independently-maintained GitHub sources, merges and deduplicates them by company + role (so a job posted per-office doesn't show up multiple times), refreshed automatically every hour
Study groups with real accountability — link a LeetCode username or a NeetCode GitHub-sync repo (or both); the backend checks every 5 minutes for new solved problems using LeetCode's public GraphQL API and GitHub's REST API, no manual check-ins
Activity feed & streaks — a chat-style feed of every group member's verified submissions, a weekly streak strip, and a full monthly calendar view, all scoped to activity since each member joined
Full authentication — email/password with bcrypt-hashed passwords and JWT sessions via httpOnly cookies; duplicate-account protection so two people can't track the same LeetCode/GitHub account
Profile management — editable username, LinkedIn/GitHub/personal website links, past/current companies, and account deletion that cleanly removes group memberships and submission history
Impact survey — a short in-app survey that generates real, aggregate usage metrics (not estimates) for reporting on the project's actual impact
Tech Stack
Layer	Tech
Frontend	React 19, Vite, Tailwind CSS v4, React Router
Backend	Node.js, Express
Database	MongoDB Atlas (Mongoose)
Auth	JWT (httpOnly cookies) + bcryptjs
Scheduling	node-cron (hourly internship sync, 5-minute submission checks)
External APIs	LeetCode GraphQL (public), GitHub REST API
Email	Resend
Hosting	Netlify (frontend), Railway (backend)
Getting Started
Prerequisites
Node.js 18+
A MongoDB Atlas cluster (or local MongoDB instance)
A Resend account and API key (for email features)
Environment Variables

server/.env

MONGO_URL=your_mongodb_connection_string
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=a_long_random_string
RESEND_API_KEY=your_resend_api_key

client/.env

VITE_API_URL=http://localhost:4000
Install & Run
bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

Run both simultaneously in separate terminals:

bash
# Terminal 1 - server (runs on :4000)
cd server
npm run dev

# Terminal 2 - client (runs on :5173)
cd client
npm run dev

Then open http://localhost:5173.

Architecture Notes
Deduplication — internship listings from multiple feeds are merged by a normalized company::title key, combining locations from every source into a single entry rather than showing duplicates.
Cross-domain auth — the frontend (Netlify) and backend (Railway) run on separate domains. Since browsers increasingly block third-party cookies, all /api/* requests are proxied through the frontend's own domain via Netlify redirects, making the session cookie first-party.
Graceful degradation — LeetCode and GitHub submission checks run independently; if one API fails, the other still works.
License

ISC
