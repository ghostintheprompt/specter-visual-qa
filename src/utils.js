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

/**
 * Update the .env file with a key-value pair.
 */
function updateEnv(key, value) {
  const envPath = path.join(ROOT, ".env");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  const escapedValue = value.includes(" ") || value.includes("{") ? `'${value}'` : value;
  const line = `${key}=${escapedValue}`;
  const regex = new RegExp(`^${key}=.*$`, "m");

  if (envContent.match(regex)) {
    envContent = envContent.replace(regex, line);
  } else {
    envContent += `\n${line}\n`;
  }

  fs.writeFileSync(envPath, envContent.trim() + "\n");
}

/**
 * Check if the target server is reachable.
 */
async function checkServerStatus(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(2000) }).catch(() => fetch(url, { signal: AbortSignal.timeout(2000) }));
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Gather telemetry data for the dashboard.
 */
async function getTelemetry() {
  require("dotenv").config();
  ensureDirs();
  
  const targetUrl = process.env.TARGET_URL || "Not set";
  const isRunning = targetUrl !== "Not set" ? await checkServerStatus(targetUrl) : false;
  
  let routeCount = 0;
  try {
    if (process.env.ROUTES) {
      routeCount = JSON.parse(process.env.ROUTES).length;
    }
  } catch {}

  const baselineCount = fs.existsSync(DIRS.before) ? fs.readdirSync(DIRS.before).filter(f => f.endsWith(".png")).length : 0;
  
  let activeProject = "None";
  if (fs.existsSync(DIRS.projects)) {
    const projects = fs.readdirSync(DIRS.projects).filter(f => fs.statSync(path.join(DIRS.projects, f)).isDirectory());
    if (projects.length > 0) activeProject = projects[0];
  }

  return { targetUrl, isRunning, routeCount, baselineCount, activeProject };
}

module.exports = { DIRS, ROOT, ensureDirs, timestamp, label, checkForUpdates, updateEnv, checkServerStatus, getTelemetry };
