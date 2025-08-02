import { autoDetectMixedLayout, sortClientsXY } from "../detectionHelpers.js";

const name = "5-split-main-split";
const clientCount = 5;

export default {
  name,
  clientCount,
  ascii: [
    "┌───┬─────────┬───┐",
    "│ A │         │ D │",
    "├───┤    C    ├───┤",
    "│ B │         │ E │",
    "└───┴─────────┴───┘",
  ],
  dimensions: [
    {
      label: "Client A width (%)",
      type: "width",
      default: 0.25,
    },
    {
      label: "Client A height (%)",
      type: "height",
      default: 0.5,
    },
    {
      label: "Client C width (%)",
      type: "width",
      default: 0.5,
    },
    {
      label: "Client D height (%)",
      type: "height",
      default: 0.5,
    },
  ],
  applySequence: [
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "resizewindow", client: 1, value: { width: 0.25 } },
    { action: "focuswindow", client: 1 },
    { action: "open", client: 0 },
    { action: "focuswindow", client: 2 },
    { action: "open", client: 3 },
    { action: "open", client: 4 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 0 },
    { action: "resizewindow", dimension: 2, client: 2 },
    { action: "resizewindow", dimension: 3, client: 3 },
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
          orientation: "vertical",
          clientsIndex: [0, 1],
          includeHeightAndWidth: true,
        },
        {
          orientation: "horizontal",
          clientsIndex: [2],
          includeLastDimension: true,
        },
        {
          orientation: "vertical",
          clientsIndex: [3, 4],
        },
      ]
    );
  },
};
