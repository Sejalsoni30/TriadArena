# ⚡ Triad Arena
> **Think Fast. Play Smart. Win Big.**

Triad Arena is a production-grade, real-time competitive Rock-Paper-Scissors platform featuring an authoritative server, zero-snooping commit-reveal encryption, AI with Markov chain sequence prediction, 1v1 ranked matchmaking, private rooms, single-elimination tournament brackets, and comprehensive progression.

---

## 🏛️ System Architecture & Principles

1. **Server-Authoritative Truth**: All game outcomes, round evaluations, Elo rating calculations, and XP allocations are executed strictly on the server. The client never submits outcomes.
2. **Cryptographic Commit-Reveal Protocol**: During a round, each combatant submits their move directly to the server. The server stores this secretly and only alerts the opponent that the other player has **Locked In**. Moves are revealed simultaneously only after both players lock or the 10-second timer expires.
3. **Resilience & Reconnection**: Includes a 45-second reconnect grace window. If a mobile or Wi-Fi connection drops, refreshing or re-opening the match restores the synchronized game state snapshot.
4. **Pure Virtual Economy**: Virtual points ("Triad Credits") and XP only. No real money, gambling, or betting.

```
triad-arena/
├── client/              # React, Vite, Tailwind CSS, Framer Motion, Zustand
│   ├── src/components/  # Button, Card, Modal, Toast, Input, Tabs, Avatar, etc.
│   ├── src/pages/       # Landing, HowToPlay, Dashboard, Play, Solo, Lobby, Room, Tournaments
│   └── src/store/       # Zustand client stores
├── server/              # Node.js, Express, Socket.IO, Mongoose, Zod
│   ├── src/models/      # User, Match, Room, Tournament, Achievement, Mission, Season
│   ├── src/services/    # GameEngine, ProgressionService, TournamentService, MissionService
│   ├── src/sockets/     # Real-time commit-reveal Socket.IO gateway
│   └── tests/           # Integration tests
├── shared/              # Shared constants, types, pure game rules, Elo, Markov AI
│   └── src/rules.test.ts
├── docs/                # architecture.md, api.md, socket-events.md, game-rules.md
├── .github/workflows/   # Automated CI pipeline
├── .env.example         # Environment template
└── README.md
```

---

## 🚀 Quick Start Guide (< 10 Minutes)

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- Optional: Local MongoDB or MongoDB Atlas URI (if omitted, server automatically operates with in-memory sample/test mode).

### 1. Clone & Install
```bash
git clone https://github.com/your-org/triad-arena.git
cd triad-arena
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` in the root (or server):
```bash
cp .env.example .env
```
*(Default settings work out-of-the-box for local testing without requiring external credentials).*

### 3. Run the Test Suite
Verify that all unit and integration tests across shared, server, and client pass:
```bash
npm test
```

### 4. Build the Packages
```bash
npm run build
```

### 5. Launch Development Servers
Run both client and server concurrently:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API & WebSockets**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🌐 Deployment Architecture

### ⚠️ Critical WebSocket Deployment Notice
> **DO NOT deploy the Backend on Vercel Serverless Functions.**
> Serverless functions (like AWS Lambda or standard Vercel serverless API routes) terminate persistent TCP WebSocket connections. 
> Socket.IO requires a stateful, long-lived host with support for persistent WebSockets.

### Recommended Deployment Setup:
- **Frontend (Client)**: Deploy to **Vercel** or **Cloudflare Pages**.
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variables: `VITE_API_URL=https://your-backend.railway.app/api`, `VITE_SOCKET_URL=https://your-backend.railway.app`
- **Backend (Server)**: Deploy to **Railway**, **Render**, or **Fly.io**.
  - Persistent Node.js container with full WebSocket and CORS support.
  - Environment variables: `PORT=5000`, `NODE_ENV=production`, `CLIENT_URL=https://your-app.vercel.app`, `MONGODB_URI=mongodb+srv://...`

---

## 🎮 Game Modes & Artificial Intelligence

### 1. Solo Mode (AI Challenges)
- **Easy**: Uniform random distribution ($P = 1/3$).
- **Medium (Frequency Counter)**: Identifies player's most frequent move and counters it with 70% probability.
- **Hard (Markov Chain Predictor)**: Maintains a 1st-order transition matrix $M_{3 \times 3}$ tracking $P(\text{Move}_t \mid \text{Move}_{t-1})$. Predicts the sequence counter with 80% probability, leaving 20% random exploration to stay beatable and human.

### 2. Ranked 1v1 Matchmaking
- Queue pools players and widens Elo search bracket by $\pm 15$ every 4 seconds.
- Turn timer: 10 seconds. Auto-assignment or forfeit if timer expires.
- Authoritative Elo rating calculation with provisional scaling ($K=32$ for $<30$ matches, $K=24$ for rating $<1600$, $K=16$ for $\ge 1600$).

### 3. Private Custom Rooms
- Unguessable 6-character room codes (e.g. `X7K9P2`).
- Shareable direct link (`/room/:code`).
- Configurable Best of 3, 5, or 7 series with host controls.

### 4. Championship Tournaments
- Single-elimination knockout brackets (powers of two: 4, 8, 16).
- Automated winner advancement to next round until champion is crowned.
- Virtual prize pool awards and tournament winner trophies.

---

## 🛡️ Anti-Abuse & Security Controls

- **Idempotency Keys**: Match resolution uses `idempotencyKey: match_end:<matchId>` with unique database index to prevent duplicate XP or rating awards.
- **Rate Limiting**: Express rate limiters protect endpoints against brute force and abuse.
- **Helmet & CORS**: Strict header security and allowlisted client origins.
- **Zero Client Snooping**: Opponent's move is strictly withheld until both players have committed.

---

## 📋 Launch Readiness Checklist

- [x] Server single source of truth for all game rules and rankings
- [x] Zero move snooping verified via commit-reveal state machine
- [x] 45-second reconnection grace period implemented
- [x] No fake backend; sample data clearly labelled `[Sample]` or `@sample.triad.io`
- [x] 15+ built-in achievements and daily missions with 00:00 UTC reset
- [x] Dark futuristic design system with WCAG AA contrast and `prefers-reduced-motion`
- [x] Responsive mobile-first layout tested across 360px, 768px, 1280px, and 1920px
- [x] Full test suites passing across all workspaces (`shared`, `server`, `client`)
- [x] CI workflow configured for GitHub Actions
- [x] Deployment instructions clearly distinguishing Vercel (frontend) from persistent WebSocket hosts (backend)

---

## 📜 License
MIT License. Built for competitive excellence.
