// Wrapper around the hyprctl command-line utility to interact with the Hyprland compositor.
//
// List of dispatched: https://wiki.hypr.land/Configuring/Dispatchers/
//

import { execSync } from "child_process";
import logger from "./logger.js";

function executeHyprctl(command, log = true) {
  const fullCommand = `hyprctl -j ${command}`; // -j flag for JSON output
  if (log) logger.command(fullCommand);

  let result;
  try {
    result = execSync(fullCommand, { encoding: "utf8" });
  } catch (error) {
    logger.error(`Error executing ${fullCommand}:`);
    logger.error(error);
    process.exit(1);
  }

  // Some actions (e.g. navigate to workspace) only return 'ok'
  if (result.trim() === "ok") return result;

  // Parse all other responses
  try {
    const json = JSON.parse(result);
    return json;
  } catch (jsonError) {
    logger.error(`JSON parsing error for command ${fullCommand}:`);
    logger.error(`Raw output: ${result}`);
    logger.error(jsonError);
    process.exit(1);
  }
}

function isHyprctlAvailable() {
  try {
    execSync("hyprctl version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function getCurrentWorkspace() {
  const activeWorkspace = executeHyprctl("activeworkspace");
  return parseInt(activeWorkspace.id);
}

function getClientsOnWorkspace(workspaceId) {
  const clients = executeHyprctl("clients", false);

  return clients.filter(
    (client) =>
      client.workspace.id === parseInt(workspaceId) &&
      !client.floating &&
      client.mapped
  );
}

function switchToWorkspace(workspaceId) {
  executeHyprctl(`dispatch workspace ${workspaceId}`);
}

function closeClient(address) {
  executeHyprctl(`dispatch closewindow address:${address}`);
}

function getMonitorDimensions() {
  const monitors = executeHyprctl("monitors");

  // Default to the first monitor.
  // I don't have a multi-monitor setup to test with.

  return {
    width: monitors[0].width,
    height: monitors[0].height,
  };
}

function getClientDimensions(address) {
  const client = executeHyprctl(`clients`, false).find(
    (client) => client.address === address
  );

  if (!client) {
    logger.error(`Failed to find client address:${address}`);
  }
  return {
    width: client.size[0],
    height: client.size[1],
    x: client.at[0],
    y: client.at[1],
  };
}

function togglesplit(address) {
  executeHyprctl(`dispatch togglesplit address:${address}`);
}

function setFloating(address) {
  executeHyprctl(`dispatch setfloating address:${address}`);
}

function focusWindow(address) {
  executeHyprctl(`dispatch focuswindow address:${address}`);
}

function resizeClient(address, dimensions) {
  executeHyprctl(`dispatch resizewindowpixel ${dimensions},address:${address}`);
}

function centerWindow(address) {
  executeHyprctl(`dispatch centerwindow address:${address}`);
}

function getCurrentLayout() {
  const layoutOption = executeHyprctl("getoption general:layout");
  return layoutOption.str;
}

function isDwindleLayout() {
  return getCurrentLayout() === "dwindle";
}

export default {
  centerWindow,
  closeClient,
  executeHyprctl,
  getClientDimensions,
  getClientsOnWorkspace,
  getCurrentWorkspace,
  getMonitorDimensions,
  isDwindleLayout,
  isHyprctlAvailable,
  focusWindow,
  resizeClient,
  setFloating,
  switchToWorkspace,
  togglesplit,
};
