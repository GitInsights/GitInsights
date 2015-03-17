var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var paths = {
  scripts: [
    'client/*.js',
    'client/app/scripts/**/*.js',
  ],
  dist: 'client/app/dist'
}

gulp.task('default', ['lint', 'build', 'watch']);

// Lint js files
gulp.task('lint', function () {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

// Uglify and Concat js files
gulp.task('build', function () {
  gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['lint', 'build']);
});
