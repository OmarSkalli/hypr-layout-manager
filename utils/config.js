// Helper to manage loading and saving layouts to user config directory

import fs from "fs";
import path from "path";
import os from "os";

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

export { getAvailableConfigurations, loadConfiguration, CONFIG_DIR_TILDE_PATH };
