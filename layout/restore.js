// Because layouts in hyprland are dynamic, restoring a previous layout can't easily be accomplished
// simply by setting x, y coodinates along with width and height. Also, the current tooling (e.g. hyprctl)
// does not expose a way to save the layout tree, and restore it within hyprland's data structure.
//
// As a result, we're taking a different approach to "rebuild" a layout the way an end-user would.
// We're building a layout using a "layout sequence" composed of the folllowing steps only:
//
//    - open an application
//    - `movefocus` to a client window
//    - `resizewindow` along the x or y axis
//    - `togglesplit`
//    - `swapwindow`
//
// It does feel a bit primitive, and brittle if the user is playing with their mouse/keyboard as
// we're rebuilding the layout. But I couldn't figure out a better way to do it.
//

import { waitFor } from "../utils/async.js";
import hyprctl from "../utils/hyprctl.js";
import { getLayoutDefinition } from "./registry.js";
import { loadConfiguration } from "../utils/config.js";
import { launchClientApp } from "../utils/launcher.js";
import logger from "./../utils/logger.js";
import { execSync } from "child_process";

const STEP_OPEN = "open";
const STEP_MOVE_FOCUS = "movefocus";
const STEP_RESIZE_WINDOW = "resizewindow";
const STEP_TOGGLE_SPLIT = "togglesplit";
const SEQUENCE_STEPS = [
  STEP_OPEN,
  STEP_MOVE_FOCUS,
  STEP_RESIZE_WINDOW,
  STEP_TOGGLE_SPLIT,
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

const resizeActiveClient = (dimension) => {
  if (!dimension) {
    logger.error(`  Failed to resize active client (missing dimension).`);
    process.exit(1);
  }

  const monitorDimensions = hyprctl.getMonitorDimensions();
  const currentWindow = hyprctl.getCurrentWindowDimensions();
  let dx = 0;
  let dy = 0;

  if (dimension.width) {
    const targetWidth = dimension.width * monitorDimensions.width;
    dx = targetWidth - currentWindow.width;
  }

  if (dimension.height) {
    const targetHeight = dimension.height * monitorDimensions.height;
    dy = targetHeight - currentWindow.height;
  }

  hyprctl.resizeActiveWindow(dx, dy);
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
        logger.verbose(`  -> Client address detected: ${client.address}`);
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

    const result = execSync(`ps -o ppid= -p ${pid}`, { encoding: "utf8" });
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

  hyprctl.resizeWindow(terminalAddress, `exact ${width} ${height}`);
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

  closeWorkspaceClients(workspaceId);

  const clientAddresses = {};

  for (const step of layoutDefinition.applySequence) {
    logger.verbose(`Executing step: ${JSON.stringify(step)}`);
    switch (step.action) {
      case STEP_OPEN:
        let client = configuration.clients[step.client];
        let address = await launchApplication(client, workspaceId);
        clientAddresses[step.client] = address;
        break;

      case STEP_MOVE_FOCUS:
        let clientAddress = clientAddresses[step.client];
        if (!clientAddress) {
          logger.error(`  Failed to move focus to client (missing address).`);
          process.exit(1);
        }
        hyprctl.focusWindow(clientAddress);
        break;

      case STEP_RESIZE_WINDOW:
        const dimension = configuration.dimensions[step.dimension];
        resizeActiveClient(dimension);
        break;

      case STEP_TOGGLE_SPLIT:
        hyprctl.togglesplit();
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

export { SEQUENCE_STEPS, restoreLayout };
