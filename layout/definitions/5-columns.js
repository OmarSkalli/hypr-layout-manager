import {
  autoDetectHorizontalLayout,
  sortClientsXY,
} from "../detectionHelpers.js";

const name = "5-columns";
const clientCount = 5;

export default {
  name,
  clientCount,
  ascii: [
    "┌──┬──┬──┬──┬──┐",
    "│  │  │  │  │  │",
    "│A │B │C │D │E │",
    "│  │  │  │  │  │",
    "└──┴──┴──┴──┴──┘",
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
      default: 0.2,
    },
    {
      label: "Client C width (%)",
      type: "width",
      default: 0.2,
    },
    {
      label: "Client D width (%)",
      type: "width",
      default: 0.2,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "open", client: 3 },
    { action: "togglesplit", client: 3 },
    { action: "open", client: 4 },
    { action: "togglesplit", client: 4 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 1 },
    { action: "resizewindow", dimension: 2, client: 2 },
    { action: "resizewindow", dimension: 3, client: 3 },
  ],
  autoDetectConfiguration: (clients, clientsConfig, monitorDimensions) => {
    sortClientsXY(clients);

    return autoDetectHorizontalLayout(
      name,
      clientCount,
      clients,
      clientsConfig,
      monitorDimensions
    );
  },
};
