async () => {
  if (!config.rest.cache) return;
  if (application.worker.id !== 'W1') return;
  domain.rest.pages.setPage('testREST');
  //console.log(domain.rest.pages.getPage('testREST'));
  try {
    const rest = {
      expr: 'REST',
      precision: 3,
    };
    console.log(rest);
  } catch {
    console.log('Can not access math server');
  }
};
