// Wrapper around the hyprctl command-line utility to interact with the Hyprland compositor.
//
// List of dispatched: https://wiki.hypr.land/Configuring/Dispatchers/
//

import { execSync } from "child_process";
import logger from "./logger.js";

function executeHyprctl(command, log = true) {
  const fullCommand = `hyprctl -j ${command}`;
  if (log) logger.command(fullCommand);

  try {
    // Use -j flag to output JSON
    const result = execSync(fullCommand, { encoding: "utf8" });

    // Some actions (e.g. navigate to workspace) only return 'ok'
    if (result.trim() === "ok") return result;

    // Parse all other responses
    const json = JSON.parse(result);
    return json;
  } catch (error) {
    logger.error(`Error executing ${fullCommand}:`);
    logger.error(error);
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

function getCurrentWindowDimensions() {
  const window = executeHyprctl("activewindow");
  return {
    width: window.size[0],
    height: window.size[1],
    x: window.at[0],
    y: window.at[1],
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
  executeHyprctl(`dispatch resizeactive ${dimensions} address:${address}`);
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
  closeClient,
  executeHyprctl,
  switchToWorkspace,
  getMonitorDimensions,
  getCurrentWindowDimensions,
  isHyprctlAvailable,
  getCurrentWorkspace,
  getClientsOnWorkspace,
  focusWindow,
  togglesplit,
  setFloating,
  resizeClient,
  centerWindow,
  isDwindleLayout,
};
