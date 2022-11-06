const createWebpackRules = (projectName) => {
	return [
		{
			test: /\.tsx?$/,
			loader: require.resolve('ts-loader'),
			options: {
				transpileOnly: true,
				experimentalWatchApi: true,
				onlyCompileBundledFiles: true,
				experimentalFileCaching: true,
			},
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
							id: projectName,
						},
					},
				},
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
					loader: require.resolve('style-loader'),
					options: {
						injectType: 'singletonStyleTag',
						attributes: {
							id: projectName,
						},
					},
				},
				{
					loader: require.resolve('css-loader'),
					options: {
						sourceMap: false,
						modules: {
							localIdentName: `${projectName}__[path]_[name]__[local]--[hash:base64:5]`,
						},
					},
				},
			],
		},
		{
			test: /\.(png|jpg|gif)$/,
			use: ['file-loader'],
		},
		{
			test: /\.(ttf|woff|woff2|eot)$/,
			use: ['file-loader'],
		},
		{
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		},
	];
};

module.exports = { createWebpackRules };
