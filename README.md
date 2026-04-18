# Specter Visual QA

**Automated Visual Regression + AI-Driven UI Polish**

Specter is a two-mode tool. Run it once as a regression guard that catches visual regressions and files GitHub PRs. Run it continuously as a hot-reload watcher that gives an AI assistant a live screenshot feed so it can iterate on your UI design in real time.

```
                 ┌─────────────────────────────────┐
                 │  your app's dev server           │
                 └────────────┬────────────────────┘
                              │  http://localhost:3000
               ┌──────────────▼──────────────────────────┐
               │  Playwright Capture Engine               │
               │  • named routes → PNG per screen         │
               └─────┬────────────────┬──────────────────┘
                     │                │
          ┌──────────▼────────┐   ┌───▼────────────────────┐
          │  Visual Diff      │   │  Auto-Polish Watcher    │
          │  pixelmatch diff  │   │  chokidar file watch    │
          │  → diff images    │   │  → current_state/ PNGs  │
          └──────────┬────────┘   └───────────────────────┘
                     │
          ┌──────────▼────────┐
          │  GitOps           │
          │  branch + commit  │
          │  gh pr create     │
          │  with screenshots │
          └───────────────────┘
```

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/your-org/specter-visual-qa
cd specter-visual-qa
npm install
npx playwright install chromium

# 2. Configure
cp .env.example .env
# Edit .env: set TARGET_URL, ROUTES, WATCH_DIR, GITHUB_REPO

# 3. Start your app's dev server (in another terminal)
cd ../my-app && npm run dev

# 4. Capture the initial baseline
npm run qa:capture
npm run qa:baseline
```

---

## The Two Modes

### Mode 1 — Visual Regression Guard

Run the full pipeline after making changes. Specter captures a new "after"
set of screenshots, diffs them against the stored baseline, and — if anything
changed — opens a GitHub PR with before/after/diff images embedded side by side.

```bash
# Make your code changes, then:
npm run qa:run
```

The PR body looks like this:

| Screen | Δ Pixels | Before | After | Diff |
|--------|----------|--------|-------|------|
| `home` | 4,821 px | ![before] | ![after] | ![diff] |

To accept the new visuals as the next baseline:

```bash
git checkout main && git pull
npm run qa:baseline   # copies screenshots/after/ → screenshots/before/
```

---

### Mode 2 — AI Auto-Polish Loop

Start the watcher in one terminal while your AI assistant has the repo open.
Every time you or the AI saves a file, Specter waits for hot-reload and
overwrites `screenshots/current_state/` with fresh PNGs.

```bash
npm run qa:watch
# or point it at a specific directory:
node src/watcher.js --watch ../my-app/src
```

When a save is detected you'll see:

```
  💾  Change detected: components/HomeScreen.dart
  ⏳  Waiting 2s for hot-reload…
  📸  UI updated! New screenshots saved for AI review.
      3 captured in screenshots/current_state/
```

The AI assistant can now read the updated PNG files to verify its changes
landed correctly before writing the next iteration.

---

## AI Prompt — Basic Polish Loop

Copy this into your AI coding assistant after starting `qa:watch`:

> **System context:** I'm building an app. A background tool hot-reloads it and saves screenshots of every screen to `specter-visual-qa/screenshots/current_state/` after each file save.
>
> **Your role:** Act as a senior UI/UX engineer. Elevate this app's design to look like a premium, modern, Apple-tier product.
>
> **Workflow:**
> 1. Read all screenshots in `specter-visual-qa/screenshots/current_state/`. Identify the screen with the most urgent layout or spacing issue.
> 2. Tell me what you're going to fix and why. Write the exact code change.
> 3. After saving, output this exact phrase and stop: **"Waiting 5 seconds for the hot-reload and automated screenshot capture…"**
> 4. Read the updated screenshot for the screen you just edited.
> 5. If it looks correct, summarize the change and move to the next screen. If not, iterate.

---

## AI Prompt — Reference-Guided Polish (Recommended)

Drop 3–5 reference screenshots from [Game UI Database](https://www.gameuidatabase.com/)
or [Mobbin](https://mobbin.com/) into the `references/` folder. This anchors
the AI to a specific visual language instead of drifting toward generic "modern design."

```
specter-visual-qa/
└── references/
    ├── destiny2_loadout.png
    ├── apex_legends_lobby.png
    └── hades_menu.png
