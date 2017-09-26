const Release = require('./release')

const releaseObj = new Release({
  src: '../../youqian/output',
  dist: '../../youqian/online',
  filterOutDir: ['.idea', '.vscode', '.gitignore', 'node_modules'],
  type: ['jpg', 'ico', 'png','js', 'css', 'html'],
  resolve: 'html',
  copy: [
    {
      from: 'static/swf/*'
    },
    {
      from: 'static/other/*'
    }
  ]
})