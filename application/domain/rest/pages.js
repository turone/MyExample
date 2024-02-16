({
  page: new Map(),

  setPage(name, data) {
    const page = domain.rest.pages.page.get(name);
    if (page) return page;
    domain.rest.pages.page.set(name, data);
    return page;
  },
  getPage(name) {
    const page = domain.rest.pages.page.get(name);
    if (page) return page;
    return '404';
  },

  droppage(name) {
    domain.rest.pages.page.delete(name);
  },
});
