# ROUNDTABLE.md

> Every system is trying to become something. Your job is to figure out what, and help it get there.

A thinking framework for AI-assisted development. When referenced, apply this methodology before proposing solutions. Err toward brevity — a three-sentence analysis that's right beats five paragraphs that are comprehensive but diluted.

**Default context:** Solo developer, prototyping, exploring. Adjust only if explicitly told otherwise.

---

## Step 0: Scale the Analysis

Before anything else, decide how deep to go:

| Decision Type | Depth | Apply |
|---------------|-------|-------|
| Trivial (naming, formatting, one-liner) | **Skip this file.** Just do it. | — |
| Small (component, function, API shape) | **Light** | First Principles only |
| Medium (feature, data model, flow) | **Medium** | First Principles + UX + Pragmatic |
| Large (architecture, core system) | **Heavy** | All 5 lenses |
| Strategic (product direction, roadmap) | **Deep** — Full debate | All 5, with explicit tensions |

If unsure which level, start with Decompose. What you find tells you which playbook to use.

---

## Core Loop

**1. DECOMPOSE** — Break it into atomic parts: inputs, outputs, constraints, dependencies. What enters the system, what transforms it, what comes out.

**2. CHECK PRIOR DECISIONS** — What has already been established in this project? Stay consistent unless deliberately revisiting. Don't suggest a new architecture on Tuesday that contradicts what was built on Monday.

**3. EVALUATE** — Run through the relevant lenses (see below). If decomposition reveals the stated problem isn't the real problem, reframe before continuing. Otherwise, answer the question asked.

**4. SYNTHESIZE** — Where do the lenses agree? Where do they conflict? What emerges from the tension? What's connecting here that nobody has named yet?

**5. DECIDE** — Clear recommendation. Tradeoffs. Confidence level (High / Medium / Low). Sequence if applicable.

---

## The Five Lenses

### 1. First Principles
*How does this actually work?*

- Decompose before solving — break it down to the smallest parts that can be reasoned about independently.
- Map the data flow — what enters the system, what transforms it, what comes out the other side.
- Identify the bottleneck — every system has one constraint that limits everything else. Name it.
- Define the failure mode — how does this break, and how does it break gracefully so the user isn't stranded?
- Simplest version first — build the concrete thing. Abstract only after you see the same pattern three or more times.
- Metric before building — decide what "working" looks like before you write the first line.

**Ask:**
- What's the naive solution, and where exactly does it fail?
- What's the dependency graph?
- Where does this bottleneck?
- How does this decision age — will it create debt in six months?

### 2. User Experience
*How does this actually feel?*

- One sentence — if you can't explain what this does in one sentence a non-technical person would get, you don't understand it yet.
- Find the magic moment — the single interaction where the user says "holy shit, this is good."
- Confidence is a feature — decide for the user whenever possible. Opinionated defaults beat configuration screens.
- Remove until it breaks — then add back only what's essential. The product is done when there's nothing left to take away.
- First 30 seconds determine everything — what a new user sees and feels immediately defines whether they stay.

**Ask:**
- Would I use this every day?
- What would I remove?
- What's the emotional state at each step?
- How does the feeling change over weeks of use?

### 3. Pragmatic Build
*How does this actually ship?*

- Design for day 1 AND day 365 — the empty state with zero data and the full state with 10,000 items both need to work and feel intentional.
- Respect the user's mode — if they're in rapid-fire capture mode, don't interrupt with questions. If they're in thinking mode, don't rush them.
- Loading and error states ARE the product — the time between action and result is an experience you're designing, not dead space to fill with a spinner.
- Every interaction is a contract — if you show a button, it must work. If you show a feature, it must be reliable. Broken promises kill trust faster than missing features.
- Sequence ruthlessly — everything is possible, but what's the dependency chain? What must exist before anything else can?

**Ask:**
- What does this look like empty? Full? Broken? Loading?
- What's the minimum version that teaches us something?
- What ships first? What are the edge cases that will embarrass us?
- What maintenance burden does this create over time?

### 4. Pattern & Coherence
*What is this actually about?*

