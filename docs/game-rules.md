# Triad Arena — Game Rules, Formulas & Progression Engine

## 1. Core Triad Match Rules

Rock-Paper-Scissors cycle:
- **Rock** crushes **Scissors**
- **Scissors** cuts **Paper**
- **Paper** covers **Rock**
- Matching moves result in a **Draw** (Draws do not award points; current round repeats or increments until target score is reached).

Match Formats:
- **Best of 3**: First to 2 points wins.
- **Best of 5**: First to 3 points wins.
- **Best of 7**: First to 4 points wins.
- **Turn Timer**: 10 seconds per round. Failure to commit results in a random assignment or round forfeit.

---

## 2. Artificial Intelligence Engine (Solo Mode)

### A. Easy Difficulty
- Strictly uniform random:
  $$P(\text{Rock}) = P(\text{Paper}) = P(\text{Scissors}) = \frac{1}{3}$$

### B. Medium Difficulty (Frequency Counter)
- Tracks player move frequencies over current match: $N(\text{Rock}), N(\text{Paper}), N(\text{Scissors})$.
- 70% probability: Play the direct counter to the player's most frequent move.
- 30% probability: Uniform random (prevents complete predictability).

### C. Hard Difficulty (Markov Chain Prediction)
- 1st-order Markov Transition Matrix $M_{3 \times 3}$:
  $$M[i][j] = P(\text{Move}_{t} = j \mid \text{Move}_{t-1} = i)$$
- Maintains historical transitions between moves.
- Predicts player's most probable next move based on their immediate prior move:
  $$\hat{m}_{t} = \arg\max_j M[\text{Move}_{t-1}][j]$$
- Plays the counter to $\hat{m}_{t}$ with 80% probability; 20% random exploration to remain beatable and human-feeling.

---

## 3. Elo Rating System (Ranked Multiplayer)

Calculated based on standard Elo with K-factor scaling:
$$E_A = \frac{1}{1 + 10^{(R_B - R_A) / 400}}$$
$$E_B = \frac{1}{1 + 10^{(R_A - R_B) / 400}}$$

New ratings:
$$R_A' = R_A + K \times (S_A - E_A)$$
$$R_B' = R_B + K \times (S_B - E_B)$$

Where:
- $S_A = 1$ for win, $0$ for loss.
- $K = 32$ for players with $< 30$ matches (provisional).
- $K = 24$ for rating $< 1600$.
- $K = 16$ for rating $\ge 1600$.
- Minimum rating floor: $100$.

---

## 4. XP and Level Progression Formula

The progression system is defined in a single configuration source (`shared/game-rules/progression.ts`):
- **Level Curve**:
  $$\text{XP Required for Level } L = 100 \times L^{1.5}$$
- **XP Rewards**:
  - Ranked Match Win: $100\text{ XP}$
  - Ranked Match Loss: $35\text{ XP}$
  - Solo Match Win: $25\text{ XP}$ (capped at 500 XP/day to prevent grinding)
  - Solo Match Loss: $5\text{ XP}$
  - Daily Mission Complete: $150\text{ XP}$ + 50 Virtual Coins
  - Tournament Match Win: $150\text{ XP}$
  - Tournament Champion: $500\text{ XP}$ + 500 Virtual Coins
- **Streak Bonus**:
  $$\text{Bonus XP} = \min(\text{Streak} \times 10, 50)$$

---

## 5. Built-in Achievements (15+)

| Code | Title | Description | Reward (XP / Coins) |
| :--- | :--- | :--- | :--- |
| `first_blood` | First Blood | Win your very first match | 100 XP / 50 Coins |
| `triad_apprentice` | Triad Apprentice | Reach Level 5 | 250 XP / 100 Coins |
| `triad_master` | Triad Master | Reach Level 20 | 1000 XP / 500 Coins |
| `hot_streak` | On Fire | Win 3 matches in a row | 150 XP / 75 Coins |
| `unstoppable` | Unstoppable | Achieve a 10-match win streak | 500 XP / 250 Coins |
| `mind_reader` | Mind Reader | Defeat the Hard AI in a Best of 5 | 300 XP / 150 Coins |
| `flawless` | Flawless Victory | Win a multiplayer match without losing a round | 200 XP / 100 Coins |
| `comeback_king` | Comeback King | Win a match after being down 0-2 (in Bo5) | 350 XP / 200 Coins |
| `century_club` | Century Club | Complete 100 total matches | 500 XP / 300 Coins |
| `privateer` | Secret Agent | Host and complete a private room match | 100 XP / 50 Coins |
| `tournament_debut` | In The Arena | Register and compete in your first tournament | 150 XP / 75 Coins |
| `tournament_champ` | Grand Champion | Win 1st place in a tournament | 1000 XP / 1000 Coins |
| `rock_solid` | Rock Solid | Win 5 rounds in a single match using only Rock | 200 XP / 100 Coins |
| `paper_cut` | Origami Master | Win 5 rounds in a single match using only Paper | 200 XP / 100 Coins |
| `scissor_sharp` | Razor Blade | Win 5 rounds in a single match using only Scissors| 200 XP / 100 Coins |
| `mission_hunter` | Daily Specialist | Complete all 3 daily missions in a single day | 250 XP / 150 Coins |
