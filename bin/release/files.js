const fs = require('fs')
const promise = require('promise')

/**
 * Files 
 */
class Files {
  constructor () {
    this.DEF_IMG_TYPE = ['jpg', 'png', 'ico', 'gif', 'bmp', 'jpeg', 'tiff', 'svg', 'swf']
  }

  isFile (locationPath) {
    return fs.statSync(locationPath).isFile()
  }

  isDir (locationPath) {
    return fs.statSync(locationPath).isDirectory()
  }

  isExists (locationPath) {
    return new Promise((resolve, reject) => {
      return fs['exists'](locationPath, function (exists) {
        console.log(exists)
        return exists ? resolve(true) : resolve(false)
      })
    })
  }

  isExistsSync (locationPath) {
    return fs.existsSync(locationPath)
  }

  getSuffix (entry) {
    if(entry.indexOf('.') != -1) {
      return entry.match(/\.(\w+)/)[1]
    }
    return ''
  }

  getFileType (entry) {
    const self = this
    const suffix = self.getSuffix(entry)
    let result = false
    self.DEF_IMG_TYPE
    .map(item => ({name: item}))
    .filter(item => {
      if(item.name === suffix){
        result = true
      }
      return item
    })

    return result
  }

  createDirSync (distDirPath) {
    const self = this
    const isExists = self.isExistsSync(distDirPath)
    if(isExists) {
      return isExists
    }
    fs.mkdirSync(distDirPath)
  }

  createDir (distDirPath) {
    const self = this
    return new Promise((resolve, reject) => {
      return self.isExists(distDirPath).then(data => {
        if (data) {
          resolve(true)
          return 'exists dir!'
        }
        return fs.mkdirSync(distDirPath, (err, mk) => {
          if (err) {
            reject(err)
            return 'creat err!'
          }
          resolve(true)
          return 'creat done!'
        })
      }, err => (console.log('----createDir方法-----', err)))
    })
  }

  readFileSync (locationPath) {
    return fs.readFileSync(locationPath, "utf-8")
  }

  writeFileSync (distFilesPath, content) {
   return fs.writeFileSync(distFilesPath, content)
  }

  writeFiles (distFilesPath, content) {
    return new Promise((resolve, reject) => {
      return fs.writeFile(distFilesPath, content, function (err, data) {
        if (err) {
          reject(false)
          return 'creat err!'
        }
        resolve(data)
        return data
      })
    })
  }
  
  getFilesContent (filePath) {
    const type = this.getFileType(filePath)
    const bufferC = type ? '' : 'utf-8'
    return new Promise((resolve, reject) => {
      return fs.readFile(filePath, bufferC, function (err, data) {
        if (err) {
          reject(false)
          return 'creat err!'
        }
        resolve(data)
        return data
      })
    })
  }

  readdir (localPath) {
    return new Promise((resolve, reject) => {
      return fs.readdir(localPath, (err, files) => {
        if(err){
          reject(err)
        }
        resolve(files)
      })
    })
  }
}

module.exports = Files