const fns = require('./fns');
const git = require('./git');
const moduleInfo = require('./moduleInfo');
const readConfig = require('./readConfig');
const json = require('./json');
const createLogger = require('./createLogger');
const replaceSpaces = require('./replaceSpaces');
const npmConfigResolver = require('./npmConfigResolver');

module.exports = {
	...fns,
	...git,
	...readConfig,
	...json,
	moduleInfo,
	...replaceSpaces,
	npmConfigResolver,
	createLogger,
};
