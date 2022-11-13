const R = require('ramda');
const path = require('path')
const chalk = require('chalk');
const defaultConfig = require('../moduleSettings/module.config.default');
const moduleConfig = require("../moduleSettings/module.config.js")

const mapToDestinationFormat = (config) => ({
	...config,
    components: config?.components || {},
	bhAppPort: config.bhAppPort || config.proxyPort,
	publicPath: config.publicPath || `/${config.projectName}`,
});

const readConfig = () => {
	return  require(path.resolve(process.cwd(), './module.config.js'));
};

const checkConfig = async () => {
	const config = readConfig();

	const isProjectPrefixValid = /^@\w+$/.test(config.projectPrefix);
	if (!isProjectPrefixValid) {
		throw new Error('Некорректно указан префикс имени проекта в modules.config.js');
	}

	if (!config.projectName) {
		throw new Error('Необходимо заполнить поле projectName в modules.config.js');
	}

	if (!config.sonarKey) {
		throw new Error('Необходимо заполнить поле sonarKey в modules.config.js');
	}

	if (R.has('modules', config) && !Array.isArray(config.modules)) {
		throw new Error(
			`Поле modules в modules.config.js должно быть массивом`,
		);
	}
};

module.exports = {
	readConfig,
	checkConfig,
};
