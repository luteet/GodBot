const { src, dest, watch, parallel, series } = require('gulp');

const scss         = require('gulp-sass')(require('sass')),
      fs           = require('fs'),
      concat       = require('gulp-concat'),
      browserSync  = require('browser-sync').create(),
      uglify       = require('gulp-uglify-es').default,
      autoprefixer = require('gulp-autoprefixer'),
      del          = require('del'),
      webp         = require('gulp-webp'),
      webpHTML     = require('gulp-webp-html'),
      include      = require('gulp-file-include'),
      minCSS       = require('gulp-cssmin'),
      mediaGroup   = require('gulp-group-css-media-queries'),
      ttf2woff     = require('gulp-ttf2woff'),
      ttf2woff2    = require('gulp-ttf2woff2'),
      zipArchive    = require('gulp-zip');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
        notify: false,
    })
}

function cleanDist() {
    return del('dist')

}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- <Скрипты> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

function scriptsLib() {
    return src([
        'node_modules/swiper/swiper-bundle.min.js', // Слайдер
        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        'node_modules/chart.js/dist/chart.min.js',
        //'node_modules/minibarjs/dist/minibar.min.js',
        'app/js/OverlayScrollbars.min.js',
        //'node_modules/chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.min.js',
        //'node_modules/apexcharts/dist/apexcharts.min.js'
        //'node_modules/shufflejs/dist/shuffle.min.js', // Tab Filter
        //'node_modules/sticky-js/dist/sticky.min.js' // Sticky
        //'node_modules/jquery/dist/jquery.js', // jQuery
        //'node_modules/slick-carousel/slick/slick.min.js', // Слайдер (jQuery)
        //'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js', // Попап (jQuery)
        //'node_modules/wowjs/dist/wow.min.js', // Анимация
        //'node_modules/nouislider/dist/nouislider.min.js', // Кастомный input[range]
        //'node_modules/fslightbox/index.js', // Галерея
        //'node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js', // Полифил для window.scroll()
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

function scriptsMin() {
    return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

function scripts() {
    return src('app/js/*.js')
    .pipe(scriptsMin())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- </Скрипты> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- <HTML> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

function htmlCompilation() {
    return src(['app/*.html'])
    .pipe(include())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

function htmlComponents() {
    return src('app/html/**/_*.html')
    .pipe(include())
    .pipe(htmlCompilation())
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- </HTML> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- <Стили> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(mediaGroup())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 1 version'],
            grid: true
        }))
        .pipe(minCSS())
        .pipe(concat('style.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

function stylesOriginal() {
    return src('app/scss/style.scss')
        .pipe(scss())
        .pipe(mediaGroup())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 1 version'],
            grid: true
        }))
        .pipe(dest('dist/css'))
}

function CSSlibBuild() {
    return src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/swiper/swiper-bundle.min.css', // Слайдер
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        //'node_modules/minibarjs/dist/minibar.min.css',
        'app/css/OverlayScrollbars.min.css',
        //'node_modules/slick-carousel/slick/slick.css', // Слайдер (jQuery)
        //'node_modules/magnific-popup/dist/magnific-popup.css' // Попап (jQuery)
        //'node_modules/aos/dist/aos.css', // Анимация
        //'node_modules/nouislider/dist/nouislider.css', // Кастомный input[range]
    ])
    .pipe(concat('_libs.scss'))
    .pipe(dest('app/scss'))
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- </Стили> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- <Шрифты> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

function ttf2woffConvert() {
    return src('app/fonts/*.ttf', '!app/fonts/icomoon.ttf')
        .pipe(ttf2woff())
        .pipe(dest('dist/css'))
}

function ttf2woff2Convert() {
    return src('app/fonts/*.ttf', '!app/fonts/icomoon.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('dist/css'))
}

function fonts() {
    return src('app/fonts/*.ttf', 'app/css/*.woff', 'app/css/*.woff2', 'app/fonts/icomoon*')
        .pipe(dest('dist/css'))
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- </Шрифты> -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

function json() {
    return src('app/json/*.json')
        .pipe(dest('dist/json'))
}

function video() {
    return src('app/video/*')
        .pipe(dest('dist/video'))
}

function audio() {
    return src('app/audio/*')
        .pipe(dest('dist/audio'))
}

let package = fs.readFileSync('package.json'),
    name;

    package = JSON.parse(package);
    name = package.name;

function zipStart() {
    return src(['./**', '!./node_modules/**', '!./package-lock.json', `!./${name}.zip`])
        .pipe(dest(`./${name}/${name}/`))
}

function zipEnd() {
    return src(`./${name}/**`)
        .pipe(zipArchive(`${name}.zip`))
        .pipe(dest(`./`))
}

function zipDel() {
    return del(`${name}`);
}

function watching() {
    watch(['app/scss/**/*.scss'], series(styles, stylesOriginal));
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/json/*.json'], json);
    watch(['app/video/*'], video);
    watch(['app/audio/*'], audio);
    watch(['app/*.html'], htmlCompilation);
    watch(['app/html/**/_*.html'], htmlComponents);
}


exports.styles = styles
exports.stylesOriginal = stylesOriginal;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.scriptsMin = scriptsMin;
exports.scriptsLib = scriptsLib;
exports.cleanDist = cleanDist;
exports.CSSlibBuild = CSSlibBuild;
exports.ttf2woffConvert = ttf2woffConvert;
exports.ttf2woff2Convert = ttf2woff2Convert;
exports.fonts = fonts;
exports.htmlComponents = htmlComponents;
exports.htmlCompilation = htmlCompilation;
exports.zipStart = zipStart;
exports.zipEnd = zipEnd;
exports.zipDel = zipDel;

exports.fonts = series(ttf2woffConvert, ttf2woff2Convert, fonts);
exports.zip = series(zipStart, zipEnd, zipDel);
exports.default = parallel(CSSlibBuild, styles, watching, scriptsLib, scriptsMin, scripts, htmlCompilation, json, browsersync);
