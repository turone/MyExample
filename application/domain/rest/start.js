async () => {
  // domain.rest.pages.setPage('testREST', 'testREST' + application.worker.id);
  if (!config.rest.cache) return;
  if (application.worker.id === 'W2')
    domain.rest.pages.setPage('testREST', 'testREST2');
  if (application.worker.id !== 'W1') return;

  // console.log(domain.rest.pages.getPage('testREST'));
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
