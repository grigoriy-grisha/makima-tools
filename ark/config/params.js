const orgName = 'kksb';
const projectName = 'tv';
const outDir = './dist';
const srcDir = './src';
const nodeModules = '/node_modules';
const publicPath = 'public';
const getClientEnvironment = require('./env');
const pkg = require('../package.json');

const modules = [
	{
		name: '@cib/module.auth',
		var: '@cib/module.auth',
		path: 'lib/module.auth.min.js',
	},
	{
		name: '@cib/module.sup-manager',
		var: '@cib/module.sup-manager',
		path: 'lib/module.sup-manager.min.js',
	},
	{
		name: '@cib/module.classifiers',
		var: '@cib/module.classifiers',
		path: 'lib/module.classifiers.min.js',
	},
	{ name: 'react', path: 'umd/react.production.min.js' },
	{
		name: 'react-dom',
		path: 'umd/react-dom.production.min.js',
	},
	{
		name: 'react-router-dom',
		path: 'umd/react-router-dom.production.min.js',
	},
	{
		name: 'history',
		path: 'umd/history.production.min.js',
	},
	{
		name: 'react-router',
		path: 'umd/react-router.production.min.js',
	},
	{
		name: '@cib/platform',
		var: '@cib/platform',
		path: 'lib/platform.min.js',
	},
	{
		name: '@cib/event-bus',
		var: '@cib/event-bus',
		path: 'lib/event-bus.min.js',
	},
	{
		name: '@cib/logger',
		var: '@cib/logger',
		path: 'lib/cib-logger.min.js',
	},
];

const cdnList = [
	{
		name: 'systemjs',
		var: 'systemjs',
		path: 'dist/system.min.js',
	},
	{
		name: 'systemjs',
		var: 'amd',
		path: 'dist/extras/amd.min.js',
	},
	{
		name: 'systemjs',
		var: 'named-exports',
		path: 'dist/extras/named-exports.min.js',
	},
];
const template = 'index.ejs';

const filename = `${orgName}-${projectName}-${pkg.version}.js`;

module.exports = {
	orgName,
	projectName,
	outDir,
	publicPath,
	env: getClientEnvironment(),
	modules,
	srcDir,
	cdnList,
	template,
	nodeModules,
	filename,
};
