var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var stream = require('vinyl-source-stream');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var browserify = require('browserify');
var babelify = require("babelify");
var babel = require("gulp-babel");
var terser = require('gulp-terser');
var version = require('gulp-version-append');
var buffer =require("vinyl-buffer");
var gutil = require('gulp-util');

var source = 'src/main';  
var destination = 'target/web';

gulp.task('clean', function () {
	return gulp.src(destination, {read: false})
		.pipe(clean({force: true}));
}); 

gulp.task('copy-html', function() {  
     gulp.src(source + '/app/pages/**/*.html')
    .pipe(version(['html', 'js', 'css']))
    .pipe(gulp.dest(destination ));
});

gulp.task('copy-css', function() {  
     gulp.src(source + '/app/pages/**/*.css')
    .pipe(gulp.dest(destination));

});

gulp.task('copy-js', function() {  
    gulp.src([source + '/app/pages/**/*.js'])
    .pipe(babel({presets: ["react"]}))
    .pipe(terser({ compress: true, mangle: true }))
    .pipe(gulp.dest(destination));
    
});


gulp.task('copy-resource', function() {  
    gulp.src([source + '/img/**/*']).pipe(gulp.dest(destination + '/assets/img'));
    gulp.src([source + '/css/**/*']).pipe(gulp.dest(destination + '/assets/css'));
    browserify(source + '/app/app.js')
    	// bundles it and creates a file called main.js
        .transform(babelify, {presets: ["react"]})
        .bundle()
        .pipe(stream('main.js'))
        .pipe(buffer())
        .pipe(terser({ compress: true, mangle: true }))
        .on('error', gutil.log)
        .pipe(gulp.dest(destination +'/assets/js'));
   
});


gulp.task('run', function () {
	connect.server({
		root: 'target/web',
		port: 4000
	});
});
gulp.task('watch', function() {

    gulp.watch(source + '/app/pages/**/*.css', ['copy-css']);
    gulp.watch(source + '/app/pages/**/*.js', ['copy-js']);
    gulp.watch(source + '/app/pages/**/*.html', ['copy-html']);
});


gulp.task('build', ['copy-js','copy-css','copy-html', 'copy-resource']);

gulp.task('hot', ['run', 'watch']);

