import { select } from "@inquirer/prompts";
import logger from "../utils/logger.js";
import { PADDING_LEFT, PADDING_RIGHT } from "./constants.js";

const prepareGridLayout = (layouts) => {
  const terminalWidth = process.stdout.columns;

  // Prepare the printing grid
  const maxLayoutWidth = Math.max(
    ...layouts.flatMap((layout) => layout.ascii.map((line) => line.length)),
    ...layouts.map((layout) => layout.name.length)
  );

  const maxLayoutHeight = Math.max(
    ...layouts.flatMap((layout) => layout.ascii.length + 1) // 1 for the title.
  );

  const grid = {
    columns: 1,
    cellSize: {
      width: maxLayoutWidth,
      height: maxLayoutHeight,
    },
    rows: [],
  };

  // Calculate how many side by side previews can fit
  if (terminalWidth) {
    grid.columns = Math.floor(
      (terminalWidth - PADDING_LEFT) / (maxLayoutWidth + PADDING_RIGHT)
    );
  }

  // Assign text to each cell
  let row = 0;
  for (let i = 0; i < layouts.length; i += grid.columns) {
    const rowLayouts = layouts.slice(i, i + grid.columns);
    const totalLines = Math.max(
      ...rowLayouts.map((layout) => layout.ascii.length + 1) // title line
    );

    grid.rows[row] = rowLayouts.map((layout) => {
      const lines = [layout.name, ...layout.ascii];
      const missingLines = totalLines - lines.length;
      for (let j = 0; j < missingLines; j++) lines.push("");

      return lines.map((line) =>
        line.padEnd(grid.cellSize.width + PADDING_RIGHT)
      );
    });

    row++;
  }

  return grid;
};

const printGrid = (grid) => {
  const lines = [];
  let line = "";

  for (let i = 0; i < grid.rows.length; i++) {
    const maxLines = Math.max(...grid.rows[i].map((lines) => lines.length));
    for (let j = 0; j < maxLines; j++) {
      line = "".padEnd(PADDING_LEFT);
      line += grid.rows[i].map((lines) => lines[j]).join("");
      lines.push(line);
    }

    lines.push("");
  }

  logger.info(lines.join("\n"));
};

const pickLayout = async (availableLayouts) => {
  logger.info("\nSupported layouts:\n");

  const grid = prepareGridLayout(availableLayouts);
  printGrid(grid);

  // Create choices for the select prompt
  const choices = availableLayouts.map((layout) => ({
    name: layout.name,
    value: layout,
  }));

  const selectedLayout = await select({
    message: "Select a layout:",
    choices,
  });

  return selectedLayout;
};

export default pickLayout;
