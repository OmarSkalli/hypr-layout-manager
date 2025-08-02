import { autoDetectHorizontalLayout } from "../detectionHelpers.js";

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
  autoDetectConfiguration: (clients, clientsConfig, monitorDimensions) => {
    return autoDetectHorizontalLayout(
      name,
      clientCount,
      clients,
      clientsConfig,
      monitorDimensions
    );
  },
};
