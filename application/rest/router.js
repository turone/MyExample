async (client, { path, getPar, verb, body }) => {
  console.dir(path, getPar, verb, body);
  // const { ip } = context.client;
  return { data: 'ip ' };
};
