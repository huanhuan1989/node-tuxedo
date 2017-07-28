import glob from 'glob'
import {Files} from 'files'
import {Cdn} from 'cdn'

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
      name: elem,
      [elem]: {
        obj: data.obj,
        arr: data.arr
      }
    }
  }
  /**
   * getFilesNormalize 根据不同的数据格式，返回数组
   * @param  [{String}]  path  文件路径
   * @param  [{String}]  type  文件类型
   * return  压缩后的文件内容
   */
  getFilesNormalize (path, type) {
    let entryObjSet = {}
    let entryArrSet = []
    return glob.sync(path + '/**/*.' + type)
    .map(elem => ({ name: utils.getFilesName(elem), value: elem }))
    .reduce((prev, current) => {
      prev['obj'][current.name] = current.value
      prev['arr'].push(current.value)
      return prev
    }, {obj: {}, arr: []})
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
    return obj
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
}

export {Base}
