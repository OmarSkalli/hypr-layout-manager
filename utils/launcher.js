import { spawn } from "child_process";

const launchApp = (command) => {
  console.log(`  -> Opening application: ${command}`);
  const child = spawn("sh", ["-c", command], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
};

const launchWebapp = (url) => {
  console.log(`  -> Opening web application: ${url}`);
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
    console.error(`Something went wrong, not sure how to open client.`);
    process.exit(1);
  }
};

export { launchClientApp };
