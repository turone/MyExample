async (client, { path, getPar, verb, body }) => {
  console.table({ path, getPar, verb, body });
  // const { ip } = context.client;
  console.log(domain.rest.pages.getPage('testREST'));
  return { data: 'ip ' + domain.rest.pages.getPage('testREST') };
};
