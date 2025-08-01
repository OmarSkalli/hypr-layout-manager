import { spawn } from "child_process";
import logger from "./logger.js";

const launchApp = (command) => {
  logger.command(command);
  const child = spawn("sh", ["-c", command], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
};

const launchWebapp = (url) => {
  const args = [
    "app",
    "--",
    "chromium",
    "--new-window",
    "--ozone-platform=wayland",
    `--app=${url}`,
  ];
  const command = `uwsm ${args.join(" ")}`;
  launchApp(command);
};

const launchClientApp = (client) => {
  if (client.cmd) {
    launchApp(client.cmd);
  } else if (client.webapp) {
    launchWebapp(client.webapp);
  } else {
    process.exit(1);
  }
};

export { launchClientApp };
