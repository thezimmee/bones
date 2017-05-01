/**
 * defer.js
 * --------
 * Defer promise implementation.
 */


/**
 * Create and defer promises.
 */
var Promise = require('pinkie-promise');
module.exports = function defer() {
	var resolve;
	var reject;
	var promise = new Promise(function (res, rej) {
		resolve = res;
		reject = rej;
	});

	return {
		promise: promise,
		resolve: resolve,
		reject: reject
	};
};
