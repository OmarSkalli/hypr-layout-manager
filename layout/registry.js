import layout_1_full from "./definitions/1-full.js";
import layout_2_columns from "./definitions/2-columns.js";
import layout_2_rows from "./definitions/2-rows.js";
import layout_3_columns from "./definitions/3-columns.js";
import layout_3_main_right_stack from "./definitions/3-main-right-stack.js";

const availableLayouts = [
  layout_1_full,
  layout_2_columns,
  layout_2_rows,
  layout_3_columns,
  layout_3_main_right_stack,
];
const maxClients = Math.max(
  ...availableLayouts.map((layout) => layout.clientCount)
);

const layoutByName = Object.fromEntries(
  availableLayouts.map((definition) => [definition.name, definition])
);

const getLayoutsForClientCount = (count) =>
  availableLayouts.filter((layout) => layout.clientCount === count);

const getLayoutDefinition = (name) => layoutByName[name];

export {
  maxClients,
  availableLayouts,
  getLayoutDefinition,
  getLayoutsForClientCount,
};
