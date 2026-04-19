/**
 * onboard.js — Spectral Cyclops Repo Importer Wizard
 *
 * Automates onboarding of a new target repo:
 *  1. Clones the repo into projects/
 *  2. Detects the framework (Flutter, React, etc.)
 *  3. Scaffolds initial Spectral Cyclops configuration
 */

require("dotenv").config();
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { DIRS, ensureDirs } = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function start() {
  console.log("\n🚀  Spectral Cyclops Repo Importer Wizard\n");

  const repoUrl = await question("📋  Enter a GitHub URL (or path to local repo): ");
  if (!repoUrl) {
    console.log("✖  No URL provided. Aborting.");
    process.exit(0);
  }

  // Extract repo name for directory
  const repoName = repoUrl
    .split("/")
    .pop()
    .replace(".git", "") || "unknown-project";

  const targetPath = path.join(DIRS.projects, repoName);

  ensureDirs();

  if (fs.existsSync(targetPath)) {
    console.log(`\n⚠️   Directory already exists: ${targetPath}`);
    const overwrite = await question("    Overwrite? (y/N): ");
    if (overwrite.toLowerCase() !== "y") {
      console.log("    Aborting.");
      process.exit(0);
    }
    shell.rm("-rf", targetPath);
  }

  console.log(`\n📡  Cloning ${repoName}...`);
  const cloneResult = shell.exec(`git clone --depth 1 ${repoUrl} "${targetPath}"`, { silent: true });

  if (cloneResult.code !== 0) {
    console.error(`\n✖  Failed to clone repository: ${cloneResult.stderr}`);
    process.exit(1);
  }

  console.log(`✅  Cloned into projects/${repoName}`);

  // ── Framework Detection ───────────────────────────────────────────────────

  console.log("\n🔍  Analyzing framework...");
  let framework = "Unknown";
  let instructions = "";

  if (fs.existsSync(path.join(targetPath, "pubspec.yaml"))) {
    framework = "Flutter";
    instructions = "    1. Run: cd projects/" + repoName + " && flutter run\n" +
                   "    2. Set TARGET_URL in .env to match the Flutter dev server.\n" +
                   "    3. Run: npm run qa:watch";
  } else if (fs.existsSync(path.join(targetPath, "package.json"))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(targetPath, "package.json"), "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps["react-native"]) {
      framework = "React Native";
      instructions = "    1. Run: cd projects/" + repoName + " && npm install && npm run start\n" +
                     "    2. Set TARGET_URL to your emulator/device IP.\n" +
                     "    3. Run: npm run qa:watch";
    } else if (deps["next"] || deps["react"] || deps["vue"] || deps["svelte"]) {
      framework = "Web App (" + (deps["next"] ? "Next.js" : deps["react"] ? "React" : "Vue/Svelte") + ")";
      instructions = "    1. Run: cd projects/" + repoName + " && npm install && npm run dev\n" +
                     "    2. Set TARGET_URL to http://localhost:3000 (or your dev port).\n" +
                     "    3. Run: npm run qa:watch";
    }
  }

  console.log(`✨  Detected: ${framework}`);
  console.log("\n🏁  Next Steps:");
  if (instructions) {
    console.log(instructions);
  } else {
    console.log("    1. Navigate to the project and start your dev server.");
    console.log("    2. Update .env with the project's URL and WATCH_DIR.");
  }

  console.log("\n🎉  Onboarding complete!\n");
  rl.close();
}

start().catch((err) => {
  console.error("\n✖  Wizard error:", err.message);
  process.exit(1);
});
