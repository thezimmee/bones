#!/usr/bin/env node

/**
 * svg.js
 * ------
 * Create svg sprite from list of svg files.
 */


// User config.
var config = require('../.svgo.js');
// Dependencies.
var exec = require('child_process').exec;
var fs = require('fs-extra');
var path = require('path');
var svgoRequire = require('svgo');
var svgo = new svgoRequire(config.svgo);

// Run command to grab filepaths.
exec(config.cmd, function(error, stdout, stderr) {
	// Log errors.
	if (error) {
		console.error(error);
		process.exit();
		return false;
	}
	var filepaths = stdout.trim().split('\n');
	var html = '';
	var promises = [];
	filepaths.forEach(function (filepath) {
		var deferred = require('./defer')();
		promises.push(deferred.promise);
		transformSvg(path.join(process.cwd(), filepath), deferred);
	});
	// Form html and optimize svg.
	Promise.all(promises).then(function (results) {
		results = results.join('');
		svgo.optimize(results, function (result) {
			// Post optimize transform callback.
			if (typeof config.postOptimizeSvg === 'function') {
				result.data = config.postOptimizeSvg(result.data);
			}
			// Form html.
			html += config.spritePrefix;
			html += result.data;
			html += config.spriteSuffix;
			// Save file.
			fs.outputFile(path.resolve(process.cwd(), config.dest), html).then(function () {
				console.log(config.successMsg());
			}).catch(function (error) {
				console.error(error);
			});
		}).catch(function (error) {
			console.error(error);
		});
	});
});

/**
 * Transform individual svg file.
 */
function transformSvg(filepath, deferred) {
	fs.readFile(filepath, 'utf8', function (error, content) {
		if (error) {
			console.log(filepath, error);
			deferred.reject({filepath: filepath, error: error});
			process.exit();
			return error;
		}
		// If svg doesn't have an id, add filename as id.
		if (typeof config.transformSvg === 'function' && !(/id=\"[.+]\"/).test(content)) {
			content = config.transformSvg(content, filepath);
		}
		deferred.resolve(content);
		return content;
	});
}
