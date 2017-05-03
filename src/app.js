/* eslint-env node, mocha */
/**
 * app.js
 * ------
 * Main app JS controller.
 */

// SVG polyfill.
var svg4everybody = require('svg4everybody');
svg4everybody();

// Polfyill for responsive images (<picture/> and srcset).
var picturefill = require('picturefill');

var core = require('./core/core');
