/**
 * .svgo.js
 * --------
 * Configuration for processing SVG files with SVGO and lib/svg.js.
 */

module.exports = {
    dest: 'build/app.svg',
    cmd: 'find ./node_modules/material-design-icons/{alert,file}/svg/production -name *_48px.svg -type f',
    successMsg: function() {
        return '    Saved SVG sprite to ' + this.dest + '.';
    },
    spritePrefix: '<svg xmlns="http://www.w3.org/2000/svg">',
    spriteSuffix: '</svg>',
    transformSvg: function(svg, filepath) {
        var path = require('path');
        var svgId = 'icon__' + path.basename(filepath, '.svg')
            .replace('ic_', '')
            .replace('_48px', '')
            .replace(/_/g, '-');
        return svg
            .replace('<svg', '<svg id="' + svgId + '"');
    },
    postOptimizeSvg: function (sprite) {
        return sprite
            .replace(/<svg/g, '<symbol')
            .replace(/<\/svg/g, '</symbol');
    },
    svgo: {
        plugins: [
            { removeDoctype: true },
            { removeXMLProcInst: true },
            { removeXMLNS: true },
            { removeDimensions: true },
            { cleanupIDs: false }
        ]
    }
};
