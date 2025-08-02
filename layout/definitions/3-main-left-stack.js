import { autoDetectMixedLayout, sortClientsXY } from "../detectionHelpers.js";

const name = "3-main-left-stack";
const clientCount = 3;

export default {
  name,
  clientCount,
  ascii: [
    "┌───┬─────────────┐",
    "│ B │             │",
    "├───┤      A      │",
    "│ C │             │",
    "└───┴─────────────┘",
  ],
  dimensions: [
    {
      label: "Client A width (%)",
      type: "width",
      default: 0.7,
    },
    {
      label: "Client B height (%)",
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
    { action: "resizewindow", dimension: 0, client: 2 },
    { action: "resizewindow", dimension: 1, client: 1 },
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
        // Because client A is on the right side, yet `clients` is sorted
        // by X then Y, we have this odd looking setup where we detect
        // the end (client 2 -> A) then the start (client 0, 1 -> B, C)

        {
          orientation: "horizontal",
          clientsIndex: [2],
          includeLastDimension: true,
        },
        {
          orientation: "vertical",
          clientsIndex: [0, 1],
          includeLastDimension: false,
        },
      ]
    );
  },
};
