const cdn = require("@q/qcdn")
const promise = require('promise')
const dirVars = require('../webpack-config/base/dir-vars.config.js')
const project = require('../webpack-config/base/project.config.js')
const utils = require('./utils')
const outputPath = dirVars.buildDir
const rootPath = dirVars.proRootDir
const FILTER_OUT_DIR = ['.idea', '.vscode', '.gitignore', 'node_modules']
const FILTER_FILES_TYPE = ['js', 'css', 'html', 'jpg', 'ico', 'png']
const FILTER_OTHER_FILES_TYPE = ['xml', 'swf']
const MK_DIR_PATH = ['static', 'static/other', 'static/swf']   //fs.readdir

const getElement = elem => {
    const data = utils.getNormalize(outputPath, elem)
    return {
        name: elem,
        [elem]: {
            obj: data.obj,
            arr: data.arr
        }
    }
}

const getLastImgSet = data => {

    const jpg = data['img']['jpg']
    const png = data['img']['png']
    const ico = data['img']['ico']

    if (jpg && png && ico) {
        const imgObj = Object.assign(jpg.obj, png.obj, ico.obj)
        const imgArr = [...jpg.arr, ...png.arr, ...ico.arr]
        data['img'] = {
            obj: imgObj,
            arr: imgArr
        }

        utils.deleteItem(data, 'jpg')
            .deleteItem(data, 'png')
            .deleteItem(data, 'ico')
    }

    return data
}

const getAllFilesSet = (prev, current) => {
    prev['img'] = Object.assign(
        utils.getCurrentItem(prev['img'], current, 'jpg'), 
        utils.getCurrentItem(prev['img'], current, 'png'), 
        utils.getCurrentItem(prev['img'], current, 'ico'))

    prev[current['name']] = current[current['name']]
    prev = getLastImgSet(prev)
    
    return prev
    /* return {
        [current[name]]: current[current[name]],
        ...prev
    } */
}

const findAllFilesHandler = arr => {
    return arr
        .map(getElement)
        .reduce(getAllFilesSet, {img: {}})
}

const filesObj = findAllFilesHandler(FILTER_FILES_TYPE)

const resetCdnSet = data => {
    let result = {}
    for (let keys in data) {
        const _keys = data[keys]
        keys = utils.getName(keys)
        result[keys] = _keys
    }
    return result
}

const getJsFileReplace = ({
    url,
    prev,
    localPath,
    pathAllReg
}) => {
    let pathReg = new RegExp(`\/?\\w+(\/\\w+)+\/${localPath}.*`, 'ig')
    return prev.replace(pathAllReg, ($1) => {
        if ($1.indexOf(localPath)) {
            return $1.replace(pathReg, ($2) => {
                $2 = url
                return $2 + '"'
            })
        }
    })
}

const getCssFileReplace = ({
    url,
    localPath,
    prev
}) => {
    let pathReg = new RegExp(`[..\/|\/].*${localPath}`, 'ig')
    return prev.replace(pathReg, url)
}

const getReplaceFileContent = ({
    arr = [], 
    data = {}, 
    str = '', 
    type = 'css'
}) => {
    return arr.reduce((prev, localPath) => {
        let url = data[localPath]
        prev = type === 'js' ? getJsFileReplace({
            url, 
            localPath,
            prev,
            pathAllReg: new RegExp(`(src|href)="(\/?\\w+\/.*?)"`, 'ig')
        }) : getCssFileReplace({
            url, 
            localPath,
            prev
        })
        return prev
    }, str)
}

const replaceFiles = (arr = [], cdnData = {}, type = 'css') => {
    return arr.reduce((prev, current) => {
        const currentName = utils.getName(current)
        const keysArr = Object.keys(cdnData)
        let str = utils.readFileSync(current)
        prev[currentName] = getReplaceFileContent({
            arr: keysArr, 
            data: cdnData, 
            str,
            type
        })

        return type === 'css' ? {
            obj: cdnData,
            content: prev
        }: prev
    }, {})
}

const getCssCdnPath = filesObj => {
    return new promise((resolve, reject) => {
        let result = {}
        for (let keys in filesObj['content']) {
            return cdn.content(filesObj['content'][keys], 'css').then((path) => {
                result[keys] = path
                result = Object.assign(filesObj['obj'], result)
                resolve(result)
                console.log('---css--cdn--done---')
                return result
            }, (err) => {
                reject(err)
            })
        }
    })
}

const getJsCdnPath = pathObj => {
    return utils.upload(filesObj['js'].arr, {
        keepName: true
    }).then((data) => {
        console.log('---js--cdn--done---')
        return Object.assign(resetCdnSet(data), pathObj)
    })
}

const writeFiles = (data, path) => {
    for (let keys in data) {
        const distFilesPath = `${path}/${keys}`
        utils.writeFileSync(distFilesPath, data[keys])
    }
}

const isOnline = data => {
    const distDirPath = `${rootPath}/${data}`
    return utils.isDir(distDirPath)
}

const createFilesToDir = data => {
    const distDirPath = `${rootPath}/online`
    utils.createDir(distDirPath).then(type => {
        type && writeFiles(data, distDirPath)
        type && console.log('---files--write--done---')
        return 'creat done!'
    }, err => {
        console.log('----createDir--er----', err)
    })
}


const copy = (devPath, fn) => {
    utils.isExists(devPath).then(data => {
        if (data) {
            const distFilesPath = devPath.replace('output', 'online')
            const str = utils.readFileSync(devPath)
            utils.writeFileSync(distFilesPath, str)
            fn && fn(str)
        }
    })
}

const copyFilesHandler = (arr, devDirPath, current) => {
    return arr
        .map(getElement)
        .filter(elem => (current['name'] !== 'static'))
        .reduce((prev, current) => {
            const itemObj = current[current['name']].obj
            for (let keys in itemObj) {
                const devFilesPath = `${devDirPath}/${keys}`
                copy(devFilesPath, (str) => {
                    prev[keys] = itemObj[keys]
                    prev['str'] = str
                })
            }
            return prev
        }, {})
}

//copy
const copyOtherFiles = arr => {
    const devRootDirPath = `${rootPath}/output`
    const distRootDirPath = `${rootPath}/online`
    return MK_DIR_PATH
        .map(elem => ({ name: elem }))
        .reduce((prev, current) => {
            const devDirPath = `${devRootDirPath}/${current.name}`
            const distDirPath = `${distRootDirPath}/${current.name}`
            prev = utils.createDir(distDirPath).then(data => {
                return copyFilesHandler(arr, devDirPath, current)
            }, err => {
                console.log('----createDir--er----', err)
            })
        }, {})
}

utils.upload(filesObj['img'].arr, {
    keepName: true
})
    .then(resetCdnSet, (err) => {
        console.log(err)
    })
    .then((data) => {
        console.log('---css-replace--done---')
        return replaceFiles(filesObj['css']['arr'], data)
    }, (err) => {
        console.log(err)
    })
    .then(getCssCdnPath, (err) => {
        console.log(err)
    })
    .then(getJsCdnPath, (err) => {
        console.log(err)
    })
    .then((data) => {
        console.log('---html-replace--done---')
        return replaceFiles(filesObj['html']['arr'], data, 'js')
    }, (err) => {
        console.log(err)
    })
    .then(createFilesToDir, (err) => {
        console.log(err)
    })
    .then(data => {
        console.log('---copy--done---')
        return copyOtherFiles(FILTER_OTHER_FILES_TYPE)
    }, (err) => {
        console.log(err)
    })
