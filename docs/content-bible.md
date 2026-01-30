Below is **Doc 3: Content Bible**.
This is the **single source of truth for all game content** and the document your vibecoding tool should treat as *data*, not prose.

This doc is intentionally structured, repetitive, and explicit. That’s a feature.

---

# **Launch Roulette**

## **Content Bible (Authoritative Content & Structure)**

---

## 1. Purpose of This Document

The Content Bible defines **all narrative content** used by Launch Roulette and how that content is shaped.

It answers:

* What slices exist
* What scenarios belong to each slice
* What choices are available
* What outcomes exist and how they affect meters
* What special cards exist (Slide Deck Drops, Catastrophes)

This document should be:

* Easy to convert to JSON
* Easy to edit without touching code
* Treated as immutable at runtime

---

## 2. Global Copy Rules

### Tone

* Short sentences
* Conversational, modern
* Absurd but grounded in reality
* Never sarcastic toward individuals
* Punchlines live in **outcomes**, not scenarios

### Length Constraints

* Scenario context: **max 3 short paragraphs**
* Choice text: **1 line each**
* Outcome narrative: **2–3 lines max**
* Meter deltas always explicit (+1, -2, etc.)

### Voice

* Third-person, collective (“you,” “the team”)
* No first-person narration
* No real metrics, numbers, or dates
* No real PII or confidential data

---

## 3. Meters (Fixed Schema)

These meters exist globally and are referenced by outcomes only.

```
METERS:
- launch_velocity (🚀)
- risk_containment (🧯)
- team_sanity (🧠)
- exec_confidence (📈)
```

Meter values range from **0–10**.
All games start with a defined default (e.g., 5).

---

## 4. Wheel Slice Definition

Each wheel slice is a **category**, not a single scenario.

### Slice Schema

```
Slice:
- id
- display_name
- short_description
- scenarios[]  (2–4 recommended)
```

### Example (schema only)

```
Slice:
  id: "market_structure"
  display_name: "Market Structure Mayhem"
  short_description: "Liquidity, spreads, and philosophical debates."
```

---

## 5. Scenario Definition

Each scenario belongs to exactly one slice.

### Scenario Schema

```
Scenario:
- id
- title
- context
- prompt
- choices[]   (exactly 4)
```

### Notes

* Scenarios must be self-contained
* No scenario should reference another scenario
* Context sets the scene; prompt forces a decision

---

## 6. Choice Definition

Each scenario has exactly **four choices**, labeled A–D.

### Choice Schema

```
Choice:
- id  (A, B, C, or D)
- label
- outcome
```

Choice labels should:

* Be short
* Represent a real tradeoff
* Avoid obviously “correct” framing

---

## 7. Outcome Definition

Outcomes are deterministic.
No randomness. No branching beyond meter deltas.

### Outcome Schema

```
Outcome:
- headline
- narrative
- meter_deltas
```

### Meter Delta Schema

```
meter_deltas:
  launch_velocity: +1
  risk_containment: -1
  team_sanity: 0
  exec_confidence: +1
```

### Rules

* Every outcome must modify **at least one meter**
* No outcome should modify all four meters
* Deltas should generally be between -2 and +2
* Zero deltas should be explicit

---

## 8. Slide Deck Drop Cards

Slide Deck Drops are **global surprise constraints**.

### Slide Deck Drop Schema

```
SlideDeckDrop:
- id
- title
- constraint_text
- effect_instruction
```

### Usage Rules

* Triggered manually by host
* Forces re-decision on the same scenario
* Does not directly change meters
* Changes *how teams think*, not the math

---

## 9. Fast Follow Token (Optional Content)

If enabled, Fast Follow Tokens alter outcomes.

### Token Rules

* Global pool
* Limited quantity (defined at game start)
* May:

  * Reduce negative deltas
  * Convert immediate pain into future risk
  * Trigger special outcome text

### Token Outcome Annotation (optional)

```
fast_follow_variant:
- modified_narrative
- modified_meter_deltas
```

---

## 10. Catastrophe Cards

Catastrophes trigger when a meter hits zero.

### Catastrophe Schema

```
Catastrophe:
- id
- title
- trigger_condition
- description
- effect
```

### Effect Types

* Restrict next round’s slice pool
* Disable Fast Follow usage
* Force shorter decision timer
* Narrative-only (no meter change)

Catastrophes should feel disruptive but not punitive.

---

## 11. Content Balancing Guidelines

To keep the game fun:

* ~60% outcomes should feel “reasonable”
* ~30% should feel mildly painful but funny
* ~10% should feel chaotic or dramatic

Avoid:

* All-positive rounds
* Repeated meter drains
* Long stretches without laughter beats

---

## 12. Content Ownership & Editing Rules

* Content changes do **not** require code changes
* New scenarios must follow schema exactly
* Removing scenarios must not break slice balance
* This document is the **only place content lives**

---

## 13. Export Readiness

This document is designed to be:

* Parsed into JSON
* Loaded at runtime
* Swapped out for future events (non-crypto launches)