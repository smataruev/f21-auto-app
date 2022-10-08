// IMPORTS
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');

let mode = 'development'
if ( process.env.NODE_ENV === 'production' ) {
	mode = 'production'
}

module.exports = {
	mode: mode,

	entry: {
		main: path.join(process.cwd(), 'src', 'app.js'),
	},

	output: {
		filename: '[name].[contenthash].js',
		assetModuleFilename: "assets/[hash][ext][query]",
		// assetModuleFilename: "assets/[name][ext][query]",
		clean: true
	},
	devtool: ( process.env.NODE_ENV === 'production' ) ? 'source-map' : 'source-map',

	optimization: {
		splitChunks: {
			chunks: "all"
		}
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.join(process.cwd(), 'src', 'index.pug')
		})
	],

	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.pug$/i,
				loader: "pug-loader",
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource"
			},
			{
				test: /\.(png|svg|jpg|jpeg|git|tiff)$/i,
				type: "asset/resource"
			},
			// DEPRECATED FOR WEBPACK 5 version
			// {
			// 	test: /\.(png|jpe?g|gif|webp)$/i,
			// 	loader: 'file-loader',
			// 	options: {
			// 		// name: '[path][name][hash].[ext]',
			// 		name: 'images/[hash].[ext]',
			// 	},
			// },
			{
				test: /\.(sa|sc|c)ss$/i,
				use: [
					(mode === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"postcss-preset-env",
										{

										},
									],
								],
							},
						},
					},
					'sass-loader'
				],
			},
			{
				test: /\.html$/i,
				loader: "html-loader"
			}
		],
	},
}
