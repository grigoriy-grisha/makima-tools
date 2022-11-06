const path = require('path');

const cacheLoader = {
	loader: 'cache-loader',
	options: {
		cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/cache-loader'),
	},
};

const createRules = (orgName, projectName) => {
	return [
		{
			test: /\.tsx?$/,
			use: [cacheLoader, 'awesome-typescript-loader'],
		},

		{
			exclude: /\.module\.css$/i,
			test: /\.css$/i,
			use: [
				{
					loader: require.resolve('style-loader'),
					options: {
						injectType: 'singletonStyleTag',
						attributes: {
							id: `${orgName}-${projectName}`,
						},
					},
				},
				cacheLoader,
				{
					loader: require.resolve('css-loader'),
					options: {
						importLoaders: 1,
					},
				},
			],
		},
		{
			test: /\.module\.css$/i,
			use: [
				{
					loader: 'style-loader',
					options: {
						injectType: 'singletonStyleTag',
						attributes: {
							id: `${orgName}-${projectName}`,
						},
					},
				},
				cacheLoader,
				{
					loader: 'css-loader',
					options: {
						sourceMap: false,
						modules: {
							localIdentName: '[name]__enigma-tv__[local]--[hash:base64:5]',
						},
					},
				},
			],
		},
		{
			test: /\.(png|jpg|gif)$/,
			use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'assets/' } }],
		},
		{
			test: /\.(ttf|woff|woff2|eot)$/,
			use: [
				cacheLoader,
				{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/',
					},
				},
			],
		},
		{
			test: /\.svg$/,
			use: [cacheLoader, '@svgr/webpack'],
		},
	];
};

module.exports = { createRules };
