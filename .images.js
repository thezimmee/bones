/**
 * .srcset.js
 * ----------
 * Configuration for responsive images.
 */


module.exports = {
	cwd: 'src/assets',
	dest: 'build/assets',
	imagemin: {
		png: {
			optimizationLevel: 4,
			bigDepthReduction: true,
			colorTypeReduction: true,
			paletteReduction: true
		},
		jpg: imageSettings,
		gif: imageSettings,
	},
	images: [{
		src: 'src/assets/wide.jpg',
		sizes: ['1x', '2x', '3x', '200w', '400w', '1200w', '2400w'],
	}, {
		src: 'src/assets/slider.jpg',
		sizes: ['200w', '400w', '1200w', '2400w'],
	}, {
		src: 'src/assets/whale.jpg',
		sizes: ['1x', '2x', '3x'],
	}, {
		src: 'src/assets/cities/nashville.jpg',
		sizes: ['320w', '480w'],
	}]
};


/**
 * Dynamically change settings based on image properties.
 */
function imageSettings(image, type) {
	var defaults = {
		jpg: {
			progressive: true,
			quality: 100
		},
		gif: {
			interlaced: false,
			optimizationLevel: 2,
			colors: 256
		},
		png: {}
	};
	var settings = defaults[type];
	// Set quality and optimizationLevel based on image width.
	if (image.width > 1920) {
		settings.quality = 30;
	} else if (image.width >= 1280) {
		settings.quality = 40;
	} else if (image.width >= 800) {
		settings.quality = 60;
	} else {
		settings.quality = 80;
	}
	return settings;
}
