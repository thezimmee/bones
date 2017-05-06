/**
 * .postcssrc.js
 * -------------
 * Configuration for [postcss-cli](https://github.com/postcss/postcss-cli).
 */

var path = require('path');
var fontFormats = 'local woff2 woff';
module.exports = function (cli) {
	return {
		map: {inline: false},
		parser: false,
		plugins: {
			'postcss-assets': {
				loadPaths: ['node_modules', 'assets'],
				basePath: 'src/',
				relative: true
			},
			'postcss-font-magician': {
				formats: fontFormats,
				protocol: 'https:',
				variants: {
					'Open Sans': {
						'300': [fontFormats],
						'400': [fontFormats],
						'700': [fontFormats],
					}
				}
			},
			// 'postcss-url': {
			// 	// filter: '**fonts.gstatic.com**',
			// 	url: 'inline',
			// 	basePath: [path.resolve('./src')],
			// 	maxSize: 10,
			// 	fallback: 'copy'
			// },
			'autoprefixer': {
				browsers: ['last 2 versions', '> 1% in US']
			},
			'postcss-reporter': {
				clearReportedMessages: true,
				formatter: function (input) {
					console.log('INPUT:', input);
					return input.messages;
				}
			},
		}
	};
}
