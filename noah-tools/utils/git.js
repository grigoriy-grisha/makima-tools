const fs = require('fs');
const R = require('ramda');
const git = require('isomorphic-git');
const moduleInfo = require('./moduleInfo');
const { rethrow } = require('./fns');

const dir = process.cwd();

const isModuleLine = R.compose(R.startsWith('#module'), R.toLower);
const getVersionsFromLine = R.compose(R.drop(1), R.split(' '));
const getVersionsFromCommit = R.compose(
	R.map(moduleInfo.createFromString),
	R.flatten,
	R.map(getVersionsFromLine),
	R.filter(isModuleLine),
	R.split('\n'),
	R.prop('payload'),
);
const getVersions = R.compose(
	R.reduce(moduleInfo.mergeLists, []),
	R.reject(R.isEmpty),
	R.map(getVersionsFromCommit),
	R.reverse,
);

const readModulesFromCommits = async (fromRef, toRef) => {
	const from = await git
		.resolveRef({ fs, dir, ref: fromRef })
		.catch(rethrow(`Не удалось получить коммит ветки '${fromRef}'`));
	const fromCommit = await git
		.readCommit({ fs, dir, oid: from })
		.catch(rethrow(`Не удалось получить коммит '${from}' для ветки '${fromRef}'`));
	const to = await git
		.resolveRef({ fs, dir, ref: toRef })
		.catch(rethrow(`Не удалось получить коммит ветки '${toRef}'`));
	const toCommit = await git
		.readCommit({ fs, dir, oid: to })
		.catch(rethrow(`Не удалось получить коммит '${to}' для ветки '${toRef}'`));

	const log = await git
		.log({
			fs,
			dir,
			ref: fromCommit.oid,
			since: new Date(toCommit.commit.committer.timestamp * 1000),
		})
		.catch(rethrow(`Не удалось получить лог для коммитов '${from}'..'${to}'`));

	return getVersions(log);
};

const getRemoteOriginUrl = async () => {
	const remotes = await git.listRemotes({ fs, dir }).catch(R.always([]));

	return remotes.find((item) => item.remote === 'origin')?.url;
};

module.exports = {
	getRemoteOriginUrl,
	readModulesFromCommits,
};
