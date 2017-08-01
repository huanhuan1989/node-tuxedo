export const HREF_OR_SRC_REG = new RegExp(`(src|href)="(\/?\\w+\/.*?)"`, 'ig')
export const FILTER_OUT_DIR = ['.idea', '.vscode', '.gitignore', 'node_modules']
export const FILTER_FILES_TYPE = ['js', 'css', 'html', 'jpg', 'ico', 'png']
export const FILTER_OTHER_FILES_TYPE = ['xml', 'swf']
export const MK_DIR_PATH = ['static', 'static/other', 'static/swf']
export const options = {
  src: './src',
  dist: './online',
  filterOutDir: ['.idea', '.vscode', '.gitignore', 'node_modules'],
  type: ['js', 'css', 'html', 'jpg', 'ico', 'png'],
  otherType: ['xml', 'swf'],
  mkDir:['static', 'static/other', 'static/swf'],
}