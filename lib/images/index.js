#!/usr/bin/env node

/**
 * images.js
 * ---------
 * Create responsive images from HTML files.
 */

// var args = require('minimist')(process.argv.slice(2));
var path = require('path');
var fs = require('fs-extra');
var Promise = require('pinkie-promise');
var chalk = require('chalk');
var defer = require('../defer');
// var filepaths = args._;
var c = {
    error: chalk.bold.red,
    info: chalk.blue,
    success: chalk.green,
    link: chalk.magenta
};
// Separate config from images.
var config = require('../../.images.js');
var images = config.images;
delete config.images;


processImages(images, config);


/**
 * Process multiple images from a large config object.
 */
function processImages(images, options) {
    var imagePromises = [];
    console.log(c.info('    Creating responsive images...'));
    // Process each image.
    images.forEach(function(image) {
        imagePromises.push(processImage(image, options));
    });
    // When all images are done...
    Promise.all(imagePromises).then(function(results) {
        console.log(c.success('    Saved all images.'));
    }).catch(function(error) {
        console.log(error);
    });
}


/**
 * Process an image from a single image config object.
 * @param image {object} Image configuration object.
 */
function processImage(image, options) {
    // console.log('    Processing', c.link(image.src) + '...');
    var sharp = require('sharp');
    var imagemin = require('imagemin');

    return new Promise(function(resolve, reject) {
        var childPromises = [];
        // Grab image file.
        return fs.readFile(image.src, function(error, imageBuffer) {
            // Check for errors.
            if (error) {
                console.log(error);
                reject({ error: error, message: 'Error reading file: ' + image.src });
                return false;
            }
            // Make sure required properties exist.
            if (!image.src || !image.sizes.length) {
                console.log(error);
                reject({ error: error, message: 'Error: Each image must have `src` and `sizes` properties.', data: image });
                return false;
            }
            // Process sizes for each image.
            image.sizes.forEach(function(size) {
                var deferred = defer();
                childPromises.push(deferred.promise);
                // Make a clone object.
                var imageClone = {};
                imageClone.size = size;
                imageClone.src = image.src;
                imageClone.dest = image.dest || options.dest;
                imageClone.cwd = image.cwd || options.cwd || process.cwd();
                imageClone.suffix = '--' + size;
                imageClone.operation = size.slice(-1);
                // Determine new width and/or height of image.
                if (imageClone.operation === 'x') {
                    var dimensions = require('image-size')(imageBuffer);
                    imageClone.width = dimensions.width * parseInt(size, 10);
                    imageClone.height = dimensions.height * parseInt(size, 10);
                    imageClone.suffix = '--' + imageClone.width + 'x' + imageClone.height;
                } else if (imageClone.operation === 'w') {
                    imageClone.width = parseInt(size, 10);
                } else if (imageClone.operation === 'h') {
                    imageClone.height = parseInt(size, 10);
                }
                // Append size modifier to final image name.
                imageClone.name = path.basename(imageClone.src).split('.')[0] + imageClone.suffix + path.extname(imageClone.src);
                // Resize image.
                sharp(imageBuffer).resize(imageClone.width, imageClone.height).toBuffer(function(error, outputBuffer) {
                    if (error) {
                        deferred.reject({ error: error, message: 'Error: Sharp was not able to output the buffer for: ' + imageClone.src });
                    }
                    // Optimize image.
                    var merge = require('lodash.merge');
                    var png = require('imagemin-optipng');
                    var jpg = require('imagemin-mozjpeg');
                    var gif = require('imagemin-gifsicle');
                    // Callback to dynamically set image settings.
                    var callbackKeys = ['png', 'jpg', 'gif'];
                    callbackKeys.forEach(function(key) {
                        if (imageClone.imagemin && typeof imageClone.imagemin[key] === 'function') {
                            imageClone.imagemin[key] = imageClone.imagemin[key](imageClone, key);
                        } else if (options.imagemin && typeof options.imagemin[key] === 'function') {
                            imageClone.imagemin = imageClone.imagemin || {};
                            imageClone.imagemin[key] = options.imagemin[key](imageClone, key);
                        }
                    });
                    // Run imagemin.
                    imageClone.imagemin = merge({}, options.imagemin, imageClone.imagemin);
                    imageClone.imagemin.png.buffer = outputBuffer;
                    imageClone.imagemin.jpg.buffer = outputBuffer;
                    imageClone.imagemin.gif.buffer = outputBuffer;
                    imagemin.buffer(outputBuffer, {
                        plugins: [
                            png(imageClone.imagemin.png),
                            jpg(imageClone.imagemin.jpg),
                            gif(imageClone.imagemin.gif)
                        ]
                    }).then(function(outputBuffer) {
                        // Cache destination.
                        imageClone.dest = path.join(imageClone.dest, path.dirname(path.relative(imageClone.cwd, imageClone.src)), imageClone.name);
                        // Callback to post process image.
                        if (typeof imageClone.postProcess === 'function') {
                            imageClone.imagePath(imageClone, imageBuffer);
                        }
                        // Save file.
                        fs.outputFile(imageClone.dest, outputBuffer);
                        deferred.resolve(imageClone);
                        console.log('    Saved', c.link(imageClone.dest), '(original:', c.link(imageClone.src) + ')');
                    }).catch(function(error) {
                        console.log(c.error(error));
                        deferred.reject({ error: error, data: imageClone });
                    });
                });
            });
            // Resolve original promise.
            Promise.all(childPromises).then(function(image) {
                // console.log('CONFIG:', image);
                resolve(image);
            }).catch(function(error) {
                console.error(c.error(error));
                reject({ error: error, data: image });
            });
            return true;
        });
    });
}
