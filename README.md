# WATERGEN — Episode One: *The Ecosystem*

### ▶ Play it online: **https://yairhazan12.github.io/watergen-ecosystem-game/**
*(Repo: https://github.com/YairHazan12/watergen-ecosystem-game — edits pushed to `main` auto-redeploy in ~1 min.)*


A Telltale-style ("The Walking Dead") narrative decision game for the
**Human Capital: From Ventures to Innovative Organizations** specialist
presentation. You play the **CEO of Watergen** and live the company's real
journey — from a 2009 prototype to a born-global water company — making the
decisions that show how an **entrepreneurial ecosystem** builds a venture's
human capital, **layer by layer**.

Built to match the group's analysis: **Almor & Berliner (2024), "The Role of
the Ecosystem,"** and the **MACRO / MESO / MICRO** framework. The cast are
Watergen's **real executives**, and the decisions include the two canonical
choices from the deck (IIA grant vs Angel; IDF alumni vs international hiring).

> **Team:** Liora Eichhorn · Itay Bardin · Jonathan Sella · Yair Hazan

---

## ▶ How to run it (in class)

**Easiest:** double-click **`index.html`** — it opens in any browser. No
installation, no build step. Works offline once the page has loaded.

> Be online the first time for nicer fonts (it pulls two Google Fonts); it
> still works offline after, with system-font fallbacks.

**Optional local server**, from this folder:
```
python3 -m http.server 4173
```
then open `http://localhost:4173`.

### Controls
- **Click / `Space` / `Enter`** — advance dialogue (click once to skip the typewriter, again to continue).
- **Number keys `1`–`3`** — pick a choice (or click it).
- Two choices are **timed** (a draining bar) — Telltale-style; *hesitation is itself an answer*.
- **"Academic mode"** toggle (title screen) shows/hides the Macro/Meso/Micro tag on each choice and the "🔬 Ecosystem lens" notes. Leave it **on** for class.

---

## 🎭 The cast (real Watergen executives)

| In game | Real person | Title | Carries which level |
|---|---|---|---|
| **You** | (you play the CEO — Watergen's CEO is **Steve Elbaz**) | CEO | the player |
| Yarden | **Yarden Gonen** | CFO | **MACRO** — funding |
| Sharon | **Sharon Dulberg** | CTO & VP Innovation | **MICRO** — team / talent |
| Chen | **Chen Nechemia** | VP R&D | MICRO — engineering |
| Roni | **Roni Litinetsky** | VP Sales | **MESO** — born-global |
| Dr. Michael | **Dr. Michael Mirilashvili** | President | **STRATEGIC** — scale-up vs exit |

> *Dramatized for education: Watergen and these executives are real; the
> specific scenes and dialogue are fictionalized.*

---

## 🎓 How this hits the assignment rubric

| Phase | Where the game delivers it |
|---|---|
| **1 – The Hook** | Play the **2009 cold open** live (the prototype's first drops of water + an empty bank account). |
| **2 – Academic Synthesis** | The "Ecosystem lens" after each choice + the **debrief** citing Almor & Berliner (2024), Lach et al. (2008), Honig et al. (2006). |
| **3 – Case Study** | The whole game *is* the Watergen case — IIA grants, Technion, the Export Institute/India, Yozma-built VC, born-global, Unit 8200. |
| **4 – Creative Pedagogy** | The interactive role-play. Let the **class vote** on each decision, then read the lens. |

### Suggested 15-minute run of show (your 5 speakers)
1. **Hook (2 min):** Play the cold open. Ask: *"You're the CEO. What is this company really made of?"*
2. **Itay — Specialist Definition (2 min):** Almor & Berliner's central argument — Israel's ecosystem was *engineered*, not organic. Introduce Macro/Meso/Micro.
3. **Liora — Chapters 1–2, class votes (4 min):** **Macro funding** (IIA vs Angel) + **Micro team** (8200 vs international). These are your deck's two decisions — read each "stronger choice" reveal aloud.
4. **Jonathan — Chapters 3–4, class votes (4 min):** **Meso born-global** (no home market → India via Export Institute) + scaling with Yozma VC and government alliances.
5. **Yair — Chapter 5 + Debrief (3 min):** **Scale-Up vs Exit** (your Rec 1) → show the ending the class earned, walk the decision log, deliver the two strategic recommendations, Q&A.

> Tip: run it twice — make deliberately *weak* choices once to land the "Hollow Exit" / "Lone Startup" endings, so the contrast with "Scale-Up Nation" hits home.

---

## 📚 Academic mapping (chapter → framework)

| Chapter | Level | Decision | Stronger choice & why | Source |
|---|---|---|---|---|
| 1. The First Half-Million | **MACRO** | IIA grant vs Angel ($500K) | IIA — non-dilutive, protects equity; **2.28–2.81× leverage** | Lach et al. (2008); Angels Law (2012) |
| 2. Building the Core | **MICRO** | IDF 8200 alumni vs international hiring (12→40) | 8200 — shared culture & trust, hard to import | Honig et al. (2006) |
| 3. A Company With No Home | **MESO** | Born-global (India via Export Institute) vs domestic-first | Born-global — intermediaries replace a missing home market | Almor & Berliner (2024) |
| 4. Going Big | **MACRO+MESO** | $30M Yozma-era VC + govt alliances + humanitarian vs capital-only | Pair growth with mission → legitimacy & social capital | Almor & Berliner (2024) |
| 5. Startup vs Scale-Up | **STRATEGIC** | Resist exit & scale vs cash out | Scale-Up — only ~10% benefit from exits; build an anchor firm | Almor & Berliner (2024), Rec 1 & 2 |

**Sources (cite these on your slides)**
- Almor, T. & Berliner, A. (2024). *The Role of the Ecosystem* (your core reading).
- Lach, S. et al. (2008). On the leverage effect of public R&D grants.
- Honig, B. et al. (2006). Military service, social capital, and new-venture success.
- Policy instruments: **Yozma Fund (1993)**, **Angels Law (2012)**, **IIA** R&D grants, **MAGNET** program, **Israel Export Institute (IEI)**.

---

## ✍️ AI vs. human contribution (declare this — the assignment requires it)

Template for your title/credits slide:

> *"The game **engine, visuals, and code** were generated with AI (Claude) from
> our concept and direction. **We** chose the topic and the core reading (Almor
> & Berliner, 2024), built the Macro/Meso/Micro analysis, selected the Watergen
> case and its real facts, wrote/edited the decision scenarios and the
> 'ecosystem lens' explanations to match our readings, and designed the in-class
> facilitation. AI did not select our sources or write our analysis."*

Edit `story.js` so this is genuinely true of your version.

---

## 🔧 Customizing it

Everything is plain HTML/CSS/JS — no frameworks.

- **`story.js`** — all the writing: `CHARACTERS` (the cast), `STORY.nodes`
  (dialogue, choices, `effects`, `result`, `lens`), and `ENDINGS`. Edit here.
- **`engine.js`** — game logic + the debrief citations/credits block.
- **`style.css`** — colors, fonts, layout. **`index.html`** — title screen.

Common edits:
- **Change a name/title:** edit `CHARACTERS` at the top of `story.js`.
- **Change what a choice does to the meters:** edit its `effects:{...}`.
- **Reword a lens note to match a specific reading:** edit the `lens:` text.
- **Add a scene:** copy a node, give it a new id, point a previous `next` /
  choice `goto` at it.

---

## The four meters
Each choice moves four ecosystem-health meters, which decide the ending:
**👥 Talent** (micro human capital) · **💧 Capital** (macro finance) ·
**🔗 Network** (meso relationships & alliances) · **🌍 Impact** (born-global
reach & mission/legitimacy).

## 🖼️ Art assets & licensing
The visuals use **free, license-clean web assets**, downloaded into `assets/`
so the game runs **offline** in class:
- **Characters** — illustrated avatars from **DiceBear** (`avataaars` style), one
  per real executive, in `assets/characters/*.svg`. DiceBear core is free; the
  *avataaars* set is free to use (originally by Pablo Stanley).
- **Backgrounds** — photos from **Pexels** (free license, no attribution
  required, commercial use OK) in `assets/bg/*.jpg`: a dark workshop (cold open),
  boardroom, night-city office, government hall, conference stage, desert.

> If you want to swap any image, just replace the file in `assets/` (keep the
> same filename) or edit the path in `story.js` (characters) / `style.css`
> (backgrounds). To regenerate a character, change its DiceBear URL options.

## Files
```
index.html          page shell + title screen
style.css           cinematic styling + background images
story.js            ALL content: real cast, scenes, choices, endings  ← edit this
engine.js           game engine + debrief (citations & your names)
assets/characters/  DiceBear avatars (the exec cast)
assets/bg/          Pexels scene photos
README.md           this file
```

*A decision game about the entrepreneurial ecosystem · Adelson School of
Entrepreneurship, "Human Capital" · Case study: Watergen.*
