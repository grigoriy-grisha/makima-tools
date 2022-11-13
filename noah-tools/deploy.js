const R = require('ramda');
const path = require('path');
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const pacote = require('pacote');
const libnpmconfig = require('libnpmconfig');
const { tvPackageName, tvFolderPath } = require('./configs/constants');
const baseConfig = require('./moduleSettings/module.config');
const {
	rethrow,
	readModulesFromCommits,
	moduleInfo,
	readPackageJson,
	readConfig,
	createLogger,
	npmConfigResolver,
} = require('./utils');

const logger = createLogger('deploy-command');

const createManifest = (name, version) =>
	JSON.stringify(
		{
			deploymentUnit: name,
			devEnv: 'front-pr',
			version,
		},
		null,
		4,
	);

const deployModule = async (info, npmConfig) => {
	const pacoteOptions = npmConfigResolver(npmConfig);

	const isLatest = info.fetchSpec === 'latest';
	const manifest = await pacote.manifest(info.raw, pacoteOptions);

	const versionToInstall = info.rawSpec || (isLatest ? manifest.version : info.fetchSpec);
	const relativeFolder = path.relative(process.cwd(), tvFolderPath);

	logger.debug('deploy module: %s', info);

	await fsExtra.ensureDir(relativeFolder);
	const as = await pacote.extract(
		[info.name, versionToInstall].filter(Boolean).join('@'),
		relativeFolder,
		pacoteOptions,
	);
	await fsExtra.writeFile(
		path.resolve(relativeFolder, './manifest.json'),
		createManifest(info.name, versionToInstall),
		{ encoding: 'utf-8' },
	);

	const versionText = isLatest
		? chalk`{green latest (${versionToInstall})}`
		: chalk`{bold.greenBright ${versionToInstall}}`;
	console.log(
		chalk`{green ${info.name}} версии ${versionText} установлен в {green ${relativeFolder}}`,
	);
};

const deployModules = async (modulesList, useCache) => {
	const npmConfig = {
		...libnpmconfig.read().toJSON(),
		preferOffline: useCache,
	};

	const [[tv], restModules] = R.partition(R.propEq('name', tvPackageName), modulesList);

	logger.debug('deploy modules %j', modulesList);
	logger.debug('npm config %j', npmConfig);

	await fsExtra.remove(tvFolderPath);
	await deployModule(tv, npmConfig);
	await Promise.all(
		restModules.map((item) =>
			deployModule(item, npmConfig).catch(
				rethrow((err) => `Не удалось установить '${item.raw}'\n${err.message}`),
			),
		),
	);
};

const deployCommand = async (options) => {
	const packageJson = await readPackageJson();
	const config = readConfig();
	const modulesFromProjectConfig = config.modules;
	const modulesFromArgs = options.modules;
	const currentModule = [`${packageJson.name}@file://.`];

	const modulesList = [
		modulesFromProjectConfig,
		modulesFromArgs,
		currentModule,
	]
		.map((list) => list.map(moduleInfo.create))
		.reduce(moduleInfo.mergeLists, []);

	logger.debug('project config modules: %j', modulesFromProjectConfig);
	logger.debug('args modules: %j', modulesFromArgs);
	logger.debug('current module: %j', currentModule);

	await deployModules(modulesList, options.cache);
};

module.exports = {
	deployModules,
	deployCommand,
};
