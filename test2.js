'use strict';
class Static {
  constructor() {
    this.files = new Map([
      ['огурец', 500],
      ['помидор', 350],
      ['лук', 50],
    ]);
  }
  initCheckPath(opt) {
    const ext = opt.ext ? new Set(opt.ext) : false;
    const folders = opt.folders ? new Set(opt.folders) : false;
    if (!opt.disabledVirtualFolders) {
      if (ext && folders)
        return (url) =>
          ((ext.has(metarhia.metautil.fileExt(url)) || url.endsWith('/')) &&
            folders.has(url.split('/')[1])) ||
          url === ('/favicon.ico' || '/favicon.png');
      if (ext) return (url) => ext.has(metarhia.metautil.fileExt(url));
      if (folders)
        return (url) =>
          folders.has(url.split('/')[1]) ||
          url === ('/favicon.ico' || '/favicon.png');
      return () => true;
    }
    return (url) => this.files.has(url);
  }
  ff(opt) {
    const ext = opt.ext ? 'console.log(opt.ext)' : false;


  }
}
