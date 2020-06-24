const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const minify = require('gulp-minify');
const autoprefixer = require('gulp-autoprefixer');

const src = './src';
const out = './dist';

const paths = {
    styles: {
        in: src + '/sass/**/*.scss',
        out: out + '/styles'
    },
    scripts: {
        in: src + '/js/**/*.js',
        out: out + '/scripts'
    },
    assets: {
        html: src + '/**/*.html',
        images: src + '/images/**/*.*',
        fonts: src + '/fonts/**/*.*'
    }
}

sass.compiler = require('node-sass');
const sassDevOptions = { outputStyle: 'expanded' }
const sassProdOptions = { outputStyle: 'compressed' }
const minifyOptions = { ext: { src: '.js', min: '.min.js' } }
//const autoprefixerOptions = { browsers: 'last 3 versions, > 1%' } 

gulp.task('styles', async function(){
    gulp.src(paths.styles.in)
        .pipe(plumber())
        .pipe(sass(sassProdOptions).on('error', sass.logError))
        //.pipe(autoprefixer(autoprefixerOptions))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.styles.out));
});

gulp.task('scripts', async function(){
    gulp.src(paths.scripts.in)
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(minify(minifyOptions))
        .pipe(uglify({toplevel: true, compress: {drop_console: true}, mangle: {toplevel: true, properties: {}}, output: {preamble: "/* :) */"}}))
        .pipe(gulp.dest(paths.scripts.out));
});

gulp.task('copy-html-files', async function(){
    gulp.src(paths.assets.html)
        .pipe(gulp.dest(out));
});

gulp.task('copy-img-files', async function(){
    gulp.src(paths.assets.images)
        .pipe(gulp.dest(out + '/img'));
});

gulp.task('copy-font-files', async function(){
    gulp.src(paths.assets.fonts)
        .pipe(gulp.dest(out + '/fonts'));
});

gulp.task('default', 
    gulp.series(
        'styles', 
        'scripts', 
        'copy-html-files', 
        'copy-img-files', 
        'copy-font-files'
    )
);

gulp.task('watch', gulp.series('default', function() {
    gulp.watch(paths.styles.in, gulp.series('styles')).on('change', browserSync.reload);
    gulp.watch(paths.scripts.in, gulp.series('scripts')).on('change', browserSync.reload);
    gulp.watch(paths.assets.html, gulp.series('copy-html-files')).on('change', browserSync.reload);

    browserSync.init({server: out});
}));
