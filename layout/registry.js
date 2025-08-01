import layout_1_full from "./definitions/1-full.js";
import layout_2_columns from "./definitions/2-columns.js";
import layout_2_rows from "./definitions/2-rows.js";
import layout_3_columns from "./definitions/3-columns.js";
import layout_3_main_left_stack from "./definitions/3-main-left-stack.js";
import layout_3_main_right_stack from "./definitions/3-main-right-stack.js";
import layout_3_rows from "./definitions/3-rows.js";
import layout_4_columns from "./definitions/4-columns.js";
import layout_4_main_left_right_stack from "./definitions/4-main-left-right-stack.js";
import layout_4_main_right_stack from "./definitions/4-main-right-stack.js";
import layout_4_quadrants from "./definitions/4-quadrants.js";

const availableLayouts = [
  layout_1_full,
  layout_2_columns,
  layout_2_rows,
  layout_3_columns,
  layout_3_main_left_stack,
  layout_3_main_right_stack,
  layout_3_rows,
  layout_4_columns,
  layout_4_main_left_right_stack,
  layout_4_main_right_stack,
  layout_4_quadrants,
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
