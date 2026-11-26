# Triad Arena — REST API Specification

All API endpoints return standard JSON responses in the unified format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
```
Or upon error:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive message",
    "details": null
  }
}
```

---

## Authentication & User Routes

### `POST /api/auth/sync`
Synchronizes the authenticated Firebase user with the MongoDB database.
- **Headers**: `Authorization: Bearer <firebase_id_token>`
- **Request Body**:
  ```json
  {
    "username": "NeonGladiator",
    "avatar": "avatar_01"
  }
  ```
- **Response**: Full `User` profile object.

### `GET /api/users/profile`
Retrieves the logged-in player's profile, stats, level, and Elo rating.
- **Headers**: `Authorization: Bearer <firebase_id_token>`

### `PATCH /api/users/profile`
Updates username, avatar, or bio.
- **Request Body**: `{ "username": "NewName", "avatar": "avatar_04", "bio": "Top 100 contender." }`

### `GET /api/users/:username`
Public profile information for any player.

---

## Dashboard & Stats Routes

### `GET /api/dashboard`
Aggregated dashboard payload for fast single-round-trip rendering.
- **Response Data**:
  - `profile`: User object with XP, level, rating, rank title.
  - `stats`: Wins, losses, draws, win rate %, current streak, best streak.
  - `recentMatches`: Last 10 matches.
  - `dailyMissions`: 3 active daily missions with progress.
  - `upcomingTournaments`: Open registration tournaments.
  - `performanceHistory`: Array of last 20 match ratings for chart display.

---

## Solo Game Mode Routes

### `POST /api/solo/start`
Initializes a server-validated Solo game against AI.
- **Request Body**:
  ```json
  {
    "difficulty": "easy" | "medium" | "hard",
    "bestOf": 3 | 5 | 7
  }
  ```
- **Response**: `{ "matchId": "...", "bestOf": 3, "targetScore": 2 }`

### `POST /api/solo/move`
Submits player move, triggers AI move generation, and calculates round outcome.
- **Request Body**:
  ```json
  {
    "matchId": "...",
    "roundNumber": 1,
    "move": "rock" | "paper" | "scissors"
  }
  ```
- **Response**:
  ```json
  {
    "roundNumber": 1,
    "playerMove": "rock",
    "aiMove": "scissors",
    "outcome": "win",
    "scores": { "player": 1, "ai": 0 },
    "isMatchOver": false,
    "xpAwarded": 0
  }
  ```

---

## Leaderboard & Seasons Routes

### `GET /api/leaderboard`
- **Query Params**:
  - `season`: `current` | `all-time` | `<seasonNumber>`
  - `page`: default `1`
  - `limit`: default `25` (max `100`)
  - `search`: optional username search query
- **Response**:
  ```json
  {
    "players": [
      {
        "rank": 1,
        "username": "CyberStriker",
        "avatar": "avatar_09",
        "rating": 1845,
        "level": 34,
        "winRate": 74.2,
        "matchesPlayed": 128
      }
    ],
    "pagination": { "page": 1, "totalPages": 4, "totalPlayers": 98 }
  }
  ```

---

## Tournament Routes

### `GET /api/tournaments`
Returns active, upcoming, and past tournaments.

### `POST /api/tournaments` (Organizer/Admin only)
Creates a new single-elimination tournament.
- **Request Body**:
  ```json
  {
    "title": "Neon Blitz Championship",
    "maxParticipants": 8,
    "bestOf": 3,
    "prizePoolVirtual": 5000,
    "startsAt": "2026-12-01T18:00:00Z"
  }
  ```

### `GET /api/tournaments/:id`
Retrieves tournament details, participants, and full bracket tree.

### `POST /api/tournaments/:id/register`
Registers the authenticated user for the tournament.

### `POST /api/tournaments/:id/unregister`
Cancels user registration before the tournament starts.

---

## Rooms & Private Matches

### `POST /api/rooms/create`
Creates a private room with a 6-character code.
- **Request Body**:
  ```json
  {
    "bestOf": 3,
    "password": "optionalPassword",
    "turnTimerSec": 10
  }
  ```
- **Response**: `{ "roomCode": "X7K9P2", "shareUrl": "https://triadarena.com/room/X7K9P2" }`

### `POST /api/rooms/join`
- **Request Body**: `{ "roomCode": "X7K9P2", "password": "optionalPassword" }`

---

## Missions & Achievements

### `GET /api/missions/daily`
Fetches the 3 daily missions for the player (resets 00:00 UTC).

### `POST /api/missions/:id/claim`
Claims virtual coins and XP from a completed daily mission.

### `GET /api/achievements`
Fetches all 15+ achievements and flags unlocked status for the player.