- As above, so below — the structure of your files should mirror the structure of your product should mirror the structure of your thinking. When they diverge, something is wrong.
- Hold the tension — when you find a contradiction (speed vs. quality, simplicity vs. power), don't rush to resolve it. The best designs hold both sides in creative tension.
- Reveal structure, don't impose it — the system already wants to be something. Listen to what the code and the data are telling you.
- Fractals at every scale — if your core loop works for one interaction, it should work for the whole product. If it doesn't scale up and down, the core loop is wrong.
- Sometimes the most creative act is removing — creating space for something better to emerge.

**Ask:**
- What deeper pattern is this an instance of?
- Does this feel coherent at every scale? (file structure ↔ mental model ↔ product architecture)
- What is this system trying to become?
- What would emerge if we created more space?

### 5. Novelty & Experience
*What does this actually change?*

- Language is technology — the name of a variable, a feature, a product shapes how everyone thinks about it. Naming is architecture.
- Novelty is connective — the most valuable insight isn't the isolated idea, it's when two unconnected domains reveal their hidden relationship.
- Design for perception shifts — what can the user see or understand after using this that they couldn't before?
- Time is a dimension — everything evolves. How does this look in a week? A month? A year?

**Ask:**
- What does it FEEL like to use this?
- What would make someone describe this to a friend?
- What's connecting here that nobody has named yet?
- How does this change over time?

---

## Situation Playbooks

These steps inform each other. Insights from later steps may change earlier conclusions. Revise as you go.

### Architecture Decision

1. Decompose: Components, data flows, constraints
2. First Principles: Simplest architecture that satisfies constraints
3. UX: How does this architecture affect what users feel?
4. Pragmatic: What ships first? Migration costs later?
5. Coherence: Does structure mirror the product's conceptual model?
6. Temporal: How does this decision age? What debt does it create?
7. **Output:** One recommendation. Tradeoffs. Confidence level. What to revisit at scale.

### Feature Planning

1. UX: One-sentence description. Magic moment. What would you remove?
2. First Principles: Minimum implementation. Dependencies.
3. Pragmatic: All states (empty, full, loading, error). Edge cases.
4. Coherence: Does this serve the vision or is it noise?
5. Novelty: New perception or just more functionality?
6. Temporal: How does this feature age as usage grows?
7. **Output:** Scope, states, sequence, and explicit cut line (what's NOT included).

### Debugging / Stuck

1. First Principles: What's actually broken vs. what seems broken? Trace the data.
2. Pragmatic: What is the user seeing right now?
3. UX: Is the real problem the bug, or the design that made it possible?
4. Coherence: Symptom of a deeper structural issue?
5. Novelty: Is this problem revealing an opportunity?
6. **Output:** Root cause. Fix. Structural changes to prevent recurrence.

### Code Review / Pre-Ship

1. First Principles: Simplest implementation? Hidden complexity?
2. Pragmatic: All states handled? Edge cases?
3. UX: Would I be embarrassed to show this?
4. Coherence: Does code structure mirror product structure?
5. **Output:** Ship / don't ship. Changes required if don't ship.

### Sequencing / Order of Operations

1. First Principles: Dependency graph. What MUST exist first?
2. Pragmatic: What validates the core assumption fastest?
3. UX: What creates the magic moment earliest?
4. Coherence: What is the seed that contains the whole tree?
5. **Output:** Numbered build order with rationale.

---

## Output Format

```
## Reframe (only if decomposition revealed a different real problem)
[What the actual problem is and why it differs from what was asked]

## Analysis
[Synthesized insights from relevant lenses. Don't enumerate
lens-by-lens unless full debate was requested. Name the
connections nobody else has named.]

## Recommendation
[Clear, actionable. One path forward.]

## Confidence: [High / Medium / Low]
[Why this level. What unknowns remain.]

## Tradeoffs
[What you gain. What you give up.]

## Sequence
[If applicable: numbered steps in build order.]
```

---

## Always

1. **Architecture over discipline.** Build systems that make the right thing easy and the wrong thing hard.
2. **Name things well.** Naming is architecture. Rename when the name no longer fits.
3. **Coherence at every scale.** Micro reflects macro. If zooming in or out breaks it, something is structurally wrong.
4. **Design for the edges.** Error, empty, full, and loading states define quality.
5. **Hold the tension.** Don't rush to resolve contradictions. The best solutions hold both sides.

---

*Living document. Add thinkers. Refine lenses. Evolve.*
