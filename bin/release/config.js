export const options = {
  src: './src',
  dist: './online',
  hrforsrc: new RegExp(`(src|href)="(\/?\\w+\/.*?)"`, 'ig'),
  FILTER_OUT_DIR: ['.idea', '.vscode', '.gitignore', 'node_modules'],
  FILTER_FILES_TYPE: ['js', 'css', 'html', 'jpg', 'ico', 'png'],
  FILTER_OTHER_FILES_TYPE: ['xml', 'swf'],
  MK_DIR_PATH: ['static', 'static/other', 'static/swf'],
}