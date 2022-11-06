const chalk = require('chalk');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { readConfig, moduleInfo, createLogger } = require('./utils');
const { makeAppUrl } = require('./configs/utils');
const { deployModules } = require('./deploy');
const defaultConfig = require('./moduleSettings/module.config.default');
const baseConfig = require('./moduleSettings/module.config');

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
				console.log(
					chalk`Используется сервер API {green ${makeAppUrl({
						scheme: moduleConfig.bhAppScheme,
						host: moduleConfig.bhAppHost,
						port: moduleConfig.bhAppPort,
					})}}`,
				);
			})
			.then((server) => server.on('close', resolve).on('error', reject));
	});

module.exports = async (options) => {
	const projectConfig = readConfig();
	const modulesList = [defaultConfig.modules, baseConfig.modules, projectConfig.modules]
		.map((list) => list.map(moduleInfo.create))
		.reduce(moduleInfo.mergeLists, []);

	logger.debug('projectConfig %O', projectConfig);

	await deployModules(modulesList, options.cache);
	await startDevServer(projectConfig);
};
