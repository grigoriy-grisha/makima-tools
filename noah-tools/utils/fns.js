const R = require('ramda');

const rethrow = (nextError) => (err) => {
	if (R.is(Function, nextError)) {
		throw new Error(nextError(err));
	} else if (R.is(String, nextError)) {
		throw new Error(nextError);
	}

	throw err;
};

module.exports = {
	rethrow,
};
