let isVerbose = false;

const COLOR_RED = "\x1b[31m";
const COLOR_YELLOW = "\x1b[33m";
const COLOR_GRAY = "\x1b[38;5;244m";
const COLOR_RESET = "\x1b[0m";

const timestamp = () => {
  const timestamp = new Date().toLocaleTimeString();
  return `${COLOR_YELLOW}[${timestamp}]${COLOR_RESET}`;
};

const setVerbose = (verbose) => {
  isVerbose = verbose;
};

const info = (message) => {
  console.log(message || "");
};

const verbose = (message) => {
  if (isVerbose) {
    if (typeof message === "object" && message !== null) {
      JSON.stringify(message, null, 2)
        .split("\n")
        .forEach((line) => verbose(line));
    } else {
      console.log(`${timestamp()} ${message}`);
    }
  }
};

const command = (command) => {
  if (isVerbose) {
    console.log(`${timestamp()}   ${COLOR_GRAY} ${command}${COLOR_RESET}`);
  }
};

const error = (message) => {
  console.error(`${COLOR_RED}Error:${COLOR_RESET} ${message}`);
};

export default {
  setVerbose,
  info,
  verbose,
  command,
  error,
};
