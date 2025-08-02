import { autoDetectHorizontalLayout } from "../detectionHelpers.js";

const name = "2-columns";
const clientCount = 2;

export default {
  name,
  clientCount,
  ascii: [
    "┌────────┬────────┐",
    "│        │        │",
    "│   A    │   B    │",
    "│        │        │",
    "└────────┴────────┘",
  ],
  dimensions: [
    {
      label: "Client A width (%)",
      type: "width",
      default: 0.5,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "resizewindow", dimension: 0, client: 0 },
  ],
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
