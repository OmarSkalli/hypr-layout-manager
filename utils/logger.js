let isVerbose = false;

const COLOR_RED = "\x1b[31m";
const COLOR_YELLOW = "\x1b[33m";
const COLOR_RESET = "\x1b[0m";

const setVerbose = (verbose) => {
  isVerbose = verbose;
};

const info = (message) => {
  console.log(message);
};

const verbose = (message) => {
  if (isVerbose) {
    console.log(`${COLOR_YELLOW}[Verbose]${COLOR_RESET} ${message}`);
  }
};

const error = (message) => {
  console.error(`${COLOR_RED}[Error]  ${COLOR_RESET} ${message}`);
};

export default {
  setVerbose,
  info,
  verbose,
  error,
};
