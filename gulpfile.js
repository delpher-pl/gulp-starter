const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const tildeImporter = require('node-sass-tilde-importer');
const del = require('del');
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
  lib: {
    fonts: [
      {
        from: './node_modules/@fortawesome/fontawesome-free/webfonts/**/*.*',
      },
    ],
    icons: [],
    images: [],
  },
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
    static: {
      fonts: './src/fonts/**/*.*',
      icons: './src/icons/**/*.*',
      images: './src/img/**/*.*',
    },
    staticDir: {
      fonts: './src/fonts/',
      icons: './src/icons/',
      images: './src/img/',
    },
  },
  dist: {
    main: './dist/',
    css: './dist/css/',
    js: './dist/js/',
  },
};


function copyFiles(arrOfObj, groupName) {
  arrOfObj.forEach((obj) => {
    gulp.src(obj.from)
      .pipe(obj.to ? gulp.dest(obj.to) : gulp.dest(path.src.staticDir[groupName]));
  });
}

function copyGroupFiles(obj) {
  Object.keys(obj).forEach((group) => {
    copyFiles(obj[group], group);
  });
}


// RELOAD BROWSER
gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

// DELETE DIST FOLDER
gulp.task('clean', () => del(path.dist.main));

// COPY FILES FROM NODE_MODULES TO SRC FOLDER
gulp.task('importFromNodeModules', (done) => {
  copyGroupFiles(path.lib);
  done();
});

gulp.task('html', (done) => {
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
  done();
});

gulp.task('sass', (done) => {
  gulp.src(path.src.scssFileMain)
    .pipe(sass({
      importer: tildeImporter,
      // includePaths: ['node_modules'],
    }))
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
  done();
});

gulp.task('js', (done) => {
  gulp.src([
    path.src.jsFilesAll,
  ])
    .pipe(concat('main.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js));
  done();
});

gulp.task('static', (done) => {
  gulp.src(Object.values(path.src.static), {
    base: 'src',
  })
    .pipe(gulp.dest(path.dist.main));
  done();
});


gulp.task('serve', (done) => {
  browserSync.init({
    server: 'dist/',
    // server: ['.', 'dist/'],
    // directory: true,
    open: false,
  });
  done();
});

gulp.task('watch', (done) => {
  gulp.watch(path.src.htmlFilesAll, gulp.series('html', 'reload'));
  gulp.watch(path.src.scssFilesAll, gulp.series('sass', 'reload'));
  gulp.watch(path.src.jsFilesAll, gulp.series('js', 'reload'));
  done();
});


gulp.task('build', gulp.series('clean', 'importFromNodeModules', 'html', 'sass', 'js', 'static'));

gulp.task('run', gulp.series('build', gulp.parallel('serve', 'watch')));

gulp.task('default', gulp.series('build'));
