import { isHyprctlAvailable } from "./utils/hyprctl.js";
import { restoreLayout } from "./layout/restore.js";
import { validateRestoretInputs } from "./utils/validations.js";

// Check if hyprctl is available
if (!isHyprctlAvailable()) {
  console.error("hyprctl must be present to use the layout manager.");
  process.exit(1);
}

// Get parameters from command line
if (process.argv.length < 4) {
  console.error("Usage: node index.js <configuration> <workspaceId>");
  process.exit(1);
}

// Validate parameters
const configuration = process.argv[2];
const workspaceId = process.argv[3];
validateRestoretInputs(workspaceId, configuration);

// Restore the layout
restoreLayout(workspaceId, configuration);
