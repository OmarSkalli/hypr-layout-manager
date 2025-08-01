export default {
  name: "4-main-left-right-stack",
  clientCount: 4,
  ascii: [
    "┌───┬─────────┬───┐",
    "│   │         │ C │",
    "│ A │    B    ├───┤",
    "│   │         │ D │",
    "└───┴─────────┴───┘",
  ],
  dimensions: [
    {
      label: "Left column width (%)",
      type: "width",
      default: 0.2,
    },
    {
      label: "Main window width (%)",
      type: "width",
      default: 0.6,
    },
    {
      label: "Client A height (%)",
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
};
