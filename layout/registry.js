import layout_2_colummns from "./definitions/2-columns.js";
import layout_3_main_left_stack_right from "./definitions/3-main-left-stack-right.js";

const availableLayouts = [layout_2_colummns, layout_3_main_left_stack_right];

const layoutByName = Object.fromEntries(
  availableLayouts.map((definition) => [definition.name, definition])
);

const getLayoutDefinition = (name) => layoutByName[name];

export { getLayoutDefinition };
