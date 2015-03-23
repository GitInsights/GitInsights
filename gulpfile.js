var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var karma = require('karma').server
var nodemon = require('gulp-nodemon');

var paths = {
  scripts: [
    'client/*.js',
    'client/app/scripts/**/*.js',
  ],
  dist: 'client/app/dist'
}

gulp.task('default', ['lint', 'test', 'build', 'watch']);

// Lint js files
gulp.task('lint', function () {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

// Uglify and Concat js files
gulp.task('build', function () {
  gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['lint', 'test', 'build']);
});

gulp.task('serve', function () {
  nodemon({
    script: 'index.js',
    ext: 'html js',
    ignore: ['node_modules']
  })
  .on('change', ['lint', 'test'])
  .on('restart', function () {
    console.log('restarting server');
  });
});