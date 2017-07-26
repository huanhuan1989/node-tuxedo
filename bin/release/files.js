import fs from 'fs'

/**
 * Files 
 */
class Files {
  constructor () {

  }

  isFile (locationPath) {
    return fs.statSync(locationPath).isFile()
  }

  ifDir (locationPath) {
    return fs.statSync(locationPath).isDirectory()
  }

  isExists (locationPath) {
    return new Promise((resolve, reject) => {
      return fs.exists(locationPath, function (exists) {
        return exists ? resolve(true) : resolve(false)
      })
    })
  }

  createDir = distDirPath => {
    return new Promise((resolve, reject) => {
      return utils.isExists(distDirPath).then(data => {
        if (data) {
          resolve(true)
          return 'exists dir!'
        }

        return fs.mkdir(distDirPath, 0777, (err) => {
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

  getFilesContent (filePath) {
    return new Promise((resolve, reject) => {
      return fs.readFile(filePath, 'utf-8', function (err, data) {
        if (err) {
          reject('creat err!')
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

export {
  Files
}