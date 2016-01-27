const gulp 			= require('gulp');
const sass 			= require('gulp-sass');
const minicss		= require('gulp-cssnano');
const minijs		= require('gulp-uglify');
const browserify 	= require('browserify');
const source 		= require('vinyl-source-stream');
const buffer		= require('vinyl-buffer');
const connect 		= require('gulp-connect');
const open 			= require('gulp-open');

const port = 2000;

// This task compiles sass into css.
gulp.task('dev-sass', ()=> {
	return gulp.src('./src/css/main.scss')
		.pipe(sass('main.css'))
		.on('error', handle_error)
		.pipe(gulp.dest('./dist/css'))
		.pipe(connect.reload())
});

// This task bundles our scripts using browserify.
gulp.task('dev-scripts', ()=> {
	return browserify('./src/js/app.js')
		.on('error', handle_error)
		.bundle()
		.on('error', handle_error)
		.pipe(source('orion.js'))
		.on('error', handle_error)
		.pipe(gulp.dest('./dist/js'))
		.pipe(connect.reload())

});

// This task keeps an eye on our source files and rebuilds them when they change.
gulp.task('dev-watch', ()=> {
	gulp.watch('./src/css/**/*.scss', 	['dev-sass']);
	gulp.watch('./src/js/**/*.js', 		['dev-scripts']);
	gulp.watch('./index.html', 			['reload']);
})

// This task compiles sass into css, and then minifies it.
gulp.task('pro-sass', ()=> {
	return gulp.src('./src/css/main.scss')
		.pipe(sass('main.css'))
		.pipe(minicss())
		.pipe(gulp.dest('./dist/css'));
});

// This task bundles our scripts using browserify, and then minifies it.
gulp.task('pro-scripts', ()=> {
	return browserify('./src/js/app.js')
		.bundle()
		.pipe(source('orion.js'))
		.pipe(buffer())
		.pipe(minijs())
		.pipe(gulp.dest('./dist/js'));
});

// This task spins up a development server for us.
gulp.task('connect', ()=> {
	connect.server({
		livereload: true,
		port: port
	});
})

// This task can be used to manually reload our server.
gulp.task('reload', ()=>{
	gulp.src('./').pipe(connect.reload());
})

gulp.task('open',  ()=>{
	gulp.src(__filename)
		.pipe(open({uri: 'http://localhost:'+port}))
})

function handle_error(err){
	console.error(err);
	this.emit('end');
}


// This is the task we will run while developing our application.
// It will enable continuous development.
gulp.task('development', ['dev-scripts', 'dev-sass', 'connect', 'open', 'dev-watch']);

// This is the task we will run when we're ready to put our app into production.
// It will include a few optimiztions.
gulp.task('production', ['pro-sass', 'pro-scripts']);

