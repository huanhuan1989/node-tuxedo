import { Base } from 'base'
import { Cdn } from 'cdn'
import * as config from 'config'
import promise from 'promise'

/**
 * Release 继承 Base
 */
class Release extends Base{

    constructor (...arg) {
      super(...arg)
      this.opts = arg[0]
      this.srcPath = this.opts.src || config.options.src
      this.distPath = this.opts.dist || config.options.dist
    }

    static getLastImgSet (data) {
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

        super.deleteItem(data, 'jpg')
          .deleteItem(data, 'png')
          .deleteItem(data, 'ico')
      }

      return data
    }

    static reduceArrayFilesByTypes (prev, current) {
      prev['img'] = Object.assign(
        super.getCurrentItem(prev['img'], current, 'jpg'), 
        super.getCurrentItem(prev['img'], current, 'png'), 
        super.getCurrentItem(prev['img'], current, 'ico'))

      prev[current['name']] = current[current['name']]
      prev = this.getLastImgSet(prev)
      
      return prev
    }

    getArrayFilesByTypes (arr) {
      return arr
        .map(data => {
          super.getElementObject(this.opts.src || config.options.src, data)
        })
        .reduce(reduceArrayFilesByTypes, {img: {}})
    }
    
    formatCdnName (data) {
      const objKeys = Object.keys(data)
      return objKeys.map(item => ({name: super.getFilesName(item), value: data[item]}))
        .reduce((prev, current) => {
          prev[current.name] = current.value
          return prev
        }, {})
    }

    replaceCdnByCssFile({
      url,
      str,
      localPath
    }) {
      let pathReg = new RegExp(`[..\/|\/].*${localPath}`, 'ig')
      return str.replace(pathReg, url)
    }

    replaceCdnByJsFile({
      url,
      reg,
      str,
      localPath
    }) {
      let pathReg = new RegExp(`\/?\\w+(\/\\w+)+\/${localPath}.*`, 'ig')
      return str.replace(reg, ($1) => {
        if ($1.indexOf(localPath)) {
          return $1.replace(pathReg, ($2) => {
            $2 = url
            return $2 + '"'
          })
        }
      })
    }

    getCdnDataByType (item) {
      const opts = {
        url: item.url,
        value: item.value
      }
      
      const jsTypeData = Object.assign({}, opts,{
        reg: config.HREF_OR_SRC_REG
      })

      const cssTypeData = Object.assign({}, opts, {
        reg: ''
      })

      return type = 'js' ? jsTypeData : cssTypeData
    }

    contentUrlChangeToCDN({
      arr = [],
      data = {},
      str = '',
      type = 'css'
    }) {
      return arr.map(item => ({ url: data[localPath], value: item }))
        .filter(getCdnDataByType)
        .reduce((prev, current) => {
          const methodName = `replaceCdnBy${super.firstLetterUpperCase(type)}File`
          prev = methodName({
            url: current.url,
            localPath: current.value,
            str: prev,
            reg: current.reg
          })
          return prev
        }, str)
    }

    rawDataFormatCdn (item) {
      return { 
        name: super.getFilesName(item), 
        cdnKeys: Object.keys(cdnData), 
        str: super.readFileSync(item) 
      }
    }

    replaceFilesContent (arr = [], cdnData = {}, type = 'css') {
      return arr.map(rawDataFormatCdn)
        .reduce((prev, current) => {
          prev[current.nam] = contentUrlChangeToCDN({
            arr: current.cdnKeys,
            data: cdnData,
            str: current.str,
            type
          })

          return type === 'css' ? {
            obj: cdnData,
            content: prev
          } : prev
        }, {})
    }

    getCdnByFileContent (filesObj) {
      const obj = filesObj['content']
      return new promise(async (resolve, reject) => {
        const objKeys = Object.keys(obj)
        return objKeys.map(item => ({ key: item, value: obj[item] }))
          .reduce((prev, current) => {
            const cdnPath = await Cdn.content(filesObj['content'][keys], 'css')
            if (cdnPath) {
              prev[current['key']] = cdnPath
              prev = Object.assign({}, filesObj['obj'], prev)
              resolve(result)
              console.log('---css--cdn--done---')
            } else {
              reject(err)
            }
            return prev
          }, {})
      })
    }

    async getJsCdnPath (arr, pathObj) {
      const cdnPathArr = await Cdn.upload(arr, {
        keepName: true
      })
      if (cdnPathArr) {
        return Object.assign({}, resetCdnSet(data), pathObj)
      } else {
        throw new error(cdnPathArr)
      }
    }

    async createFilesToDir (data) {
      const files = await super.createDir(this.distPath)
      files && writeFiles(data, this.distPath)
      files && console.log('---files--write--done---')
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

    getAllTypeFiles () {
      return this.getArrayFilesByTypes(this.opts.filterType || config.FILTER_FILES_TYPE)
    }
}

export {
    Release
}