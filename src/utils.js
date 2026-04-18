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
  references:   path.join(ROOT, "references"),
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

module.exports = { DIRS, ROOT, ensureDirs, timestamp, label };
