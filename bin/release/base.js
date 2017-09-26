const Cdn = require('./cdn')
const glob = require('glob')
const Files = require('./files')

/**
 * Base 方法
 */
class Base extends Files{
  constructor (...arg) {
    super(...arg)
    this.Cdn = new Cdn(...arg)
  }

  /**
   * firstLetterUpperCase 首字母大写
   * @param  [{String}]  str  内容
   * return  首字母大写后的整体内容
   */
  firstLetterUpperCase (str) {
    const otherLetter = str.substring(1)
    const firstLetter = str.charAt(0)
    const upperCase = firstLetter.toLocaleUpperCase()
    return `${upperCase}${otherLetter}`
  }
  
  /**
   * getElementObject 根据类型获取文件列表并返回包裹数据
   * @param  [{String}]  srcPath  原始路径
   * @param  [{String}]  type     文件类型
   * return  返回聚合数据
   */
  getElementObject (srcPath, type) {
    const data = this.getFilesNormalize(srcPath, type)
    return {
      name: type,
      [type]: {
        obj: data.obj,
        arr: data.arr
      }
    }
  }
  
  /**
   * getFilesName 获取文件名称
   * @param  [{String}]  locationPath  原始数据
   * return  返回新名称
   */
  getFilesName (locationPath) {
    const num = locationPath.lastIndexOf('/') + 1
    locationPath = locationPath.substring(num)
    return locationPath
  }

  /**
   * getTypeName 获取类型名称
   * @param  [{String}]  str   原数据
   * @param  [{String}]  type  文件类型
   * return  压缩后的文件内容
   */
  getTypeName (str, type) {
    const reg = new RegExp(`(\\w+\.${type})+`,)
    return str.match(reg)[0]
  }
  
  /**
   * deleteItem 删除对象
   * @param  [{Object}]  obj  文件内容
   * @param  [{String}]  key  属性
   * return  对象
   */
  deleteItem (obj, key) {
    delete obj[key]
    return this
  }

  /**
   * getCurrentItem 根据类型一致，copy
   * @param  [{Object}]  data    数据源
   * @param  [{Object}]  current  当前对象
   * @param  [{String}]  type  文件类型
   * return  对象
   */
  getCurrentItem (data, current, type) {
    if (current['name'] == type) {
      data[type] = current[type]
    }
    return data
  }

  formatCdnName (data) {
    const objKeys = Object.keys(data)
    return objKeys.map(item => ({name: this.getFilesName(item), value: data[item]}))
      .reduce((prev, current) => {
        prev[current.name] = current.value
        return prev
      }, {})
  }

  normalize (opts, data) {
    return opts
    .map(el => Object.assign({}, data, el))
    .filter(el => {
        if( !el.to ) {
            el.to = el.from
        }
        return el
    })
  }

  /**
   * getFilesNormalize 根据不同的数据格式，返回数组
   * @param  [{String}]  path  文件路径
   * @param  [{String}]  type  文件类型
   * return  压缩后的文件内容
   */
  getFilesNormalize (path, type) {
    const self = this
    let entryObjSet = {}
    let entryArrSet = []
    return glob.sync(`${path}/**/*.${type}`)
    .map(elem => ({ name: self.getFilesName(elem), value: elem }))
    .reduce((prev, current) => {
      prev['obj'][current.name] = current.value
      prev['arr'].push(current.value)
      return prev
    }, {obj: {}, arr: []})
  }
  includes(el, arr) {
    let lastArr = config.FILTER_OUT_DIR
    if(arr) {
      lastArr = [...new Set([...arr, ...config.FILTER_OUT_DIR])]
    }
    return lastArr.includes(el)
  }

  /**
   * filesAndDir
   * @param {*} entryPath 
   * @param {*} fullPath 
   * 分析目录和文件
   * static/js/**
   * static/swf/ZeroClipboard.swf
   * 1. 判断是不是文件，2，切分
   */
  filesAndDir (entryPath, distPath, fullPath) {
    const self = this
    let result = glob.sync(fullPath)
    .map(el => self.fileAndDirNormalize.bind(self)(entryPath, distPath, el))
    .reduce((prev, current) => {
      const newPathArr = current.value.replace(distPath, '').replace(current.name, '').split('/')
      const lastPath = newPathArr.filter(el => el)
        .map((el, index) => ({name: el, key: index}))
        .reduce((pries, now) => {
          let lastPath = `${distPath}/${now.name}`
          if(now.key) {
            lastPath = `${pries[now.key - 1]}/${now.name}`
          }
          const entry = lastPath.replace(distPath, entryPath)
          if(super.isDir(entry)) {
            prev['dir'].push(lastPath)
          }else {
            prev['file'].push({
              src: entry,
              dist: lastPath
            })
          }
          pries.push(lastPath)
          return pries
        }, [])
      if( current.dir ) {
        prev['dir'].push(current.value)
      } else {
        prev['file'].push({
          src: current.value.replace(distPath, entryPath),
          dist: current.value
        })
      }
      return prev
    }, {dir: [], file: []})
    return {
      dir: [...new Set(result.dir)],
      file: [...new Set(result.file)]
    }
  }

  /**
   * getFiles 获取文件arr
   * @param  {String} entryPath  原始路径
   * @param  {String} distPath   输出路径
   * @param  {String} fullPath   完整输出路径
   * @return {Arrary} 所有文件
   */
  getFiles (...arg) {
    /* const fileName = lastPath.match(/\.(.*)/)
    let isOk = false
    if(fileName){
      isOk = self.includes(fileName)
    } */
    return [...new Set(this.filesAndDir(...arg).file)]
  }

  /**
   * getDir 获取文件目录结构arr
   * @param  {String} entryPath  原始路径
   * @param  {String} distPath   输出路径
   * @param  {String} fullPath   完整输出路径
   * @return {Arrary} 所有目录
   */
  getDir (...arg) {
    return [...new Set(this.filesAndDir(...arg).dir)]
  }
}

module.exports = Base
