const withPreact = require('@zeit/next-preact')
module.exports = withPreact({
	webpack(config, options)
	{
		return config
	},
})
