const debug = require('debug');

module.exports = (namespace) => ({
	log: debug(`makima-tools:${namespace}:log`),
	warn: debug(`makima-tools:${namespace}:warn`),
	err: debug(`makima-tools:${namespace}:err`),
	debug: debug(`makima-tools:${namespace}:debug`),
});
