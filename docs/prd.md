Below is **Doc 2: PRD-lite / Functional Spec**.
This is the “build contract” for your vibecoding tool: concrete, unambiguous, and deliberately shallow on implementation details.

---

# **Launch Roulette**

## **PRD-Lite / Functional Specification**

---

## 1. Objective

Define the **minimum functional behavior** required to support the Launch Roulette experience described in the Game Brief.

This document answers:

* What screens exist
* What components exist
* What actions are possible
* How state changes over time

It intentionally avoids:

* Framework choices
* File structure
* Styling implementation
* Performance optimization
* Accessibility edge cases beyond basics

---

## 2. Platform Assumptions

* **Frontend only** (static SPA)
* **In-memory state only** (reset on refresh)
* **Single host controls the app**
* **Audience participates verbally / via breakout rooms**
* **Desktop / screen-share optimized**

---

## 3. Screens

### 3.1 Splash / Start Screen

**Purpose:** Set context and allow host to begin.

**Must include:**

* Game title (“Launch Roulette”)
* Subtitle / tagline (short)
* “Start Game” button

**Behavior:**

* Clicking “Start Game” initializes game state and navigates to Game Screen.

---

### 3.2 Main Game Screen

**Purpose:** Primary gameplay surface.

This screen persists for the entire game session.

#### Layout regions (conceptual):

1. **Wheel Area**
2. **Scenario Card Area**
3. **Choice Area**
4. **Outcome Area**
5. **Meters Area**
6. **Host Control Panel**

Exact placement is flexible; presence is not.

---

### 3.3 End Screen (Optional)

**Purpose:** Clean close.

**Must include (if implemented):**

* “Launch Complete” or similar message
* Final meter states
* “Reset Game” button

If omitted, host may simply reset from Game Screen.

---

## 4. Core Components

### 4.1 Wheel Component

**Purpose:** Randomly select the category (“slice”) for the round.

**Requirements:**

* Visual spinning behavior
* Random selection from available slices
* Slice label clearly readable after spin

**Behavior:**

* Spin can only be triggered when round is idle
* Once spun, the selected slice is locked for that round

---

### 4.2 Scenario Card Component

**Purpose:** Present the decision context.

**Must display:**

* Scenario title
* Scenario context (2–4 sentences max)
* Decision prompt
* Optional countdown timer (visible)

**Behavior:**

* Scenario is selected from the spun slice
* Scenario cannot repeat within the same game session
* Scenario becomes read-only once choices are revealed

---

### 4.3 Choice Component

**Purpose:** Display available decisions.

**Requirements:**

* Exactly 4 labeled choices (A / B / C / D)
* Each choice has short descriptive text

**Behavior:**

* Choices are not “clicked” by players
* Host selects the final choice based on breakout input
* Once selected, choices are locked

---

### 4.4 Outcome Component

**Purpose:** Reveal consequences of the decision.

**Must display:**

* Outcome headline
* Outcome narrative text
* Meter deltas (± values per meter)

**Behavior:**

* Hidden until host triggers “Reveal Outcome”
* Once shown, remains visible until next round starts

---

### 4.5 Meter Component

**Purpose:** Visualize collective state.

**Meters (fixed set):**

* 🚀 Launch Velocity
* 🧯 Risk Containment
* 🧠 Team Sanity
* 📈 Exec Confidence

**Requirements:**

* Numeric or bar-based representation
* Clear increase/decrease animation or indicator
* Visible at all times on Game Screen

**Behavior:**

* Initialized to starting values at game start
* Updated only when outcome is applied
* If any meter hits zero, a Catastrophe is triggered

---

### 4.6 Host Control Panel

**Purpose:** Allow live facilitation.

**Must include controls for:**

* Spin Wheel
* Reveal Scenario
* Start / Stop Timer
* Lock Choice (A/B/C/D)
* Reveal Outcome
* Trigger “Slide Deck Drop”
* Reset Game

**Audience never sees or uses these controls directly.**

---

## 5. Special Mechanics

### 5.1 Slide Deck Drop

**Purpose:** Introduce surprise constraint mid-round.

**Behavior:**

* Can only be triggered after choices are revealed but before outcome
* Displays a constraint message overlay
* Forces a re-decision (host re-locks a choice)
* Outcome then proceeds normally

**Limit:**

* Intended to be used sparingly (1–2 times per game)

---

### 5.2 Fast Follow Token (Optional)

**Purpose:** Allow teams to defer pain.

**Behavior:**

* Global token count (shared)
* When used, modifies outcome text and/or meter deltas
* Token count decreases
* Tokens are not replenished during session

---

### 5.3 Catastrophe Trigger

**Purpose:** Add stakes without “losing.”

**Trigger condition:**

* Any meter reaches zero

**Behavior:**

* Display Catastrophe Card (text only)
* Apply immediate effect (e.g., skip next round, restrict choices)
* Game continues afterward

---

## 6. Game State Model (Conceptual)

Single global state object holding:

* Current round number
* Remaining scenarios per slice
* Active scenario
* Selected choice
* Meter values
* Remaining Fast Follow tokens
* Whether Slide Deck Drop is active
* Whether Catastrophe is active

State resets only on “Reset Game” or page refresh.

---

## 7. Round Flow (Authoritative)

1. Idle state
2. Host spins wheel
3. Slice selected
4. Scenario revealed
5. Timer starts
6. Host locks choice
7. (Optional) Slide Deck Drop → re-lock choice
8. Outcome revealed
9. Meter updates applied
10. Catastrophe check
11. Advance to next round

No deviations.

---

## 8. Constraints & Non-Requirements (Explicit)

* No persistence across refresh
* No analytics
* No user input validation
* No real-time collaboration
* No dynamic content generation
* No mobile gestures
* No animations required beyond basic transitions

---

## 9. Acceptance Criteria

The implementation is correct if:

* A host can run 8–10 rounds without confusion
* No scenario repeats
* Meters update predictably
* Surprise mechanics work without breaking flow
* Reset returns app to clean start state