<p align="center">
  <img src="public/icon.png" width="520" alt="Spectral Cyclops Icon">
</p>

# Spectral Cyclops

**Visual Regression & App Store Screenshot Engine — v1.0**

Free. Open-source. No subscriptions. No telemetry. Built by [MDRN Corp](https://mdrn.app).

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Platform: Node.js](https://img.shields.io/badge/Platform-Node.js-green.svg)](https://nodejs.org)
[![Release: v1.0.0](https://img.shields.io/badge/Release-v1.0.0-orange.svg)](https://github.com/ghostintheprompt/spectral-cyclops/releases)

---

Spectral Cyclops automates the most tedious parts of app development: verifying visual integrity across updates and generating high-fidelity screenshots for App Store listings. It crawls your app, captures every screen, and frames them in professional device silhouettes with zero manual clicking.

| Feature | Description |
|---------|-------------|
| **Auto-Discovery** | Crawls your dev server to find every reachable page automatically. |
| **Visual Regression** | Diffs new captures against a baseline to catch UI bugs instantly. |
| **Pro-Framer** | Wraps raw screenshots in sleek device frames with beautiful backgrounds. |
| **GitOps Integration** | Automatically opens GitHub PRs with side-by-side visual diffs. |
| **AI Polish Loop** | Continuous watcher provides a live screenshot feed for AI-driven UI iterations. |

---

## Installation

```bash
git clone https://github.com/ghostintheprompt/spectral-cyclops
cd spectral-cyclops
npm install
npx playwright install chromium
```

## Usage

The easiest way to use Spectral Cyclops is through the interactive **Command Center**. Just run:

```bash
npm start
```

This will guide you through:
1. **Importing** a project from GitHub.
2. **Discovering** every screen in that project.
3. **Generating** professional App Store shots with device frames.
4. **Auditing** visual regressions with full GitHub PR support.

---

## Command Reference

While `npm start` is recommended, you can run individual modules:

| Command | Action |
|---------|--------|
| `npm run qa:import` | Onboard a new repo |
| `npm run qa:discover` | Auto-map app routes |
| `npm run qa:capture` | Take raw screenshots |
| `npm run qa:frame` | Apply device frames |
| `npm run qa:watch` | Start AI-polish mode |

---

## Privacy Statement
Spectral Cyclops is **local-only**. All screenshots are captured and processed on your machine. No images or telemetry are ever uploaded to external servers, except for GitHub if you explicitly configure PR creation.

---

Built by **MDRN Corp** — [mdrn.app](https://mdrn.app)  
Read the full article: [One Eye on Everything](https://ghostintheprompt.com/articles/spectral-cyclops)
