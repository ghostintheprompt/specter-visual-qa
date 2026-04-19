/**
 * release.js — MDRN Corp Release Script
 * 
 * Automates version tagging and GitHub release preparation.
 */

const shell = require("shelljs");
const pkg = require("./package.json");

console.log(`\n🚀  Releasing Spectral Cyclops v${pkg.version}...\n`);

if (!shell.which("git")) {
  console.error("✖  Git not found.");
  process.exit(1);
}

// 1. Tag
const tag = `v${pkg.version}`;
console.log(`🏷️   Tagging ${tag}...`);
const tagResult = shell.exec(`git tag -a ${tag} -m "Release ${tag}"`);

if (tagResult.code !== 0) {
  console.log("⚠️   Tag might already exist or failed.");
}

// 2. Push tags
console.log("📡  Pushing tags...");
shell.exec("git push origin --tags");

// 3. GitHub Release
if (shell.which("gh")) {
  console.log("📦  Creating GitHub Release...");
  shell.exec(`gh release create ${tag} --title "Spectral Cyclops ${tag}" --notes "MDRN Corp open-source release."`);
} else {
  console.log("⏭️   Skipping GitHub Release (gh CLI not found).");
}

console.log("\n✅  Release complete!\n");
