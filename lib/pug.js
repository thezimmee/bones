#!/usr/bin/env node

/**
 * lib/pug.js
 * ----------
 * Compile pug files.
 */

/** Immediate dependencies. */
var path = require('path');
var chalk = require('chalk');
var data = require(path.join(process.cwd(), './archie.config'));
var parseArgs = require('minimist');
var argv = process.argv.slice(2);
if (argv[0] === '--') {
	argv = parseArgs(argv.slice(1));
} else {
	argv = parseArgs(argv);
}
// var logLevel = process.env.npm_config_loglevel;


/** Config. */
var config = {
	ignorePattern: /([\/\\]_)|(^_)/,
	srcExt: '.html.pug',
	destExt: '.html',
	destDir: path.join(process.cwd(), 'build/'),
	flatten: true,
	// renameFile: function (filepath) {
	// 	return filepath.replace('/views', '');
	// },
	pug: {
		basedir: path.join(process.cwd(), 'src'), // For partials and extends
		cache: true,
		// self: false,
		// filters: {},
		// doctype: '',
		// debug: false,
		// compileDebug: false,
		// globals: [],
	},
	error: chalk.bold.red,
	info: chalk.blue,
	success: chalk.green,
	click: chalk.magenta
};


/** Compile files. */
renderFiles(argv._);


/**
 * Process filepaths sent to pug.
 */
function renderFiles(filepaths) {
	// Make sure filepaths has files.
	if (!filepaths.length) {
		console.error(config.error('    No files found.'));
		return false;
	}
	// var Promise = require('pinkie-promise');
	// var promises = [];
	// Render files.
	filepaths.forEach(function (filepath) {
		// var deferred = defer();
		// promises.push(deferred.promise);
		// return renderFile(filepath, deferred);
		return renderFile(filepath);
	});
	// After all files have been rendered...
	// Promise.all(promises).then(function (results) {});
}


/**
 * Compile files sent to pug.
 */
function renderFile(filepath, deferred) {
	// Reject file if it matches the ignore pattern.
	if (config.ignorePattern.test(filepath)) {
		// deferred.resolve({filepath: filepath, message: 'Skipped due to ignore pattern in config.', success: true});
		return false;
	}
	var fs = require('fs-extra');
	var pug = require('pug');
	var srcPath = filepath;

	// Ensure file exists
	return fs.pathExists(filepath).then(function (exists) {
		// Skip if file doesn't exist.
		if (!exists) {
			// deferred.resolve({filepath: filepath, message: 'Skipped, file doesn\'t exist.', success: true});
			return false;
		}

		// Compile pug to js function.
		var compiler = pug.compileFile(filepath, config.pug);
		// var dependencies = compiler.dependencies;
		var html = compiler(data);

		// Replace file extension.
		filepath = filepath.replace(config.srcExt, config.destExt);
		// Form destination filepath.
		if (config.flatten) {
			filepath = path.join(config.destDir, path.basename(filepath));
		} else {
			filepath = path.join(config.destDir, path.relative(config.pug.basedir, filepath));
		}
		// Run renameFile from config.
		if (typeof config.renameFile === 'function') {
			filepath = config.renameFile(filepath);
		}

		// Save file.
		return fs.outputFile(filepath, html).then(function () {
			// deferred.resolve({filepath: filepath, message: 'Saved!', success: true});
			console.log(config.success('    compiled'), config.click(srcPath), 'to', config.click(path.relative(process.cwd(), filepath)));
		});
	}).catch(function (error) {
		// deferred.reject({filepath: filepath, message: error, success: false});
		console.error(config.error('    ERROR:', error));
	});
}

/**
 * Create and defer promises.
 */
function defer() {
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
}
