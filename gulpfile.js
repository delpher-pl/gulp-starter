const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const del = require('del');
const sequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// HTML
const htmlReplace = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');

// SCSS & CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css'); // Minification

// JS
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');


const path = {
  src: {
    main: './src/',
    htmlFileMain: './src/index.html',
    htmlFilesAll: './src/**/*.html',
    scss: './src/scss/',
    scssFileMain: './src/scss/style.scss',
    scssFilesAll: './src/scss/**/*.scss',
    js: './src/js/',
    jsFileMain: './src/js/main.js',
    jsFilesAll: './src/js/**/*.js',
  },
  dist: {
    main: './dist/',
    css: './dist/css/',
    js: './dist/js/',
  },
};

// RELOAD BROWSER
gulp.task('reload', () => browserSync.reload({ stream: true }));

// DELETE DIST FOLDER
gulp.task('clean', () => del(path.dist.main));

gulp.task('html', () => {
  gulp.src(path.src.htmlFilesAll)
    .pipe(htmlReplace({
      css: 'css/style.css',
      js: 'js/main.js',
    }))
    .pipe(htmlMin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest(path.dist.main));
});

gulp.task('sass', () => {
  gulp.src(path.src.scssFileMain)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: [
        'last 3 versions',
        'Firefox > 30',
        'Chrome > 30',
        'Opera > 30',
      ],
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(path.dist.css));
});

gulp.task('js', () => {
  gulp.src([
    path.src.jsFilesAll,
  ])
    .pipe(concat('main.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js));
});


gulp.task('serve', () => {
  browserSync.init({
    server: './dist/',
    open: false,
  });
});

gulp.task('watch', () => {
  gulp.watch(path.src.htmlFilesAll, () => {
    sequence('html', 'reload');
  });
  gulp.watch(path.src.scssFilesAll, () => {
    sequence('sass', 'reload');
  });
  gulp.watch(path.src.jsFilesAll, () => {
    sequence('js', 'reload');
  });
});

gulp.task('default', () => {
  gulp.start('build');
});

gulp.task('build', ['clean'], () => {
  sequence(['html', 'sass', 'js']);
});

gulp.task('run', ['clean'], () => {
  sequence(['html', 'sass', 'js'], 'serve', 'watch');
});


//
//
// gulp.task('cssMin', () => {});
// gulp.task('jsImportLibs', () => {});
// gulp.task('static', () => {});
