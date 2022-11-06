function getClientEnvironment() {
	const raw = {};

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

module.exports = getClientEnvironment;