```

> **System context:** I'm building an app. A background tool saves live screenshots to `specter-visual-qa/screenshots/current_state/` after each file save. I've also curated reference screenshots in `specter-visual-qa/references/` that represent the exact aesthetic I want to achieve.
>
> **Your role:** Act as an expert UI/UX designer. Match my app's visual quality to the references — without copying their specific game assets.
>
> **Workflow:**
> 1. **Synthesize the reference aesthetic.** Read every image in `specter-visual-qa/references/`. Define the core rules: layout density, typography weight, color temperature, use of depth/glow/blur.
> 2. **Analyze the current state.** Read all images in `specter-visual-qa/screenshots/current_state/`. Compare them against the rules you just defined.
> 3. **Propose the highest-impact fix.** Pick the one screen where the gap between current and reference is largest. Describe the fix, write the code.
> 4. After saving, output: **"Waiting 5 seconds for the hot-reload and automated screenshot capture…"** Stop and wait.
> 5. Read the updated screenshot. Compare it to the relevant reference image. If the gap has closed, summarize and move on. If not, iterate.

---

## NPM Scripts Reference

| Command | What it does |
|---------|-------------|
| `npm run qa:run` | Full pipeline: capture → diff → PR |
| `npm run qa:capture` | Capture screenshots into `screenshots/after/` |
| `npm run qa:diff` | Diff `after/` against `before/` baseline |
| `npm run qa:watch` | Start the auto-polish file watcher |
| `npm run qa:baseline` | Promote `after/` to the new `before/` baseline |
| `npm run qa:clean` | Delete after/, diffs/, current_state/ |
| `npm run qa:clean:all` | Delete all screenshot directories including baseline |

---

## Configuration (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `TARGET_URL` | `http://localhost:3000` | Base URL of your dev server |
| `ROUTES` | `[{"name":"home","path":"/"}]` | JSON array of named routes to capture |
| `VIEWPORT_W` | `1280` | Capture width in pixels |
| `VIEWPORT_H` | `800` | Capture height in pixels |
| `WATCH_DIR` | parent directory | Directory the watcher monitors |
| `DEBOUNCE_MS` | `2000` | Wait after last save before triggering capture |
| `HOT_RELOAD_S` | `2` | Extra seconds for hot-reload to finish rendering |
| `GITHUB_REPO` | _(empty)_ | `owner/repo` for `gh pr create` |
| `BASE_BRANCH` | `main` | Target branch for regression PRs |
| `PR_LABEL` | `visual-regression` | GitHub label applied to PRs |

---

## Directory Structure

```
specter-visual-qa/
├── flows/
│   └── web/
│       └── capture.js          # Playwright capture engine
├── src/
│   ├── differ.js               # pixelmatch diff engine
│   ├── orchestrator.js         # full pipeline + GitOps
│   ├── watcher.js              # chokidar file watcher
│   └── utils.js                # directory scaffolding + helpers
├── screenshots/
│   ├── before/                 # baseline (set with qa:baseline)
│   ├── after/                  # latest capture run
│   ├── diffs/                  # highlighted diff images
│   └── current_state/          # live feed for AI polish loop
├── references/                 # drop reference UI images here
├── .env.example                # configuration template
└── package.json
```

---

## Requirements

- **Node.js** 18+
- **GitHub CLI** (`gh`) — only needed for automated PR creation
- A running dev server at the configured `TARGET_URL`

```bash
npx playwright install chromium   # first-time setup
```

---

## Tips

**Multiple screens**: Add all your app's routes to `ROUTES` in `.env`. Each
gets its own named PNG, so the AI sees `home.png`, `settings.png`,
`profile.png` — not generic numbered files.

**Mobile viewport**: Set `VIEWPORT_W=390` and `VIEWPORT_H=844` to simulate
iPhone 14 Pro dimensions.

**Slow hot-reload**: Increase `HOT_RELOAD_S` in `.env` if screenshots are
capturing before your framework finishes rendering (common with Flutter Web
or large React trees).

**Custom ready signal**: In `capture.js`, there's a commented-out line that
waits for `window.__specter_ready`. Set this flag in your app's code if you
need to wait for data-fetching or animations to complete before capturing.
