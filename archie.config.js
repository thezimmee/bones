/**
 * archie config
 * -------------
 * Configuration data for archie.
 */


var archie = module.exports = {};


archie.project = {
    // name: 'bones',
    description: 'This is my dumb project.',
    version: '1.0.0',
    author: {
        // name: 'The Zimmee',
        email: 'thezimmee@gmail.com',
        url: 'https://github.com/thezimmee/bones'
    },
    repo: {
        location: 'github',
        username: 'thezimmee',
        protocol: 'ssh'
    },
    license: 'MIT',
    keywords: ['static, site, generator, front, end, css, framework'],
    private: true
};
archie.dirs = {
    src: 'src',
    dest: 'build'
};
archie.globs = {
    pages: '**/*.html.pug'
};
archie.all = {
    options: {
        data: true,
        lodash: true,
        yaml: true
    }
};
archie.html = {
    engine: 'pug|markdown|html',
    options: {
        minify: true,
        lint: true,
    }
};
archie.css = {
    engine: 'stylus|sass|less|css',
    options: {
        minify: true,
        lint: true,
        autoprefix: true,
        sourcemaps: true,
        format: false,
        uncss: false,
    }
};
archie.js = {
    engine: 'babel|js',
    bundler: 'browserify|webpack|none',
    options: {
        minify: true,
        lint: true,
        format: false,
    }
};

archie.data = require('./src/data.data');
