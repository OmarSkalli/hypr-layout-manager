import hyprctl from "../utils/hyprctl.js";
import logger from "../utils/logger.js";
import { maxClients, getLayoutsForClientCount } from "./registry.js";
import pickLayout from "../prompts/pick-layout.js";
import assignLayoutClients from "../prompts/assign-clients.js";
import setDimensions from "../prompts/set-dimensions.js";
import { saveConfiguration } from "../utils/config.js";
import { LOAD_EXECUTABLE } from "../utils/app-constants.js";

const guessClientConfig = (clients) => {
  return Object.fromEntries(
    clients.map((client) => {
      const urlMatch = client.initialClass.match(
        /^chrome-(.*)-(default|Default)$/
      );
      if (urlMatch) {
        const url = urlMatch[1].replace(/__/g, "/").replace(/_/g, "/");
        return [client.address, { webapp: `https://${url}` }];
      }
      return [client.address, { cmd: client.initialClass.toLowerCase() }];
    })
  );
};

const saveLayout = async (configurationName, workspaceId) => {
  const clients = hyprctl.getClientsOnWorkspace(workspaceId);
  const clientsCount = clients.length;

  if (clientsCount === 0) {
    logger.info(
      `No clients detected on workspace ${workspaceId}, nothing to save.`
    );
    process.exit(0);
  }

  logger.verbose(
    `Clients detected on workspace (id = ${workspaceId}): ${clientsCount}`
  );

  // Detect client config (e.g. cmd vs. webapp)
  const clientsConfig = guessClientConfig(clients);
  logger.verbose(`Clients config:`);
  logger.verbose(clientsConfig);

  // Fetch layouts that can match # of clients
  const availableLayouts = getLayoutsForClientCount(clientsCount);
  logger.verbose(`Available configurations: ${availableLayouts.length}`);

  if (availableLayouts.length === 0) {
    logger.error(
      `Layout manager does not currently support layout with ${clientsCount} clients (max: ${maxClients})`
    );
    process.exit(1);
  }

  // Attempt to auto-detect layout
  let configuration = null;

  availableLayouts.find((layout) => {
    if (layout.autoDetectConfiguration) {
      configuration = layout.autoDetectConfiguration(clients, clientsConfig);
    }

    return configuration !== null;
  });

  if (!configuration) {
    // Ask user to pick a layout from available layouts
    const layout = await pickLayout(availableLayouts);

    // Ask user to map clients to letters
    const sortedClients = await assignLayoutClients(
      layout,
      Object.values(clientsConfig)
    );

    // Ask user to set dimensions
    const dimensions = await setDimensions(layout);

    // Save configuration
    configuration = {
      layout: layout.name,
      clients: sortedClients,
      dimensions,
    };
  } else {
    logger.info("");
    logger.info(
      availableLayouts
        .find((layout) => layout.name === configuration.layout)
        .ascii.join("\n")
    );
  }

  logger.verbose("Layout JSON object:");
  logger.verbose(configuration);

  const configPath = saveConfiguration(configurationName, configuration);
  logger.info(`\nLayout successfully created: ${configPath}\n`);
  logger.info(`To restore it:`);
  logger.info(
    `  - In current workspace:       ${LOAD_EXECUTABLE} ${configurationName}`
  );
  logger.info(
    `  - In a specific workspace:    ${LOAD_EXECUTABLE} ${configurationName} <workspaceId>\n`
  );
};

export { saveLayout };
