// Because layouts in hyprland are dynamic, restoring a previous layout can't easily be accomplished
// simply by setting x, y coodinates along with width and height. Also, the current tooling (e.g. hyprctl)
// does not expose a way to save the layout tree, and restore it within hyprland's data structure.
//
// As a result, we're taking a different approach to "rebuild" a layout the way an end-user would.
// We're building a layout using a "layout sequence" composed of the folllowing steps only:
//
//    - open an application
//    - `resizewindow` along the x or y axis
//    - `togglesplit`
//
// It does feel a bit primitive, but I couldn't figure out a better way to do it.
//

import { execSync } from "child_process";
import { waitFor } from "../utils/async.js";
import { loadConfiguration } from "../utils/config.js";
import hyprctl from "../utils/hyprctl.js";
import { launchClientApp } from "../utils/launcher.js";
import logger from "./../utils/logger.js";
import { getLayoutDefinition } from "./registry.js";

const STEP_OPEN = "open";
const STEP_RESIZE_WINDOW = "resizewindow";
const STEP_TOGGLE_SPLIT = "togglesplit";
const STEP_FOCUS_WINDOW = "focuswindow";
const SEQUENCE_STEPS = [
  STEP_OPEN,
  STEP_RESIZE_WINDOW,
  STEP_TOGGLE_SPLIT,
  STEP_FOCUS_WINDOW,
];

const closeWorkspaceClients = async (workspaceId) => {
  const clients = hyprctl.getClientsOnWorkspace(workspaceId);

  if (clients.length > 0) {
    logger.verbose(
      `Closing ${clients.length} clients on workspace ${workspaceId}`
    );

    // Issue command to close clients
    clients.forEach((client) => hyprctl.closeClient(client.address));

    // Wait until they're all closed
    const success = await waitFor(
      () => hyprctl.getClientsOnWorkspace(workspaceId).length === 0
    );

    if (!success) {
      logger.error(
        `Timed out waiting for windows to close in workspace ${workspaceId}`
      );
    }
  }
};

const resizeClient = (clientAddress, dimension) => {
  if (!dimension) {
    logger.error(`  Failed to resize active client (missing dimension).`);
    process.exit(1);
  }

  const monitorDimensions = hyprctl.getMonitorDimensions();
  const client = hyprctl.getClientDimensions(clientAddress);
  let dx = 0;
  let dy = 0;

  if (dimension.width) {
    const targetWidth = dimension.width * monitorDimensions.width;
    dx = targetWidth - client.width;
  }

  if (dimension.height) {
    const targetHeight = dimension.height * monitorDimensions.height;
    dy = targetHeight - client.height;
  }

  hyprctl.resizeClient(clientAddress, `${Math.trunc(dx)} ${Math.trunc(dy)}`);
};

const launchApplication = async (client, workspaceId) => {
  const initialAddresses = new Set(
    hyprctl.getClientsOnWorkspace(workspaceId).map((client) => client.address)
  );

  launchClientApp(client);

  // Wait for application to actually appear in client list,
  // then record its address handle.

  let newAddress = null;

  const success = await waitFor(() => {
    const clients = hyprctl.getClientsOnWorkspace(workspaceId);
    return clients.some((client) => {
      if (!initialAddresses.has(client.address)) {
        logger.verbose(`Client address detected: ${client.address}`);
        newAddress = client.address;
        return true;
      }

      return false;
    });
  });

  if (success) {
    return newAddress;
  } else {
    logger.error(`  Failed to detect window in time for the launched app.`);
    process.exit(1);
  }
};

function getTerminalClient(workspaceId) {
  const workspaceClients = hyprctl.getClientsOnWorkspace(workspaceId);
  const clientPids = new Set(
    workspaceClients.map((client) => parseInt(client.pid))
  );

  let pid = process.pid;
  while (pid > 1) {
    if (clientPids.has(pid)) {
      return workspaceClients.find((client) => parseInt(client.pid) === pid);
    }
    const command = `ps -o ppid= -p ${pid}`;
    logger.command(command);
    const result = execSync(command, { encoding: "utf8" });
    pid = parseInt(result.trim());
  }
  return null;
}

function resizeAndFloatTerminal(terminalAddress) {
  hyprctl.setFloating(terminalAddress);

  const monitorDimensions = hyprctl.getMonitorDimensions();
  const width = Math.floor(monitorDimensions.width * 0.25);
  const height = Math.floor(monitorDimensions.height * 0.5);

  logger.verbose(`Resizing and centering terminal: ${width} x ${height}`);

  hyprctl.resizeClient(terminalAddress, `exact ${width} ${height}`);
  hyprctl.centerWindow(terminalAddress);
}

const restoreLayout = async (workspaceId, configurationName) => {
  const configuration = loadConfiguration(configurationName);
  const layoutDefinition = getLayoutDefinition(configuration.layout);

  logger.verbose(
    `Restoring "${configurationName}" configuration to workspace ${workspaceId}.`
  );

  // If the script is invoked from the target layout, we can't close the terminal running
  // the script, or we'll end up killing this script. To get around it, let's float the
  // terminal window and kill it at the very end.

  const terminalClient = getTerminalClient(workspaceId);
  if (terminalClient) {
    logger.verbose(`Found terminal client address: ${terminalClient.address}`);
    resizeAndFloatTerminal(terminalClient.address);
  }

  const currentWorkspaceId = hyprctl.getCurrentWorkspace();
  if (currentWorkspaceId !== workspaceId) {
    hyprctl.switchToWorkspace(workspaceId);
  }

  await closeWorkspaceClients(workspaceId);

  const clientAddresses = {};

  for (const step of layoutDefinition.applySequence) {
    logger.verbose(`Executing step: ${JSON.stringify(step)}`);
    let clientAddress = clientAddresses[step.client];

    switch (step.action) {
      case STEP_OPEN: {
        let client = configuration.clients[step.client];
        let address = await launchApplication(client, workspaceId);
        clientAddresses[step.client] = address;
        break;
      }

      case STEP_RESIZE_WINDOW: {
        // Dimension can either be a user defined dimension or a pre-defined step value.
        const dimension =
          step.value || configuration.dimensions[step.dimension];
        resizeClient(clientAddress, dimension);
        break;
      }

      case STEP_TOGGLE_SPLIT:
        hyprctl.togglesplit(clientAddress);
        break;

      case STEP_FOCUS_WINDOW:
        hyprctl.focusWindow(clientAddress);
        break;

      default:
        logger.error(`  Encoutered an unknown action: ${step.action}`);
        process.exit(1);
        break;
    }
  }

  if (terminalClient) {
    hyprctl.closeClient(terminalClient.address);
  }
};

export { restoreLayout, SEQUENCE_STEPS };
