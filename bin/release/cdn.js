import qcdn from '@q/qcdn'

/**
 * Cdn 上传CDN
 */
class Cdn {
  constructor (...arg) {
    
  }

  /**
   * codeMin 压缩代码
   * @param  [{String}]  code  文件内容
   * @param  [{String}]  type  文件类型(文件扩展名),留空为自动判断
   * return  压缩后的文件内容
   */
  codeMin (code, type) {
    return qcdn.min(code, type)
  }

  /**
   * upload 上传文件
   * @param  [{String}]  filePath  文件路径/文件路径数组
   * @param  [{Object}]  opts      *[可选]*参数
      * https 是否使用https,默认false
      * force 是否忽略错误,默认false
      * keepName 是否保留文件名,默认false
      * all 是否忽略隐藏文件,默认false
      * directory 返回结果中的相对路径参照值
      * domains 自定义cdn域名,值需为数组,会自动进行散列
      * image 图片相关参数
      * static 静态资源相关参数
   * return 返回值是一个标准Promise对象  { 文件路径1: 静床/图床url1, 文件路径2: 静床/图床url2 }
   */
  upload (filePath, opts) {
    return qcdn.upload(filePath, opts)
  }

  /**
   * content 上传内容，返回URL
   * @param  [{String}]  content  文件内容
   * @param  [{String}]  type     *[可选]*文件类型(当链接中未体现出文件类型时需提供)
   * @param  [{Object}]  opts     *[可选]*参数 -- https 是否使用https,默认false
   * return 返回值是一个标准Promise对象  { 原始url1: 静床/图床url1, 原始url2: 静床/图床url2 }
   */
  content (content, type, opts) {
    return qcdn.content(content, type, opts)
  }

}

export {
  Cdn
}