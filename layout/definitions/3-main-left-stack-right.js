export default {
  name: "main-left-stack-right",
  clientCount: 3,
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
      value: {
        width: 0.7,
      },
    },
    {
      label: "Client B height (%)",
      value: {
        height: 0.5,
      },
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "open", client: 2 },
    { action: "togglesplit" },
    { action: "movefocus", client: 1 },
    { action: "resizewindow", dimension: 0 },
    { action: "movefocus", client: 2 },
    { action: "resizewindow", dimension: 1 },
  ],
};
