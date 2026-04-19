# Build & Setup Guide

## Quick Start
1. **Clone the repo**
   ```bash
   git clone https://github.com/ghostintheprompt/spectral-cyclops
   cd spectral-cyclops
   ```

2. **Install dependencies**
   ```bash
   npm install
   npx playwright install chromium
   ```

3. **Configure**
   ```bash
   cp .env.example .env
   # Edit .env to set your TARGET_URL and WATCH_DIR
   ```

## Workflow Commands
- `npm run qa:import`: Onboard a new target repo/app.
- `npm run qa:discover`: Auto-crawl your app to find all routes.
- `npm run qa:capture`: Take screenshots of all configured routes.
- `npm run qa:frame`: Wrap screenshots in professional device frames.
- `npm run qa:run`: Run the full pipeline (capture, diff, PR).

## Troubleshooting
- **Playwright errors**: Run `npx playwright install --with-deps` if you encounter library issues.
- **Connection refused**: Ensure your target app's dev server is running at the configured `TARGET_URL`.
- **Permission denied**: Ensure you have `gh` CLI installed and authenticated for PR creation.

---
Built by MDRN Corp — [mdrn.app](https://mdrn.app)
