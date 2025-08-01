export default {
  name: "2-rows",
  clientCount: 2,
  ascii: [
    "┌─────────────────┐",
    "│                 │",
    "│        A        │",
    "├─────────────────┤",
    "│        B        │",
    "└─────────────────┘",
  ],
  dimensions: [
    {
      label: "Client A height (%)",
      type: "height",
      default: 0.7,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "togglesplit", client: 1 },
    { action: "resizewindow", dimension: 0, client: 0 },
  ],
};
