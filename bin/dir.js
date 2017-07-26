const MK_DIR_PATH = ['static', 'static/other', 'static/swf', 'static/swf/js', 'static/swf/img', 'static/swf/css', 'other/img', 'other/swf', 'js/other']

const arrayToObject = (arr) => {
    return arr.reduce((last, now, index) => {
            last[index] = now
            return last
        }, {})
}
const dataCollection = MK_DIR_PATH.map(elem => (elem.split('/')))
    .reduce((prev, current, index) => {
        const count = current.length
        if (count > prev.max) {
            prev.max = count
            prev.arr = current
        }
        prev.other.add(arrayToObject(current))
        return prev
    }, {max: -1, arr: [], other: new Set([])})

/**
 * 第一种方法---获取所有的。。。
*/
const dataAllArr = [...dataCollection.other]
const lastDir = dataCollection.arr.reduce((last, elem, index) => {
        let prevIndex = index
        prevIndex -= 1
        let _path = ''
        if(prevIndex <= 0) prevIndex = 0
        const lastData = dataAllArr
            .reduce((prev, item, i) => {
            const keys = Object.keys(item)
            const keysLen = keys ? keys.length : 0
            const itemData = item[index]
            if (itemData) {
                if (!prev[itemData]) {
                    prev[itemData] = {}
                    prev[itemData]['count'] = 1
                    prev[itemData]['dir'] = ''
                }else {
                    prev[itemData]['count'] += 1
                }
                
                if (prev[itemData]['count'] > prev.max) {
                    prev['max'] = prev[itemData]['count']
                    prev['str'] = itemData
                }
                const isHasItem = item[prevIndex].indexOf(itemData) == -1
                prev[itemData]['dir'] = item[index] && (isHasItem ? `/${item[prevIndex]}/${itemData}` : `/${item[prevIndex]}`)
            }
            return prev
        }, { max: -1, str: ''})
        last.push(lastData)
        return last
    }, [])
console.log('----lastDir---', lastDir)

/**
 * 第二种方法，只写了获取一级的
*/
const PATH_COPY = MK_DIR_PATH.toString()
const lastDir2 = dataCollection.arr.reduce((last, item, i) => {
    const obj2 = MK_DIR_PATH.reduce((prev, current, index) => {
        const now = current.split(/,|\//)[i]
        if(now){
            const reg = new RegExp(`${now}`, 'ig')
            const count = PATH_COPY.match(reg).length
            if (count > prev.max) {
                prev.max = count
                prev.str = current
            }
        }
        return prev
    }, { max: -1, str: '' })
    last.push(obj2)
    return last
}, [])
console.log('----lastDir2---', lastDir2)
