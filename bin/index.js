const Release = require('./release/index.js')
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