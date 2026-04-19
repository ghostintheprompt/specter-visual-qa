/**
 * utils.js — Directory scaffolding and shared helpers
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const DIRS = {
  before:       path.join(ROOT, "screenshots", "before"),
  after:        path.join(ROOT, "screenshots", "after"),
  diffs:        path.join(ROOT, "screenshots", "diffs"),
  current:      path.join(ROOT, "screenshots", "current_state"),
  framed:       path.join(ROOT, "screenshots", "framed"),
  references:   path.join(ROOT, "references"),
  projects:     path.join(ROOT, "projects"),
};

/** Ensure all screenshot directories exist. Call before any I/O. */
function ensureDirs() {
  for (const dir of Object.values(DIRS)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Return a timestamped label, e.g. "20260417-143201"
 * Used to name PR branches and commit messages.
 */
function timestamp() {
  return new Date()
    .toISOString()
    .replace(/[:.TZ]/g, "-")
    .slice(0, 15);
}

/**
 * Pad a console label to fixed width for aligned output.
 * e.g. label("home", 16) → "home            "
 */
function label(text, width = 20) {
  return text.padEnd(width);
}

/**
 * Check for updates from GitHub releases.
 */
async function checkForUpdates() {
  const pkg = require("../package.json");
  const repo = pkg.repository ? pkg.repository.url : "https://github.com/ghostintheprompt/spectral-cyclops";
  const repoName = repo.split("github.com/")[1]?.replace(".git", "");

  if (!repoName) return;

  try {
    const response = await fetch(`https://api.github.com/repos/${repoName}/releases/latest`);
    const data = await response.json();
    if (data.tag_name && data.tag_name !== `v${pkg.version}`) {
      console.log(`\n  ✨  New version available: ${data.tag_name}`);
      console.log(`      Download it at: ${data.html_url}\n`);
    }
  } catch (err) {
    // Silent fail on network/API errors
  }
}

module.exports = { DIRS, ROOT, ensureDirs, timestamp, label, checkForUpdates };
