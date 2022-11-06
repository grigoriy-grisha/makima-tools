const path = require('path');
const { promises: fs } = require('fs');
const { rethrow } = require('./fns');

const readJson = (filename) =>
	Promise.resolve(fs.readFile(filename, { encoding: 'utf8' }))
		.then(JSON.parse)
		.catxch(rethrow(`Не удалось прочитать JSON-файл '${filename}'`));

const readPackageJson = async () => await readJson(path.resolve(process.cwd(), './package.json'));

module.exports = {
	readJson,
	readPackageJson,
};
