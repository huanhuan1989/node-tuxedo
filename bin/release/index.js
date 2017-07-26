import Base from 'base'

/**
 * Release
 */
class Release extends Base{

    constructor (...arg) {
      super(...arg)
    }

    getLastImgSet () {
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

    reduceArrayFilesByTypes (prev, current) {
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
        .map(super.getElementObject)
        .reduce(reduceArrayFilesByTypes, {img: {}})
    }
}

export {
    Release
}