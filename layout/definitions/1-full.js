const name = "1-full";
const clientCount = 1;

export default {
  name,
  clientCount,
  ascii: [
    "┌─────────────────┐",
    "│                 │",
    "│        A        │",
    "│                 │",
    "└─────────────────┘",
  ],
  dimensions: [],
  applySequence: [{ action: "open", client: 0 }],
  autoDetectConfiguration: (clients, clientsConfig) => {
    if (clients.length !== clientCount) return null;

    return {
      layout: name,
      clients: [clientsConfig[clients[0].address]],
      dimensions: [],
    };
  },
};
