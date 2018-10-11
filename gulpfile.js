var gulp        = require('gulp');
    del         = require('del');
    connect     = require('gulp-connect');
    sass        = require('gulp-sass');
    plumber     = require('gulp-plumber');
    concat      = require('gulp-concat');
    rename      = require('gulp-rename')
    cssnano     = require('gulp-cssnano');

var autoprefixer = require('gulp-autoprefixer');
var autoprefix = autoprefixer({ browsers: ['last 5 versions']}, { cascade: true });
var sassOptions = {
    plugins: [autoprefix]
};

var vendor = './bower_components';
var destination = './dist/';
var app = './src/';
var path = {
    watch: [
        app + 'index.html',
        app + 'js/**/*.js',
        app + './sass/**/*.scss'
    ],
    // vendor:{
    //     js:[
    //         vendor + '/jquery/dist/jquery.min.js',
    //         vendor + '/jqueryui/jquery-ui.min.js',
    //         vendor + '/bootstrap/dist/js/bootstrap.min.js'
    //     ],
    //     css:[
    //         vendor + '/bootstrap/dist/css/bootstrap.min.css',
    //         vendor + '/bootstrap/dist/css/bootstrap-theme.min.css',
    //         vendor + '/font-awesome/css/font-awesome.min.css'
    //     ],
    //     fonts:[
    //         vendor + '/bootstrap/dist/fonts/**.**',
    //         vendor + '/font-awesome/fonts/**.**'
    //     ]
    // }
};

//utils
gulp.task('clean', function () {
    del.sync([destination]);
});

//vendor
// gulp.task('vendorjs', function () {
//     gulp.src(path.vendor.js)
//         .pipe(concat('vendor.js'))
//         .pipe(gulp.dest(destination + 'vendor/js'))
// });
// gulp.task('vendorcss', function () {
//     gulp.src(path.vendor.css)
//         .pipe(concat('vendor.css'))
//         .pipe(gulp.dest(destination + 'vendor/css'))
// });
// gulp.task('vendorFonts', function(){
//     gulp.src(path.vendor.fonts)
//         .pipe(gulp.dest(destination + 'vendor/fonts'));
// });

//front-end
gulp.task('scripts', function(){
	gulp.src(app + 'js/**/*.js')
        .pipe(concat({ path: 'common.js'}))
        .pipe(gulp.dest(destination + 'js'));
});
gulp.task('sass', function () {
  	gulp.src(app + 'sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass(sassOptions))
        // .pipe(concat('app.css')) // конкатенация всех сss-файлов. отключить для использования @import.
        // .pipe(cssnano())
        .pipe(gulp.dest(destination + 'css'));
});

//server
gulp.task('reload', function () {
  gulp.src(path.watch)
    .pipe(connect.reload());
});
gulp.task('connect', function() {
  connect.server({ root: './', livereload: true });
});
gulp.task('watch', function () {
  gulp.watch([app + 'index.html'], ['sass', 'reload']);
  gulp.watch([app + 'sass/**/*.scss'], ['sass', 'reload']);
  gulp.watch([app + 'js/**/*.js'], ['scripts', 'reload']);
});



gulp.task('vendor', ['vendorjs', 'vendorcss', 'vendorFonts']);
gulp.task('app', ['scripts', 'sass']);
gulp.task('server', ['connect', 'watch']);

//default task
gulp.task('default', [
    'clean',
    // 'vendor',
    'app',
    'server'
]);
