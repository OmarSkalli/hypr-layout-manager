export default {
  name: "3-main-left-stack",
  clientCount: 3,
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
};
