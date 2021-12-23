const prod = process.env.NODE_ENV === 'production';

module.exports = {
	mode: prod ? 'production' : 'development',
	entry: __dirname + '/client/src/index.js',
	output: {
		path: __dirname + '/client/public',
		filename: 'bundle.js'
	},
	module:{
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react']
				}
			}
		}]
	},
	devtool: prod ? undefined : 'source-map'
};
