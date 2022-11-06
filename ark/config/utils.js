const { readdirSync } = require('fs');
const path = require('path');

const getDirectories = (srcDir) =>
	readdirSync(srcDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
		.reduce(
			(aliases, folderName) => ({
				...aliases,
				[`$${folderName}`]: path.resolve(`${srcDir}/${folderName}`),
			}),
			{},
		);

const copyPatterns = (outDir, modules) => {
	return modules.reduce(
		(acc, module) => [
			...acc,
			{
				from: `node_modules/${module.name}/${module.path}`,
				to: `${module.path}`,
			},
		],
		[],
	);
};

module.exports = {
	getDirectories,
	copyPatterns,
};
