const cdn = require("@q/qcdn")
const glob = require("glob")
const promise = require('promise')
const fs = require("fs")

const utils = {}

utils.getName = locationPath => {
    const num = locationPath.lastIndexOf('/') + 1
    locationPath = locationPath.substring(num)
    return locationPath
}

utils.isFile = locationPath => {
    return fs.statSync(locationPath).isFile()
}

utils.isDir = locationPath => {
    return fs.statSync(locationPath).isDirectory()
}
//existsDir
utils.isExists = locationPath => {
    return new Promise((resolve, reject) => {
        return fs.exists(locationPath, function (exists) {
            return exists ? resolve(true) : resolve(false)
        })
    })
}

utils.createDir = distDirPath => {
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

utils.readFileSync = locationPath => {
    return fs.readFileSync(locationPath, "utf-8")
}

utils.writeFileSync = (distFilesPath, content) => {
    return fs.writeFileSync(distFilesPath, content)
}

utils.codeMin = (code, type) => {
    return cdn.min(code, type)
}

utils.upload = files => {
    return cdn.upload(files)
}

utils.getJsName = (name, type) => {
    return name.match(/(\w+\.js)+/)[0]
}

utils.deleteItem = (obj, type) => {
    delete obj[type]
    return utils
}

utils.getCurrentItem = (data, current, type) => {
    if (current['name'] == type) {
        data[type] = current[type]
    }
    return data
}

utils.getFilesContent = (filePath) => {
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

utils.getNormalize = (path, type) => {
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

module.exports = utils
