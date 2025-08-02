// Helper functions for layout auto-detection

export const calculateWidth = (client, monitorDimensions) => {
  return client.size[0] / monitorDimensions.width;
};

export const calculateHeight = (client, monitorDimensions) => {
  return client.size[1] / monitorDimensions.height;
};

export const sortClientsXY = (clients) =>
  clients.sort((a, b) => {
    if (a.at[0] !== b.at[0]) {
      return a.at[0] - b.at[0];
    }
    return a.at[1] - b.at[1];
  });

export const sortClientsYX = (clients) =>
  clients.sort((a, b) => {
    if (a.at[1] !== b.at[1]) {
      return a.at[1] - b.at[1];
    }
    return a.at[0] - b.at[0];
  });

export const isHorizontalRowLayout = (clients) => {
  if (clients.length < 2) return true;
  const firstY = clients[0].at[1];
  return clients.every((client) => client.at[1] === firstY);
};

export const getDimensions = (
  clients,
  monitorDimensions,
  { includeWidth, includeHeight, includeLastDimension }
) => {
  // Last dimension is often redundant (e.g. it's the remainder)
  // except when working with sublayouts.

  let filteredClients = includeLastDimension ? clients : clients.slice(0, -1);

  return filteredClients.flatMap((client) => {
    const dimension = [];

    if (includeHeight)
      dimension.push({ height: calculateHeight(client, monitorDimensions) });

    if (includeWidth)
      dimension.push({ width: calculateWidth(client, monitorDimensions) });

    return dimension;
  });
};

export const autoDetectHorizontalLayout = (
  name,
  clientCount,
  clients,
  clientsConfig,
  monitorDimensions,
  includeLastDimension = false,
  includeHeightAndWidth = false
) => {
  if (clients.length !== clientCount) return null;
  if (!isHorizontalRowLayout(clients)) return null;

  const dimensions = getDimensions(clients, monitorDimensions, {
    includeWidth: true,
    includeHeight: includeHeightAndWidth,
    includeLastDimension,
  });

  return {
    layout: name,
    clients: clients.map((client) => clientsConfig[client.address]),
    dimensions: dimensions,
  };
};

export const isVerticalColumnLayout = (clients) => {
  if (clients.length < 2) return true;
  const firstX = clients[0].at[0];
  return clients.every((client) => client.at[0] === firstX);
};

export const autoDetectVerticalLayout = (
  name,
  clientCount,
  clients,
  clientsConfig,
  monitorDimensions,
  includeLastDimension = false,
  includeHeightAndWidth = false
) => {
  if (clients.length !== clientCount) return null;
  if (!isVerticalColumnLayout(clients)) return null;

  const dimensions = getDimensions(clients, monitorDimensions, {
    includeWidth: includeHeightAndWidth,
    includeHeight: true,
    includeLastDimension,
  });

  return {
    layout: name,
    clients: clients.map((client) => clientsConfig[client.address]),
    dimensions: dimensions,
  };
};

const detectionFunctionPerOrientation = {
  horizontal: autoDetectHorizontalLayout,
  vertical: autoDetectVerticalLayout,
};

export const autoDetectMixedLayout = (
  name,
  clientCount,
  clients,
  clientsConfig,
  monitorDimensions,
  subLayouts
) => {
  if (clients.length !== clientCount) return null;

  const config = {
    layout: name,
    clients: [],
    dimensions: [],
  };

  for (let i = 0; i < subLayouts.length; i++) {
    const {
      orientation,
      clientsIndex,
      includeLastDimension,
      includeHeightAndWidth,
    } = subLayouts[i];
    const subClients = clientsIndex.map((i) => clients[i]);

    const detectionFn = detectionFunctionPerOrientation[orientation];
    if (!detectionFn) return null;

    const subConfig = detectionFn(
      name,
      subClients.length,
      subClients,
      clientsConfig,
      monitorDimensions,
      includeLastDimension,
      includeHeightAndWidth
    );

    if (!subConfig) return null;

    // Merge subconfigs
    config.clients = config.clients.concat(subConfig.clients);
    config.dimensions = config.dimensions.concat(subConfig.dimensions);
  }

  return config;
};
