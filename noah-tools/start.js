const chalk = require('chalk');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { readConfig, moduleInfo, createLogger } = require('./utils');
const { deployModules } = require('./deploy');

const logger = createLogger('start-command');

const startDevServer = (moduleConfig) =>
	new Promise(async (resolve, reject) => {
		const getWebpackConfig = require('./configs/webpack.dev.config.js');
		const webpackConfig = await getWebpackConfig();
		logger.debug('webpack config: %j', webpackConfig);

		return new WebpackDevServer(Webpack(webpackConfig), webpackConfig.devServer)
			.listen(moduleConfig.devServerPort, 'localhost', () => {
				console.log(
					chalk`Сервер запущен по адресу {green http://localhost:${moduleConfig.devServerPort}}`,
				);
			})
			.then((server) => server.on('close', resolve).on('error', reject));
	});

module.exports = async (options) => {
	const projectConfig = readConfig();
	const modulesList = projectConfig.modules.map(moduleInfo.create)

	logger.debug('projectConfig %O', projectConfig);

	await deployModules(modulesList, options.cache);
	await startDevServer(projectConfig);
};
