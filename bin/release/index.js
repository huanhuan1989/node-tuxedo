import { config } from 'config'
import { Release } from 'release'

const releaseObj = new Release({
  src: './src',
  dist: './online',
  filterOutDir: ['.idea', '.vscode', '.gitignore', 'node_modules'],
  type: ['js', 'css', 'html', 'jpg', 'ico', 'png'],
  otherType: ['xml', 'swf'],
  mkDir: ['static', 'static/other', 'static/swf'],
})
const filesAllObj = releaseObj.getAllTypeFiles()
const FILTER_OTHER_FILES_TYPE = ['xml', 'swf']

utils.upload(filesAllObj['img'].arr, {
  keepName: true
})
  .then(resetCdnSet, (err) => {
    console.log(err)
  })
  .then((data) => {
    console.log('---css-replace--done---')
    return replaceFiles(filesAllObj['css']['arr'], data)
  }, (err) => {
    console.log(err)
  })
  .then(getCssCdnPath, (err) => {
    console.log(err)
  })
  .then((data) => {
    return releaseObj.getJsCdnPath(filesAllObj['js']['arr'], data)
  }, (err) => {
    console.log(err)
  })
  .then((data) => {
    console.log('---html-replace--done---')
    return releaseObj.replaceFiles(filesAllObj['html']['arr'], data, 'js')
  }, (err) => {
    console.log(err)
  })
  .then(releaseObj.createFilesToDir, (err) => {
    console.log(err)
  })
  .then(data => {
    console.log('---copy--done---')
    return copyOtherFiles(FILTER_OTHER_FILES_TYPE)
  }, (err) => {
    console.log(err)
  })
