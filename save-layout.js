#!/usr/bin/env node

import hyprctl from "./utils/hyprctl.js";
import { isValidFilename, isValidInteger } from "./utils/validations.js";
import { input, confirm } from "@inquirer/prompts";
import { getAvailableConfigurations } from "./utils/config.js";
import { saveLayout } from "./layout/save.js";
import logger from "./utils/logger.js";
import { SAVE_LAYOUT_HELP_TEXT } from "./utils/app-constants.js";

// Get parameters from command line
const args = process.argv.slice(2);

// Verbose mode
if (args.includes("--verbose") || args.includes("-v")) {
  logger.setVerbose(true);
}

// Show help
if (args.includes("--help") || args.includes("-h")) {
  logger.info(SAVE_LAYOUT_HELP_TEXT);
  process.exit(0);
}

// Check if hyprctl is available and using Dwindle layout
if (!hyprctl.isHyprctlAvailable()) {
  logger.error("hyprctl must be present to use the layout manager.");
  process.exit(1);
}

// Get Save layout parameters (name, and workspace to save)
const currentWorkspace = hyprctl.getCurrentWorkspace();
const existingConfigurations = getAvailableConfigurations();

// Layout setup is always interactive. Shouldn't happen _that_ often.
const configurationName = await input({
  message: "Enter a name for your layout:",
  validate: (value) => isValidFilename(value),
});

// Check if a layout already exists by that name, offer to overwrite.
if (existingConfigurations.includes(configurationName)) {
  const overwrite = await confirm({
    message: `A configuration already exists for "${configurationName}". Overwrite it?`,
  });

  if (!overwrite) process.exit(0);
}

// Pick workspace to save
const workspaceId = await input({
  message: `Enter target workspace (1-10):`,
  default: currentWorkspace,
  validate: (value) => {
    if (!value) return true; // Allow empty/default
    return (
      isValidInteger(value) && parseInt(value) >= 1 && parseInt(value) <= 10
    );
  },
});

saveLayout(configurationName, workspaceId);
