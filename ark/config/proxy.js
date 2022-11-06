const PROXY_REGEX = /\/rmkib\..*|\/api.*|\/investment-mobile/;

const { BH_APP_SCHEME, BH_APP_HOST, PROXY_PORT } = process.env;

const makeUrl = ({ scheme, host, port, path }) => {
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

const proxyServerUrl = makeUrl({ scheme: BH_APP_SCHEME, host: BH_APP_HOST, port: PROXY_PORT });

module.exports = [
	{
		context: (path) => PROXY_REGEX.exec(path),
		target: proxyServerUrl,
		secure: false,
	},
];
