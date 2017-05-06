# Bones

> A minimal front end framework.

## What I want my build tool to do:

[x] HTML compiler:
    [x] Compile pug to html
    [x] Compile markdown files to html
    [x] Insert markdown in pug (pug filters?)
    [x] Pass global data (from archie.block.js?) to pug (or any other task?)
    [x] Minification (prod?)
[x] CSS compiler:
    [x] Compile sass to css
    [x] Compile stylus to css
    [x] Autoprefix
    [x] Concatenation (prod?)
    [x] Minification (prod?)
[x] JS compiler:
    [x] Modules / bundling?
    [x] Concatenation (prod?)
    [x] Minification (prod?)
[x] Linters:
    [x] JS (eslint)
    [x] CSS linter (stylelint)
    [x] HTML linter (htmllint or htmlhint)
[x] Local server (browsersync? or lite-server?)
[x] Incrementally watch and build files (watchify? or onchange?).
[x] Add git hooks to automate the process of 1) creating a prod build; 2) running all prod tasks:
[x] SVG (svgo): Compile responsive SVG sprite and insert to HTML file.
[x] Responsive images (picturefill):
[x] Compress images (imagemin)
[x] Convert css fonts to base64 (postcss-font-magician & postcss-inline-base64 or postcss-base64, postcss-url, fontmin, webfont, fontoptim, postcss-url, postcss-font-magician?):
    [x] Copy node_modules font to destination and update reference in source css OR
    [x] Convert scss source file to base64?
[ ] Set up automated testing and use git hooks and process.exit() to run them:
    [ ] Run node css / visual screenshot regression tests with [webdriverio](http://webdriver.io/) and [wdio-screenshot](https://github.com/zinserjan/wdio-screenshot) (other tools include gemini?, paypal/nemojs?, nightwatchjs?, dayguardjs?, casperjs/phantomcss/slimerjs?) (integrates with BrowserStack? or cloud based testing tool?)
    [ ] Unit testing (Mocha, Jasmine, QUnit)
    [ ] E2E testing
    [ ] JS error detection.
[ ] Add [webcomponents](https://www.webcomponents.org/introduction) with their [polyfills](https://github.com/webcomponents/webcomponentsjs).
[ ] Performance metrics:
    [ ] Number of requests?
    [ ] Load time? (TTFB, Load)
    [ ] File sizes
    [ ] Google Pagespeed Optimizer API?
    [ ] Pingdom Tools API?
[ ] Add production build to 1) a git hook (precommit?) and 2) the option to run a prod build on process.exit():
    [ ] precommit git hook: Lint ALL files (not just changed files) either when closing out a watch/build or prior to a git commit.
    [ ] precommit git hook: Cache busting / add hash to css/js files.
    [ ] precommit git hook: Rename CSS class names to make files smaller (Google Closure Stylesheets?)
    [ ] precommit git hook: Format CSS (sort properties, etc)
    [ ] precommit git hook: Format JS with eslint / jscs
    [ ] precommit git hook: Cache busting / add hash to css/js files.
[ ] Any file:
    [ ] Add banner to top of files indicating license, author, version, etc.
    [ ] Rename any file?
    [ ] Identify broken links (HTML files?)
