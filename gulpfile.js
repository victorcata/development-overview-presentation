var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass');

/**
 * SASS Precompiler
 */
gulp.task('sass', function(){
    return gulp.src('./app/styles/sass/core.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/styles'));
});

/**
 * SASS Watch for changes
 */
gulp.task('sass:watch', function(){
    gulp.watch('./app/styles/sass/*.scss', ['sass']);
});

/**
 * Default task
 */
gulp.task('default', ['sass']);
