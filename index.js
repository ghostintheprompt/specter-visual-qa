/**
 * index.js — Spectral Cyclops Command Center
 *
 * The single entry point for the entire tool.
 */

const readline = require("readline");
const shell = require("shelljs");
const { label } = require("./src/utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function mainMenu() {
  console.clear();
  console.log(`
  <p align="center">
    <img src="public/icon.png" width="60">
  </p>
  
  👁️  SPECTRAL CYCLOPS — Command Center
  ──────────────────────────────────────────────────
  
  1. 📥  Onboard a Project     (Clone & detect framework)
  2. 🔍  Auto-Map Screens      (Crawl app for all routes)
  3. 📸  Generate Pro Shots    (Capture & Frame for App Store)
  4. 🔬  Run Visual Audit      (Full regression & PR pipeline)
  5. 👁️  Start AI-Polish       (Live watcher for AI design)
  
  0. 👋  Exit
  `);

  const choice = await question("  Select an option [0-5]: ");

  switch (choice) {
    case "1":
      shell.exec("npm run qa:import", { stdio: "inherit" });
      break;
    case "2":
      shell.exec("npm run qa:discover", { stdio: "inherit" });
      break;
    case "3":
      console.log("\n🎬  Capturing raw shots...");
      shell.exec("npm run qa:capture", { silent: false });
      console.log("\n🖼️   Applying device frames...");
      shell.exec("npm run qa:frame", { silent: false });
      break;
    case "4":
      shell.exec("npm run qa:run", { stdio: "inherit" });
      break;
    case "5":
      shell.exec("npm run qa:watch", { stdio: "inherit" });
      break;
    case "0":
      console.log("\n  See you later! 👁️\n");
      process.exit(0);
    default:
      console.log("\n  ✖  Invalid choice.");
      break;
  }

  await question("\n  Press Enter to return to menu...");
  mainMenu();
}

mainMenu();
