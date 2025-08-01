import { select } from "@inquirer/prompts";
import logger from "../utils/logger.js";
import { PADDING_LEFT_STRING } from "./constants.js";

const numberToLetter = (n) => String.fromCharCode(65 + n); // 65 is 'A'

const assignClients = async (layout, clientsConfig) => {
  const clients = [];
  const remainingOptions = clientsConfig;

  // Print the layout for convenience
  logger.info(``);
  layout.ascii.forEach((line) => logger.info(`${PADDING_LEFT_STRING}${line}`));
  logger.info(``);

  for (let i = 0; i < layout.clientCount; i++) {
    const choices = remainingOptions.map((option, index) => ({
      name: option.cmd || option.webapp,
      value: index,
    }));

    const clientIndex = await select({
      message: `Select a client for ${numberToLetter(i)}`,
      choices,
    });

    clients.push(remainingOptions[clientIndex]);
    remainingOptions.splice(clientIndex, 1);
  }

  return clients;
};

export default assignClients;
