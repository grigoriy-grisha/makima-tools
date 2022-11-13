if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const proxy = require('./config/proxy');
const webpackMerge = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const {
    outDir,
    orgName,
    projectName,
    publicPath,
    nodeModules,
    modules,
    srcDir,
    cdnList,
    template,
    env,
    filename,
} = require('./config/params');
const { getDirectories, copyPatterns } = require('./config/utils');
const { createRules } = require('./config/rules');

const files = modules.reduce((res, { name, path }) => ({ ...res, [name]: `/${path}` }), {});
const tvModuleName = '@kksb/tv';

module.exports = (webpackConfigEnv, argv) => {

    debugger
    const host = argv.host || '';
    const mode = argv.mode === 'production';
    const htmlWebpackPlugin = new HtmlWebpackPlugin({
        inject: false,
        assetsCdnName: 'cdn',
        favicon: './public/favicon.ico',
        template: `${srcDir}/${template}`,
        templateParameters: {
            tvPathFile: `/${orgName}-${projectName}-${pkg.version}.js`,
            tvModuleName,
            host,
            modules,
        },
    });

    const webpackCdnPlugin = new WebpackCdnPlugin({
        prod: mode,
        modules: [...modules, ...cdnList],
        publicPath: nodeModules,
        prodUrl: `${host}/:path`,
    });

    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName,
        webpackConfigEnv,
        argv,
    });

    defaultConfig.module.rules = defaultConfig.module.rules.filter((f) => {
        return f.test ? f.test.toString() !== '/\\.css$/i' : true;
    });

    defaultConfig.externals.push('react');
    defaultConfig.externals.push('react-router-dom');
    defaultConfig.externals.push('react-router');

    return webpackMerge.strategy({
        plugins: 'replace',
    })(defaultConfig, {
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json', '.png', '.svg', '.css'],
            alias: {
                ...getDirectories(srcDir),
            },
        },
        mode: argv.mode,
        output: {
            filename,
        },
        devtool: !mode && 'sourcemap',
        devServer: {
            historyApiFallback: true,
            port: process.env.PORT || 3005,
            host: process.env.HOST || '0.0.0.0',
            proxy,
        },
        module: {
            rules: createRules(orgName, projectName),
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin({ parallel: true })],
            splitChunks: {
                chunks: 'async',
            },
        },
        plugins: [
            ...defaultConfig.plugins.filter(
                (plugin) => plugin.constructor && !['HtmlWebpackPlugin'].includes(plugin.constructor.name),
            ),
            htmlWebpackPlugin,
            new webpack.EnvironmentPlugin({
                version: pkg.version,
                ...env.raw,
            }),
            webpackCdnPlugin,
            new ManifestPlugin({
                basePath: outDir,
                fileName: 'importmap.json',
                generate: () => {
                    return {
                        imports: { [`${tvModuleName}`]: `/${filename}` },
                    };
                },
            }),
            new ManifestPlugin({
                basePath: outDir,
                fileName: 'core-importmap.json',
                generate: () => {
                    return { imports: files };
                },
            }),
            new CopyWebpackPlugin({
                patterns: [{ from: publicPath, to: '' }, ...copyPatterns(outDir, [...modules, ...cdnList])],
            }),
            new Dotenv(),
        ],
    });
};
