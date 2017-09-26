# node-tuxedo
node tuxedo cdn

个人使用

## 使用方法

```javascript
//引入文件
const Release = require('./release/index.js')  

//实例化对象
/**
 * 实例化对象
 */
const releaseObj = new Release({
	src: '../output',
	dist: '../online',
	resolve: 'html',
	copy: [
		{
			from: 'static/swf/*'
		},
		{
			from: 'static/other/*'
		}
	]
})
```

| 参数| 说明  |
| --- |-------------:|
| src | 文件原始目录 |
| dist | 输出目录 |
| resolve | 输出文件格式 |
| copy | 需要拷贝的文件夹 |


>copy属性可用，可不用，其中参数为

| copy参数| 说明  |
| --- |-------------:|
| from | 文件原始目录 |
| to | 输出目录 |