const name = "4-columns";
const clientCount = 4;

export default {
  name,
  clientCount,
  ascii: [
    "┌───┬───┬───┬───┐",
    "│   │   │   │   │",
    "│ A │ B │ C │ D │",
    "│   │   │   │   │",
    "└───┴───┴───┴───┘",
  ],
  dimensions: [
    {
      label: "Client A width (%)",
      type: "width",
      default: 0.25,
    },
    {
      label: "Client B width (%)",
      type: "width",
      default: 0.25,
    },
    {
      label: "Client C width (%)",
      type: "width",
      default: 0.25,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "open", client: 3 },
    { action: "togglesplit", client: 3 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 1 },
    { action: "resizewindow", dimension: 2, client: 2 },
  ],
};
