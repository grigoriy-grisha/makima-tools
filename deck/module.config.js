module.exports = {
	// projectPrefix: '@kksb',
	projectName: 'loan-tasks',
	sonarKey: 'ru.sbrf.ufs.rmkiksb:taskmanager-ui',
	openUrl: '/loan-tasks',
	bhAppPort: 3000,
	bhAppScheme: 'http',
	bhAppHost: 'localhost',
	devServerPort: 8080,
	modules: [
		// '@enigma/tv@file:../television',
		'@enigma/tv@develop',
		// { name: '@enigma/module.service-requests' },
		// { name: '@enigma/tv', deployPath: '' }
	],
	externals: ['@cib/logger'],
	publicPath: '/loan-tasks-static/loan-tasks',
};
