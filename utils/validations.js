import {
  CONFIG_DIR_TILDE_PATH,
  loadConfiguration,
  getAvailableConfigurations,
} from "./config.js";
import { getLayoutDefinition } from "../layout/registry.js";
import hyprctl from "./hyprctl.js";
import logger from "./logger.js";

function isValidInteger(value) {
  return /^\d+$/.test(value);
}

// TODO:
//
// 1) Ideally, don't have `process.exit(1)` all over the place. Instead, have the validator return a list
//    of errors, and then the invoker can decide to exit the process. That'll make it easier to test as
//    well without any process / hyprctl dependency.
//
// 2) Maybe there's a way to defined the `expectedSchema` and leverage that for validating the configuration
//    is well formed. Especially as the schema evolves, it might be easier to manage and reason about.
//

const validateRestoretInputs = (workspaceId, configuration) => {
  // Check if target layout is valid (e.g. number between 1 and 10)
  if (!isValidInteger(workspaceId)) {
    logger.error("Invalid workspace number. It must be between 1 and 10.");
    process.exit(1);
  }

  // Ensure the target layout is not current layout:
  // Because we close all clients within a layout before resetting the layout, this would end up
  // killing the process managing the layout. In the future, maybe we can make the terminal floating
  // until the new layout is complete, then kill the app?
  const currentWorkspaceId = hyprctl.getCurrentWorkspace();
  if (currentWorkspaceId === parseInt(workspaceId)) {
    logger.error(
      `It's not currently supported to load a layout in the current workspace.`
    );
    process.exit(1);
  }

  // Load configurations
  const availableConfigurations = getAvailableConfigurations();

  // Check if the layout exists
  if (!availableConfigurations.includes(configuration)) {
    logger.error(
      `Layout "${configuration}" not found in ${CONFIG_DIR_TILDE_PATH}`
    );
    logger.error(
      "Available configurations:",
      availableConfigurations.join(", ")
    );
    process.exit(1);
  }

  // Load the layout
  const savedConfiguration = loadConfiguration(configuration);
  const layoutDefinition = getLayoutDefinition(savedConfiguration.layout);
  logger.verbose(
    `Configuration "${configuration}" loaded from ${CONFIG_DIR_TILDE_PATH}`
  );

  // Validate the layout definition exists
  if (!layoutDefinition) {
    logger.error(
      `Missing or invalid layout definition: ${savedConfiguration.layout}`
    );
    process.exit(1);
  }

  // Validate we have the right number of clients, and launch details
  if (!Array.isArray(savedConfiguration.clients)) {
    logger.error(
      `Malformated configuration (no clients): ${savedConfiguration.layout}`
    );
    process.exit(1);
  }

  if (savedConfiguration.clients.length !== layoutDefinition.clientCount) {
    logger.error(
      `Invalid layout configuration (${savedConfiguration.clients.length} clients instead of ${layoutDefinition.clientCount}): ${savedConfiguration.layout}`
    );
    process.exit(1);
  }

  savedConfiguration.clients.forEach((client, i) => {
    if (!client.cmd && !client.webapp) {
      logger.error(
        `Missing launch information for client ${i} (expected 'cmd' or 'webapp' to be defined).`
      );
      process.exit(1);
    }
  });

  // TODO: Validate dimensions as well formed (e.g. width, height properties)
};

export { validateRestoretInputs, isValidInteger };
