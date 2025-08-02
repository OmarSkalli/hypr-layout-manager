import { autoDetectHorizontalLayout } from "../detectionHelpers.js";

const name = "3-columns";
const clientCount = 3;

export default {
  name,
  clientCount,
  ascii: [
    "┌─────┬─────┬─────┐",
    "│     │     │     │",
    "│  A  │  B  │  C  │",
    "│     │     │     │",
    "└─────┴─────┴─────┘",
  ],
  dimensions: [
    {
      label: "Client A width (%)",
      type: "width",
      default: 0.33,
    },
    {
      label: "Client B width (%)",
      type: "width",
      default: 0.33,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 1 },
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
