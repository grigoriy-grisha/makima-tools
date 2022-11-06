const { readdirSync } = require('fs');
const path = require('path');

const createWebpackAlias = (srcDir = 'src') => {
	return {
		extensions: ['.ts', '.tsx', '.js', '.json', '.png', '.svg', '.css'],
		alias: readdirSync(path.resolve(srcDir), { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name)
			.reduce(
				(aliases, folderName) => ({
					...aliases,
					[`$${folderName}`]: path.resolve(`${srcDir}/${folderName}`),
				}),
				{},
			),
	};
};

const makeAppUrl = ({ scheme, host, port, path }) => {
	if (scheme) {
		host = `${scheme}://${host}`;
	}

	if (port) {
		host = `${host}:${port}`;
	}

	if (path) {
		return `${host}${path}`;
	}

	return host;
};

module.exports = {
	makeAppUrl,
	createWebpackAlias,
};
