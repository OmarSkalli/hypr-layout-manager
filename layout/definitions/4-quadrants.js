const name = "4-quadrants";
const clientCount = 4;

export default {
  name,
  clientCount,
  ascii: [
    "┌────────────┬──────┐",
    "│    A       │  B   │",
    "├───────┌────┘──────┤",
    "│    C  │     D     │",
    "└───────┴───────────┘",
  ],
  dimensions: [
    {
      label: "Client A width (%)",
      type: "width",
      default: 0.5,
    },
    {
      label: "Client A height (%)",
      type: "height",
      default: 0.5,
    },
    {
      label: "Client C width (%)",
      type: "width",
      default: 0.5,
    },
  ],
  applySequence: [
    { action: "open", client: 0 },
    { action: "open", client: 1 },
    { action: "togglesplit", client: 1 },
    { action: "open", client: 2 },
    { action: "focuswindow", client: 0 },
    { action: "open", client: 3 },
    { action: "resizewindow", dimension: 0, client: 0 },
    { action: "resizewindow", dimension: 1, client: 0 },
    { action: "resizewindow", dimension: 2, client: 2 },
  ],
};
