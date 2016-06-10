const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ENV = process.env.NODE_ENV || 'development'

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: './index.tsx',
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: 'bundle.js',
	},

	resolve: {
		extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
		modulesDirectories: [
			path.join(__dirname, 'vendor'),
			path.join(__dirname, 'node_modules'),
			'node_modules',
		],
		alias: {
			styles: path.join(__dirname, 'src/styles'),
			components: path.join(__dirname, 'src/components'),
			actions: path.join(__dirname, 'src/actions'),
			screens: path.join(__dirname, 'src/screens'),
			svg: path.join(__dirname, 'src/resources/svg'),
			images: path.join(__dirname, 'src/resources/images'),
		},
	},

	module: {
		loaders: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
			{
				test: /\.(scss|css)$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract('style-loader?singleton', [
					'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
					'sass-loader?sourceMap',
				].join('!')),
			},
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				loader: 'svg-inline',
			},
			{
				test: /\.(woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				exclude: /node_modules/,
				loader: ENV === 'production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url',
			},
		],
	},

	sassLoader: {
		includePaths: [path.resolve(__dirname, 'src/styles')],
	},

	plugins: ([
		new webpack.ProvidePlugin({
			fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
		}),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('style.css', {
			allChunks: true,
			disable: ENV !== 'production',
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({ NODE_ENV: ENV }),
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
		}),
	]).concat(ENV === 'production' ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
	] : []),

	stats: { colors: true },

	devtool: 'source-map',

	devServer: {
		historyApiFallback: true,
	},

	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
}
