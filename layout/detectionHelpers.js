// Helper functions for layout auto-detection

export const calculateWidth = (client, monitorDimensions) => {
  return client.size[0] / monitorDimensions.width;
};

export const calculateHeight = (client, monitorDimensions) => {
  return client.size[1] / monitorDimensions.height;
};

export const isHorizontalRowLayout = (clients) => {
  if (clients.length < 2) return true;
  const firstY = clients[0].at[1];
  return clients.every((client) => client.at[1] === firstY);
};

export const autoDetectHorizontalLayout = (
  name,
  clientCount,
  clients,
  clientsConfig,
  monitorDimensions
) => {
  if (clients.length !== clientCount) return null;
  if (!isHorizontalRowLayout(clients)) return null;

  const dimensions = clients
    .slice(0, -1) // Last dimension is redundant (e.g. it's the remainder)
    .map((client) => ({ width: calculateWidth(client, monitorDimensions) }));

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
  monitorDimensions
) => {
  if (clients.length !== clientCount) return null;
  if (!isVerticalColumnLayout(clients)) return null;

  const dimensions = clients
    .slice(0, -1) // Last dimension is redundant (e.g. it's the remainder)
    .map((client) => ({
      height: calculateHeight(client, monitorDimensions),
    }));

  return {
    layout: name,
    clients: clients.map((client) => clientsConfig[client.address]),
    dimensions: dimensions,
  };
};