[ ] Add unit tests to make sure each task in bones runs properly.
[ ] Set up timers to time certain tasks.
[ ] Add better logging for all tasks (npmlog?) (especially JS... browserify doesn't have a great logger)?
[ ] Add automated changelog.
[ ] Automatically push static assets embedded in HTML directly to CDN (like Amazon S3 or CloudFront) and update the URL in source files.
[ ] Automatically generate documentation of the project with CSS style guides and JS functions?
[ ] Improve responsive images?
    [ ] Incremental build on watch (currently builds all).
    [ ] Parse srcset and picture elements to create config?
    [ ] Update srcset attributes when config changes?
    [ ] Convert images to base64?
    [ ] Image sprites?
[ ] Copy other assets (postcss-copy)
[ ] Add support for postcss, less?


## Example scripts

```bash
"scripts": {
    # https://gablaxian.com/blog/using-npm-as-a-build-tool
    "clean":            "rm -rf source/assets && mkdir source/assets",

    "fonts":            "cp -rf assets/fonts source/assets",

    "images":           "cp -rf assets/img source/assets",
    "webp:png":         "for file in assets/img/**/*.png; do ./node_modules/.bin/cwebp -lossless -q 80 $file -o source/$file.webp -short; done;", L"webp:jpg":         "for file in assets/img/**/*.jpg; do ./node_modules/.bin/cwebp -q 80 $file -o source/$file.webp -short; done;",
    "webp:gif":         "for file in assets/img/**/*.gif; do gif2webp $file -o source/$file.webp; done;",
    "webp":             "npm run webp:png & npm run webp:jpg & npm run webp:gif",

    "sass":             "node-sass --output-style=compressed --source-map=true --output=source/assets/css/ assets/sass/build.scss source/assets/css/main.css && npm run stats:css",

    "serviceWorker":    "cp -f assets/js/ServiceWorker.js source/ServiceWorker.js",
    "rollup":           "rollup -c -f es && npm run stats:js",

    "stats:css":        "echo \"Size of main.css is $(stat -c%s \"source/assets/css/main.css\") bytes ($(gzip -c source/assets/css/main.css | wc -c) bytes gzipped)\"",
    "stats:js":         "echo \"Size of main.js is $(stat -c%s \"source/assets/js/main.js\") bytes ($(gzip -c source/assets/js/main.js | wc -c) bytes gzipped)\"",
    "stats":            "npm run stats:css && npm run stats:js",

    "init":             "npm run fonts & npm run images & npm run sass & npm run serviceWorker & npm run rollup & npm run webp",

    "build":            "npm run clean && npm run init && npm run stats",
    "build:watch":      "onchange 'assets/sass/**/*.scss' -- npm run sass",

    # https://medium.com/@dabit3/introduction-to-using-npm-as-a-build-tool-b41076f488b0
    "test": "mocha test -u bdd -R spec",
    "pretest": "npm run lint",
    "posttest": "echo 'the test has been run!'",
    "start": "node server.js",
    "start:dev": "node server.js 4000",
    "lint": "jshint *.js **/*.js",
    "precompile": "npm run clean",
    "clean": "rimraf lib/*",
    "compile": "npm run compile:ts",
    "compile:ts": "tsc --outDir ./lib --module commonjs ./src/typescript/app.ts",
    "build:less": "lessc client/less/style.less public/css/style.css",
    "build:browserify": "browserify ./client/js/app.js -o ./public/js/bundle.js",
    "build:bundle": "browserify ./client/js/app.js | uglifyjs -mc > ./public/js/bundle.js",
    "build:clean": "rimraf public/css/*, public/js/*",
    "prebuild": "npm run build:clean",
    "build": "npm run build:less && npm run build:bundle",
    "watch:bundle": "watchify ./client/js/app.js -o ./public/js/bundle.js -v",

    # https://www.sitepoint.com/guide-to-npm-as-a-build-tool/
    "info": "echo 'npm as a build tool'",
    "lint": "echo '=> linting' && jshint assets/scripts/*.js",
    "test": "echo '=> testing' && mocha test/",
    "minify:js": "echo '=> minify:js' && uglifyjs assets/scripts/main.js -o dist/public/js/jquery.min.js",
    "minify:css": "echo '=> minify:css' && cleancss assets/css/main.css -o dist/public/css/main.min.css",
    "build": "echo '=> building' && npm run test -s && npm run minify:js -s && npm run minify:css -s",
    "pretest": "npm run lint -s",

    # https://idevie.com/web-development/using-npm-as-a-build-tool
    "start": "concurrently -k \"npm run dev\" \"npm run watch-css\"",
    "dev": "lite-server",
    "db": "json-server --watch db.json --port 3005",
    "build-js": "mkdir -p dist/js && uglifyjs src/js/*.js -m -o dist/js/app.js",
    "lint": "lint jshint src/**/**.js",
    "build-css": "node-sass --include-path scss scss/main.scss assets/main.css",
    "watch-css": "nodemon -e scss -x \"npm run build-css\"",
    "test": "mocha test",
    "pretest": "npm run lint",
    "posttest": "echo the test has been run!",
    "bash": "Location of the bash/shell script file"
}
```
