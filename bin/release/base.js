import glob from 'glob'
import Files from 'files'
import Cdn from 'cdn'
import promise from 'promise'


/**
 * Base 方法
 */
class Base extends Files{
  constructor (...arg) {
    super(...arg)
    this.Cdn = new Cdn(...arg)
  }

  getElementObject (distPath, elem) {
    const data = this.getFilesNormalize(distPath, elem)
    return {
      name: elem,
      [elem]: {
        obj: data.obj,
        arr: data.arr
      }
    }
  }

  getFilesNormalize (path, type) {
    let entryObjSet = {}
    let entryArrSet = []
    return glob.sync(path + '/**/*.' + type)
    .map(elem => ({ name: utils.getName(elem), value: elem }))
    .reduce((prev, current) => {
      prev['obj'][current.name] = current.value
      prev['arr'].push(current.value)
      return prev
    }, {obj: {}, arr: []})
  }
  
  getFilesName (locationPath) {
    const num = locationPath.lastIndexOf('/') + 1
    locationPath = locationPath.substring(num)
    return locationPath
  }

  getTypeName (name, type) {
    const reg = new RegExp(`(\\w+\.${type})+`,)
    return name.match(reg)[0]
  }

  deleteItem (obj, type) {
    delete obj[type]
    return utils
  }

  getCurrentItem (data, current, type) {
    if (current['name'] == type) {
      data[type] = current[type]
    }
    return data
  }
}

export {Base}
