const path = require('path');
require('dotenv-expand')(
	require('dotenv').config({
		path: path.resolve('.env'), //root path of module
	}),
);

function createModuleEnvParams(modulePrefix) {
	const raw = Object.keys(process.env)
		.filter((key) => (modulePrefix ? key.search(modulePrefix) !== -1 : true))
		.reduce(
			(env, key) => {
				env[key] = process.env[key];

				return env;
			},
			{
				NODE_ENV: process.env.NODE_ENV || 'development',
			},
		);

	const stringified = {
		'process.env': Object.keys(raw).reduce((env, key) => {
			if (raw[key] === 'true') {
				env[key] = true;

				return env;
			}
			if (raw[key] === 'false') {
				env[key] = false;

				return env;
			}

			env[key] = JSON.stringify(raw[key]);

			return env;
		}, {}),
	};

	return { raw, stringified };
}

module.exports = { createModuleEnvParams };
