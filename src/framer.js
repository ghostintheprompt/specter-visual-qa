/**
 * framer.js — Spectral Cyclops Pro-Framer
 *
 * Takes raw screenshots from screenshots/after/ and wraps them in
 * device frames, gradients, and typography using a Playwright renderer.
 *
 * Usage:
 *   npm run qa:frame
 */

require("dotenv").config();
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { DIRS, ensureDirs, label } = require("./utils");

// Config
const THEME = process.env.FRAME_THEME || "sunset"; // purple, dark, sunset
const WIDTH = 1284;
const HEIGHT = 2778;

/** Convert filename "home-screen.png" to "Home Screen" */
function prettifyTitle(filename) {
  const base = filename.replace(/\.[^/.]+$/, ""); // remove extension
  return base
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function runFramer() {
  console.log("\n📸  Spectral Cyclops Pro-Framer — Generating App Store Shots\n");
  ensureDirs();

  const files = fs.readdirSync(DIRS.after).filter((f) => f.endsWith(".png"));

  if (files.length === 0) {
    console.error("✖  No screenshots found in screenshots/after/");
    console.log("   Run 'npm run qa:capture' first.\n");
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
  });

  const templatePath = `file://${path.resolve(__dirname, "framer.html")}`;

  for (const file of files) {
    const title = prettifyTitle(file);
    const screenshotPath = `file://${path.join(DIRS.after, file)}`;
    const outPath = path.join(DIRS.framed, file);

    const url = `${templatePath}?title=${encodeURIComponent(title)}&image=${encodeURIComponent(screenshotPath)}&theme=${THEME}`;

    console.log(`  🖼️   Framing: ${label(title, 20)} → screenshots/framed/${file}`);
    
    await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({ path: outPath });
  }

  await browser.close();
  console.log(`\n✅  Pro-Framer complete! ${files.length} shots saved to screenshots/framed/\n`);
}

runFramer().catch((err) => {
  console.error("\n✖  Framer error:", err.message);
  process.exit(1);
});
