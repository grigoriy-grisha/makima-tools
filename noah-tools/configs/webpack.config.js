const path = require('path');
const urljoin = require('url-join');
const { EnvironmentPlugin, ProvidePlugin } = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { createWebpackRules } = require('./rules');
const { createWebpackAlias } = require('./utils');
const { createModuleEnvParams } = require('./env');
const { readConfig, readPackageJson } = require('../utils');

module.exports = async (args = {}) => {
	const { version } = await readPackageJson();
	const {
		projectPrefix,
		projectName,
		prefixEnv = '',
		publicPath,
		pluginsFile,
		externals = [],
        components
	} = readConfig();
	const additionalPlugins = pluginsFile ? require(path.resolve(pluginsFile)) : [];

	const publicPathDist = urljoin(publicPath, '/dist/');
	const env = createModuleEnvParams(prefixEnv);
	const buildTypePrefix = args?.type ? `${args.type}-` : '';


	return {
		entry: {
            [projectName]: './src/index.tsx',
            ...components
        },
		externals: [
			...externals,
			'react',
			'react-dom',
			'@cib/event-bus',
			'history',
			'react-router',
			'react-router-dom',
		],
		mode: 'production',
		output: {
			filename: `[name]-v${version}.js`,
			chunkFilename: `[name]-chunk-v${version}.js`,
			publicPath: publicPathDist || publicPath,
			path: path.resolve(process.cwd(), 'dist'),
			devtoolNamespace: projectName,
			library: { type: args?.type || 'system' },
		},
		devtool: process.env.SOURCE_MAP === 'true' ? 'source-map' : false,
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin({ parallel: true })],
		},
		resolve: createWebpackAlias('./src'),
		resolveLoader: {
			// Пути к лоадерам резолвятся относительно места запуска
			// В случае с вызовом enigma-tools это будет папка где его запустили,
			// а не node_module относительно пакета kksb-frontend-config
			modules: ['node_modules', path.resolve(__dirname, '../../node_modules')],
		},
		module: { rules: createWebpackRules(projectName) },
		plugins: [
			...additionalPlugins,
			new ProvidePlugin({
				process: 'process/browser',
				regeneratorRuntime: 'regenerator-runtime/runtime',
			}),
			new WebpackManifestPlugin({
				basePath: publicPathDist,
				publicPath: publicPathDist,
				writeToFileEmit: true,
				fileName: `../${buildTypePrefix}importmap.json`,
				generate: (seed, files, entries) => {
					return entries?.main
						? {
							imports: {
								[`${projectPrefix}/${projectName}`]: `${publicPathDist}${entries.main[0]}`,
							},
						}
						: {
							imports: Object.keys(entries).reduce(
								(res, item) => ({
									...res,
									[`${projectPrefix}/${item}`]: `${publicPathDist}${entries[item]}`,
								}),
								{},
							),
						}
				},
			}),
			new EnvironmentPlugin({
				...env.raw,
				version,
				NODE_ENV: 'production',
				KKSB_ENV: 'production',
			}),
		],
	};
};
