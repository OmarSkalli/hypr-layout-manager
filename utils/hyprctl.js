// Wrapper around the hyprctl command-line utility to interact with the Hyprland compositor.
//
// List of dispatched: https://wiki.hypr.land/Configuring/Dispatchers/
//

import { execSync } from "child_process";
import logger from "./logger.js";

function executeHyprctl(command) {
  try {
    // Use -j flag to output JSON
    const result = execSync(`hyprctl -j ${command}`, { encoding: "utf8" });

    // Some actions (e.g. navigate to workspace) only return 'ok'
    if (result.trim() === "ok") return result;

    // Parse all other responses
    const json = JSON.parse(result);
    return json;
  } catch (error) {
    logger.error(`Error executing hyprctl ${command}:`);
    logger.error(error);
    process.exit(1);
  }
}

function isHyprctlAvailable() {
  try {
    execSync("hyprctl version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function getCurrentWorkspace() {
  const activeWorkspace = executeHyprctl("activeworkspace");
  return parseInt(activeWorkspace.id);
}

function getClientsOnWorkspace(workspaceId) {
  const clients = executeHyprctl("clients");

  return clients.filter(
    (client) =>
      client.workspace.id === parseInt(workspaceId) &&
      !client.floating &&
      client.mapped
  );
}

function switchToWorkspace(workspaceId) {
  logger.verbose(`Switching to workspace ${workspaceId}...`);
  executeHyprctl(`dispatch workspace ${workspaceId}`);
}

function closeClient(address) {
  logger.verbose(`  -> Closing client ${address}...`);
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

function togglesplit() {
  executeHyprctl("dispatch togglesplit");
}

function setFloating(clientAddress) {
  executeHyprctl(`dispatch setfloating address:${clientAddress}`);
}

function focusWindow(clientAddress) {
  executeHyprctl(`dispatch focuswindow address:${clientAddress}`);
}

function resizeActiveWindow(dx = 0, dy = 0) {
  dx = Math.trunc(dx);
  dy = Math.trunc(dy);
  logger.verbose(`  -> Resizing active window: ${dx} ${dy}`);
  executeHyprctl(`dispatch resizeactive ${dx} ${dy}`);
}

function resizeWindow(address, dimensions) {
  executeHyprctl(`dispatch resizeactive ${dimensions} address:${address}`);
}

function centerWindow(address) {
  executeHyprctl(`dispatch centerwindow address:${address}`);
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
  resizeActiveWindow,
  resizeWindow,
  centerWindow,
};
