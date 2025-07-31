import { spawn } from "child_process";
import logger from "./logger.js";

const launchApp = (command) => {
  logger.verbose(`  -> Opening application: ${command}`);
  const child = spawn("sh", ["-c", command], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
};

const launchWebapp = (url) => {
  logger.verbose(`  -> Opening web application: ${url}`);
  const args = [
    "app",
    "--",
    "chromium",
    "--new-window",
    "--ozone-platform=wayland",
    `--app=${url}`,
  ];

  const child = spawn("uwsm", args, {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
};

const launchClientApp = (client) => {
  if (client.cmd) {
    launchApp(client.cmd);
  } else if (client.webapp) {
    launchWebapp(client.webapp);
  } else {
    logger.error(`Something went wrong, not sure how to open client.`);
    process.exit(1);
  }
};

export { launchClientApp };
