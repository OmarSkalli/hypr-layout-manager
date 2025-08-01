// Helper to manage loading and saving layouts to user config directory

import fs from "fs";
import path from "path";
import os from "os";
import logger from "./logger.js";

const CONFIG_DIR = path.join(os.homedir(), ".config", "hypr", "layouts");
const CONFIG_DIR_TILDE_PATH = CONFIG_DIR.replace(os.homedir(), "~");

function ensureLayoutDirectoryExists() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function getAvailableConfigurations() {
  ensureLayoutDirectoryExists();

  return fs
    .readdirSync(CONFIG_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"));
}

function loadConfiguration(configuration) {
  const configPath = path.join(CONFIG_DIR, `${configuration}.json`);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Layout configuration "${configuration}" does not exist.`);
  }
  const configData = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(configData);
}

function saveConfiguration(configuration, json) {
  ensureLayoutDirectoryExists();
  const configPath = path.join(CONFIG_DIR, `${configuration}.json`);

  logger.verbose(`Saving configuration to ${configPath}`);
  fs.writeFileSync(configPath, JSON.stringify(json, null, 2));

  return path.join(CONFIG_DIR_TILDE_PATH, `${configuration}.json`);
}

export {
  getAvailableConfigurations,
  loadConfiguration,
  saveConfiguration,
  CONFIG_DIR_TILDE_PATH,
};
