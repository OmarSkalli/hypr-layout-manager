import { autoDetectMixedLayout, sortClientsXY } from "../detectionHelpers.js";

const name = "4-main-left-right-stack";
const clientCount = 4;

export default {
  name,
  clientCount,
  ascii: [
    "┌───┬─────────┬───┐",
    "│   │         │ C │",
    "│ A │    B    ├───┤",
    "│   │         │ D │",
    "└───┴─────────┴───┘",
  ],
  dimensions: [
    {
      label: "Client A width (%)",
      type: "width",
      default: 0.2,
    },
    {
      label: "Client B width (%)",
      type: "width",
      default: 0.6,
    },
    {
      label: "Client C height (%)",
      type: "height",
      default: 0.5,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "open", client: 3 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 1 },
    { action: "resizewindow", dimension: 2, client: 2 },
  ],
  autoDetectConfiguration: (clients, clientsConfig, monitorDimensions) => {
    sortClientsXY(clients);

    return autoDetectMixedLayout(
      name,
      clientCount,
      clients,
      clientsConfig,
      monitorDimensions,
      [
        {
          orientation: "horizontal",
          clientsIndex: [0, 1],
          includeLastDimension: true,
        },
        {
          orientation: "vertical",
          clientsIndex: [2, 3],
          includeLastDimension: false,
        },
      ]
    );
  },
};
