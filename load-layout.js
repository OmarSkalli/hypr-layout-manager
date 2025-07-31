#!/usr/bin/env node

import hyprctl from "./utils/hyprctl.js";
import { restoreLayout } from "./layout/restore.js";
import { validateRestoretInputs, isValidInteger } from "./utils/validations.js";
import { input, select } from "@inquirer/prompts";
import { getAvailableConfigurations } from "./utils/config.js";
import logger from "./utils/logger.js";

// Get parameters from command line
const args = process.argv.slice(2);

// Verbose mode
if (args.includes("--verbose") || args.includes("-v")) {
  logger.setVerbose(true);
}

const HELP_TEXT = `Hyprland Layout Manager

Usage:
  hyprland-load-layout [options]
  hyprland-load-layout <configuration> [workspaceId] [options]

Arguments (optional):
  configuration    Name of the configuration file (without .json extension)
  workspaceId      Target workspace number (1-10). Defaults to current workspace if not provided.

  If not provided, interactive prompts will guide you through the selection.

Options:
  -h, --help       Show this help message
  -v, --verbose    Enable verbose logging

Examples:
  node load-layout.js                    # Interactive mode
  node load-layout.js dev                # Load 'dev' config to current workspace
  node load-layout.js dev 2              # Load 'dev' config to workspace 2
  node load-layout.js dev 2 --verbose    # With detailed logging

`;

// Show help
if (args.includes("--help") || args.includes("-h")) {
  logger.info(HELP_TEXT);
  process.exit(0);
}

// Check if hyprctl is available and using Dwindle layout
if (!hyprctl.isHyprctlAvailable()) {
  logger.error("hyprctl must be present to use the layout manager.");
  process.exit(1);
}

if (!hyprctl.isDwindleLayout()) {
  logger.error("This layout manager only works for Dwindle layout.");
  process.exit(1);
}

// Get Load layout parameters
const positionalArgs = args.filter((arg) => !arg.startsWith("-"));
const currentWorkspace = hyprctl.getCurrentWorkspace();

let configuration = null;
let workspaceId = null;

if (positionalArgs.length > 0) {
  configuration = positionalArgs[0];
  workspaceId = positionalArgs[1] || currentWorkspace;
} else {
  configuration = await select({
    message: "Enter layout to load:",
    choices: getAvailableConfigurations((name) => ({ name, value: name })),
  });

  workspaceId = await input({
    message: `Enter target workspace (1-10):`,
    default: currentWorkspace,
    validate: (value) => {
      if (!value) return true; // Allow empty/default
      return (
        isValidInteger(value) && parseInt(value) >= 1 && parseInt(value) <= 10
      );
    },
  });
}

// Validate parameters
workspaceId = parseInt(workspaceId);
validateRestoretInputs(workspaceId, configuration);

// Restore the layout
restoreLayout(workspaceId, configuration);
