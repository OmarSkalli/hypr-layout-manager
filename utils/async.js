const DEFAULT_TIMEOUT_LIMIT = 10000; // 10 seconds
const DEFAULT_INTERVAL = 50; // 5 ms

async function waitFor(
  condition,
  timeout = DEFAULT_TIMEOUT_LIMIT,
  interval = DEFAULT_INTERVAL
) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return false; // we timed out :(
}

export { waitFor };
