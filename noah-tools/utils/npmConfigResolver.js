const fsExtra = require('fs-extra');

module.exports = (config) => {
	const ca = config.cafile ? fsExtra.readFileSync(config.cafile) : undefined;

	return { ...config, ca };
};
