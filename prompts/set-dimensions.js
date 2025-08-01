import { isValidInteger } from "../utils/validations.js";
import { input } from "@inquirer/prompts";
import logger from "../utils/logger.js";

const MIN_PERCENTAGE = 10;
const MAX_PERCENTAGE = 90;

const setDimensions = async (layout) => {
  const dimensions = [];

  logger.info("\nSet dimensions:\n");

  for (let i = 0; i < layout.dimensions.length; i++) {
    const dimension = layout.dimensions[i];

    const percentValue = await input({
      message: `${dimension.label} [${MIN_PERCENTAGE}-${MAX_PERCENTAGE}]`,
      prefill: dimension.default * 100,
      default: dimension.default * 100,
      validate: (value) => {
        if (!value) return true;
        return (
          isValidInteger(value) &&
          parseInt(value) >= MIN_PERCENTAGE &&
          parseInt(value) <= MAX_PERCENTAGE
        );
      },
    });

    dimensions.push({ [dimension.type]: percentValue / 100.0 });
  }

  logger.verbose(`Layout dimensions: ${JSON.stringify(dimensions)}`);
  return dimensions;
};

export default setDimensions;
