module.exports = {
  HREF_OR_SRC_REG: new RegExp(`(src|href)="(\/?\\w+\/.*?)"`, 'ig'),
  FILTER_OUT_DIR: ['.idea', '.vscode', '.gitignore', 'node_modules'],
  FILTER_FILES_TYPE: ['js', 'css', 'html', 'jpg', 'ico', 'png'],
  FILTER_OTHER_FILES_TYPE: ['xml', 'swf'],
  MK_DIR_PATH: ['static', 'static/other', 'static/swf'],
  options: {
    src: './src',
    dist: './online',
    filterOutDir: ['.idea', '.vscode', '.gitignore', 'node_modules'],
    type: ['js', 'css', 'html', 'jpg', 'ico', 'png'],
    otherType: ['xml', 'swf'],
    mkDir: ['static', 'static/other', 'static/swf']
  },
  defaultCopyParam: {
    from: '',
    to: '',
    toType: 'file',
    create: ''
  }
}