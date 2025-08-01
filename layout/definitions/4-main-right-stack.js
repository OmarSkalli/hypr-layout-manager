export default {
  name: "4-main-right-stack",
  clientCount: 4,
  ascii: [
    "┌─────────────┬───┐",
    "│             │ B │",
    "│      A      ├───┤",
    "│             │ C │",
    "│             ├───┤",
    "│             │ D │",
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
      default: 0.33,
    },
    {
      label: "Client C height (%)",
      type: "height",
      default: 0.33,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "togglesplit", client: 2 },
    { action: "open", client: 3 },
    { action: "togglesplit", client: 3 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 1 },
    { action: "resizewindow", dimension: 2, client: 2 },
  ],
};
