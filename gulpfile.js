const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');


const path = {};


gulp.task('html', function(){});
gulp.task('sass', function(){});
gulp.task('cssMin', function(){});
gulp.task('jsImportLibs', function(){});
gulp.task('js', function(){});
gulp.task('watch', function(){});
gulp.task('default', function(){});
gulp.task('build', function(){});


gulp.task('serve', function(){
  browserSync.init({
      server: "./dist/",
      open: false
  });
});
