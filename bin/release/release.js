const path = require('path')
const Cdn = require('./cdn')
const Base = require('./base')
const Copy = require('../copy/index.js')
const config = require('./config')
const promise = require('promise')
const qCdn = new Cdn()
/**
 * Release 继承 Base
 */
class Release extends Base{

    constructor (...arg) {
      super(...arg)
      this.opts = arg[0]
      this.srcPath = path.resolve(__dirname, this.opts.src) || config.options.src
      this.distPath = path.resolve(__dirname, this.opts.dist) || config.options.dist
      this.createFilesToDir()
      this.getAllTypeFiles()
    }

    updataCdnFils (prev, current) {
      this.cdnFilsObj = Object.assign({}, prev, current)
    }

    upload() {
      const self = this
      qCdn.upload(this.filesAllObj['img'].arr, {
        keepName: true
      })
      .then(super.formatCdnName.bind(this), (err) => {
        console.log(err)
      })
      .then((data) => {
        self.updataCdnFils(data)
        console.log('---css-replace--done---')
        return self.replaceFilesContent(self.filesAllObj['css']['arr'], data)
      }, (err) => {
        console.log(err)
      })
      .then(self.getCdnByFileContent.bind(self), (err) => {
          console.log(err)
      })
      .then((data) => {
        self.updataCdnFils(data)
        console.log('---css-cdn--done---')
        console.log('---js--cdn--start---')
        return self.getJsCdnPath(self.filesAllObj['js']['arr'], data)
      }, (err) => {
        console.log(err)
      })
      .then((data) => {
        return self.replaceFilesContent(self.filesAllObj[self.opts.resolve]['arr'], data, 'js')
      }, (err) => {
          console.log(err)
      })
      .then((data) => {
        console.log('---html-replace--done---')
        self.writeFiles(data)
        //还差最后一步存文件，哈哈
        //console.log('----html----', data[data.length-1])
        //self.createFilesToDir(data)
      }, (err) => {
          console.log(err)
      })
    }

    deleteTypeFile (data) {
      super.deleteItem(data, 'jpg')
        .deleteItem(data, 'png')
        .deleteItem(data, 'ico')
    }

    getLastImgSet (data) {
      const jpg = data['img']['jpg']
      const png = data['img']['png']
      const ico = data['img']['ico']

      if (jpg && png && ico) {
        const imgObj = Object.assign({}, jpg.obj, png.obj, ico.obj)
        const imgArr = [...jpg.arr, ...png.arr, ...ico.arr]

        data['img'] = {
          obj: imgObj,
          arr: imgArr
        }

        //this.deleteTypeFile(data)

      }
      
      return data
    }

    reduceArrayFilesByTypes (prev, current) {
      prev['img'] = Object.assign({},
        super.getCurrentItem(prev['img'], current, 'jpg'), 
        super.getCurrentItem(prev['img'], current, 'png'), 
        super.getCurrentItem(prev['img'], current, 'ico'))

      prev = this.getLastImgSet(prev)
      prev[current['name']] = current[current['name']]
      return prev
    }

    getArrayFilesByTypes (arr) {
      const self = this
      return  arr
        .map(data => super.getElementObject(this.srcPath || config.options.src, data))
        .reduce(self.reduceArrayFilesByTypes.bind(self), {name: 'img', img: {}})
    }
  
    replaceCdnByCssFile({
      url,
      str,
      name
    }) {
      let pathReg = new RegExp(`[..\/|\/](\\w+\/)+${name}`, 'ig')
      return str.replace(pathReg, url)
    }

    replaceCdnByJsFile({
      name,
      url,
      str,
      reg
    }) {
      let pathReg = new RegExp(`\/?\\w+(\/\\w+)+\/${name}.*`, 'ig')
      return str.replace(reg, ($1) => {
          if ($1.indexOf(name)) {
              return $1.replace(pathReg, ($2) => {
                  $2 = url
                  return $2 + '"'
              })
          }
      })
    }

    contentUrlChangeToCDN({
      objArr = [],
      data = {},
      str = '',
      type = 'css'
    }) {
      const self = this
      return objArr.map(item => ({ url: data[item], name: item, type, reg: config.HREF_OR_SRC_REG}))
        .reduce((prev, current) => {
          const methodName = `replaceCdnBy${super.firstLetterUpperCase(type)}File`
          return prev = self[methodName]({
            name: current.name,
            url: current.url,
            str: prev,
            reg: current.reg
          })
        }, str)
    }

    rawDataFormatCdn (item) {
      return { 
        name: super.getFilesName(item),
        str: super.readFileSync(item) 
      }
    }

    replaceFilesContent (arr = [], cdnData = {}, type = 'css') {
      const self = this
      return arr.map(this.rawDataFormatCdn)
        .reduce((prev, current) => {
          prev.push({
            'name': current.name,
            'str': self.contentUrlChangeToCDN({
              objArr: Object.keys(cdnData),
              data: cdnData,
              str: current.str,
              type
            })
          })
          return type === 'css' ? {
            cdn: cdnData,
            content: prev
          } : prev
        }, [])
    }

    getCdnByFileContent (filesObj) {
      const strObjArr = filesObj['content']
      return new promise((resolve, reject) => {
        return strObjArr.map(item => ({ name: item.name, value: item.str }))
          .reduce(async (prev, current) => {
            const cdnPath = await qCdn.content(current.value, 'css')
            if (cdnPath) {
              prev[current['name']] = cdnPath
              prev = Object.assign({}, filesObj['cdn'], prev)
              resolve(prev)
            } else {
              reject(err)
            }
            return prev
          }, {})
      })
    }

    async getJsCdnPath (arr, data) {
      const cdnData = await qCdn.upload(arr, {
        keepName: true
      })
      if (cdnData) {
        const formatCdn = super.formatCdnName(cdnData)
        const lastData = Object.assign({}, formatCdn, data)
        this.updataCdnFils(lastData)
        return lastData
      } else {
        throw new error(cdnData)
      }
    }

    async createFilesToDir (data) {
      const self = this
      
      super.createDirSync(this.distPath)
      new Copy({
        entry: this.srcPath,
        dist: this.distPath,
        copy: this.opts.copy
      })
      console.log('--mkdir-and-copy-file-done---')
    }

    copyFiles (arr) {
      const devRootDirPath = this.srcPath
      const distRootDirPath = this.distPath
      return config.MK_DIR_PATH
        .map(item => ({ name: item, devDirPath: `${devRootDirPath}/${item}`, distDirPath: `${distRootDirPath}/${item}`}))
        .reduce(async (prev, current) => {
          const files = await super.createDir(current.distDirPath)
          if (files || !files) {
            prev = await copyFilesHandler(arr, current.devDirPath, current)
          }
          return prev
        }, {})
    }

    writeFiles (data) {
      const self = this
      /* [{
        name: 'weihu.html',
        str: 'xxxxxx'
      }] */
      data.forEach((el, index) => {
        super.writeFileSync(`${self.distPath}/${el.name}`, el.str)
        /* 异步有问题，需解决
        const files = await super.writeFiles(`${self.distPath}/${el.name}`, el.str)
        if (!files) {
          self.writeFiles(data)
        } */
        return el
      })
    }

    getAllTypeFiles () {
      this.filesAllObj = this.getArrayFilesByTypes(this.opts.type || config.FILTER_FILES_TYPE)
      this.upload()
      return this
    }
}

module.exports = Release