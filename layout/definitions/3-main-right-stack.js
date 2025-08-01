const name = "3-main-right-stack";
const clientCount = 3;

export default {
  name,
  clientCount,
  ascii: [
    "┌─────────────┬───┐",
    "│             │ B │",
    "│      A      ├───┤",
    "│             │ C │",
    "└─────────────┴───┘",
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
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "togglesplit", client: 2 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 1 },
  ],
};
