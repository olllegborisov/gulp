const { src, dest, watch, parallel, series } = require('gulp');


const scss = require('gulp-sass')(require('sass')); // конвертирует scss в css (сжимает css:   outputStyle: 'compressed')
const concat = require('gulp-concat'); // соединение строк
const uglify = require('gulp-uglify-es').default; // сжимает js
const browserSync = require('browser-sync').create(); // открывает страницу локально, обновляет
const autoprefixer = require('gulp-autoprefixer');// добавляет префиксы. (overrideBrowserslist: ['last 10 version']) — указывает количество версий на которых будет действовать автопрефиксер
const clean = require('gulp-clean');
const webp = require('gulp-webp');


function scripts() {
    return src([
        'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js',

        // 'app/js/*.js', будет собирать все файлы в js
        // '!app/js/main.min.js'  кроме фкомпилированного файла
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream()) //обновляет страницу
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function conversion() {
    return src('app/images/*.*')
        .pipe(webp())
        .pipe(dest('dist/images'))
}

function watching() { // следит за изменениями в каждом из файлов ниже
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload) // 'app/**/*.html'  -- запись что бы наблюдатель перерыл все папки и нашел html везде


}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() { // удаляет файлы в дисте перед билдингом
    return src('dist')
        .pipe(clean())
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], { base: 'app' }) //сохраняет структуру
        .pipe(dest('dist'))
}

exports.scripts = scripts;
exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building)
exports.default = parallel(styles, scripts, conversion, browsersync, watching)


