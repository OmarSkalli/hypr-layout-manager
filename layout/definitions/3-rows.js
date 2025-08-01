export default {
  name: "3-rows",
  clientCount: 3,
  ascii: [
    "┌─────────────────┐",
    "│        A        │",
    "├─────────────────┤",
    "│        B        │",
    "├─────────────────┤",
    "│        C        │",
    "└─────────────────┘",
  ],
  dimensions: [
    {
      label: "Client A height (%)",
      type: "height",
      default: 0.33,
    },
    {
      label: "Client B height (%)",
      type: "height",
      default: 0.33,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "togglesplit", client: 1 },
    { action: "open", client: 2 },
    { action: "togglesplit", client: 2 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 1 },
  ],
};
