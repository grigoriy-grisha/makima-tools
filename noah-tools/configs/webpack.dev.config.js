const path = require('path');
const url = require('url');
const urljoin = require('url-join');
const { EnvironmentPlugin } = require('webpack');
const { mergeWithCustomize, unique } = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { createModuleEnvParams } = require('./env');
const { readConfig } = require('../utils');
const getWebpackProductionConfig = require('./webpack.config');
const { tvFolderPath } = require('./constants');

module.exports = async () => {
	const {
		projectName,
		openUrl,
		devServerPort,
		publicPath,
		liveReload,
	} = readConfig();
	console.log(readConfig(),'readConfig()')
	const env = createModuleEnvParams();
	const publicPathDist = urljoin(publicPath, '/dist/');
	const filename = `${projectName}-dev-[fullhash].js`;

	const productionConfig = await getWebpackProductionConfig();

	return mergeWithCustomize({
		customizeArray: unique('plugins', ['EnvironmentPlugin'], (plugin) => plugin.constructor?.name),
	})(productionConfig, {
		entry: './src/index.tsx',
		stats: {
			warningsFilter: /export .* was not found in|DefinePlugin/,
		},
		mode: 'development',
		cache: true,
		optimization: {
			minimize: false,
		},
		devtool: 'eval-cheap-module-source-map',
		output: {
			filename,
			chunkFilename: `[name]-${filename}`,
			path: path.resolve(tvFolderPath, `./${publicPathDist}`),
		},
		devServer: {
			client: {
				overlay: false,
			},
			liveReload,
			historyApiFallback: true,
			public: url.resolve(`http://localhost:${devServerPort}/`, publicPath),
			compress: true,
			hot: true,
			open: openUrl,
			static: tvFolderPath,
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin({ async: true }),
			new EnvironmentPlugin({
				...env.raw,
				version: 'local-dev',
				NODE_ENV: 'production',
				KKSB_ENV: 'development',
			}),
		],
	});
};
