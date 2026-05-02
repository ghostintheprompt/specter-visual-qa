/**
 * index.js — Spectral Cyclops Command Center
 *
 * The single entry point for the entire tool.
 */

const readline = require("readline");
const shell = require("shelljs");
const { getTelemetry } = require("./src/utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function mainMenu() {
  console.clear();
  console.log("\n  Gathering telemetry...\n");
  const t = await getTelemetry();
  
  const serverStr = t.isRunning ? "✅ Online" : (t.targetUrl === "Not set" ? "⚠️ Not set" : "❌ Offline");
  const baselineStr = t.baselineCount > 0 ? `✅ Set (${t.baselineCount} images)` : "⚠️ Missing";
  const routesStr = t.routeCount > 0 ? `✅ ${t.routeCount} mapped` : "⚠️ None mapped";
  
  console.clear();
  console.log(`
  <p align="center">
    <img src="public/icon.png" width="60">
  </p>
  
  👁️  SPECTRAL CYCLOPS — Command Center
  ──────────────────────────────────────────────────
  
  📊  DASHBOARD
      • Target:    ${t.targetUrl} [${serverStr}]
      • Project:   ${t.activeProject}
      • Routes:    ${routesStr}
      • Baseline:  ${baselineStr}
      
  ──────────────────────────────────────────────────
  
  1. 📥  Onboard a Project     (Clone & configure auto-setup)
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
      if (!t.isRunning && t.targetUrl !== "Not set") {
        console.log("\n  ✖  Cannot crawl: Server is offline. Please start it first.");
      } else {
        shell.exec("npm run qa:discover", { stdio: "inherit" });
      }
      break;
    case "3":
      if (!t.isRunning && t.targetUrl !== "Not set") {
        console.log("\n  ✖  Cannot capture: Server is offline. Please start it first.");
      } else {
        console.log("\n🎬  Capturing raw shots...");
        shell.exec("npm run qa:capture", { silent: false });
        console.log("\n🖼️   Applying device frames...");
        shell.exec("npm run qa:frame", { silent: false });
      }
      break;
    case "4":
      if (t.baselineCount === 0) {
         console.log("\n  ⚠️  No baseline detected. To run an audit, you need a baseline.");
         const setBase = await question("      Set current screens as baseline now? (y/N): ");
         if (setBase.toLowerCase() === 'y') {
           shell.exec("npm run qa:baseline", { stdio: "inherit" });
         } else {
           console.log("      Skipping audit.");
           break;
         }
      }
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
