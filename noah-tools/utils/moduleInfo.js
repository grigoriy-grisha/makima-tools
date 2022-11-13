const R = require('ramda');
const npa = require('npm-package-arg');
const { rethrow } = require('./fns');


const mergeLists = (leftList, rightList) =>
	rightList.reduce((acc, rightItem) => {
		const itemIndex = acc.findIndex(R.propEq('name', rightItem.name));
		const item = acc[itemIndex];

		if (item) {
			return R.adjust(itemIndex, R.mergeLeft(rightItem), acc);
		} else {
			return [...acc, rightItem];
		}
	}, leftList);

const createFromString = (moduleName) => {
	if (!R.is(String, moduleName) || !moduleName) {
		throw new Error(`Неправильно указано имя модуля '${moduleName}'`);
	}

	const parsed = npa(moduleName);

	if (!parsed.name) {
		throw new Error(`Не удалось распарсить название пакета '${moduleName}'`);
	}

	return parsed;
};


const create = R.cond([
	[R.is(String), createFromString],
	[R.T, rethrow((item) => `Неизвестный модуль '${item}'`)],
]);

const isDisabled = R.propSatisfies(R.equals(true), 'disabled');

module.exports = {
	mergeLists,
	createFromString,
	create,
	isDisabled,
};
