import { autoDetectVerticalLayout } from "../detectionHelpers.js";

const name = "2-rows";
const clientCount = 2;

export default {
  name,
  clientCount,
  ascii: [
    "┌─────────────────┐",
    "│        A        │",
    "├─────────────────┤",
    "│        B        │",
    "└─────────────────┘",
  ],
  dimensions: [
    {
      label: "Client A height (%)",
      type: "height",
      default: 0.7,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "togglesplit", client: 1 },
    { action: "resizewindow", dimension: 0, client: 0 },
  ],
  autoDetectConfiguration: (clients, clientsConfig, monitorDimensions) => {
    return autoDetectVerticalLayout(
      name,
      clientCount,
      clients,
      clientsConfig,
      monitorDimensions
    );
  },
};
