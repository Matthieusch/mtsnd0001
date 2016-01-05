var gulp = require('gulp'),

  // Global tools
  sourcemaps = require('gulp-sourcemaps'),
  changed = require('gulp-changed'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  watch = require('gulp-watch'),

  // For Sass/CSS files
  minifycss = require('gulp-minify-css'),

  // For JS Files
  uglify = require('gulp-uglify'),

  // For images
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant');

// Configurations :
var config = {
  build: '../app/',

  files : {
    images: {
      dest: '../app/files/',
      sources: [
        './files/**/*.png',
        './files/**/*.jpg',
        './files/**/*.gif'
      ]
    },
    pdf: {
      dest: '../app/files/',
      sources: [
        './files/**/*.pdf',
        './files/**/*.pdf',
        './files/**/*.pdf'
      ]
    }
  },

  javascript: {
    dest: '../app/js/',
    vendors: {
      output: 'vendors.js',
      sources: [
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-loader/angular-loader.js',
        './bower_components/snapjs/src/snap.js',
        './bower_components/angular-snap/angular-snap.js',
        './bower_components/angular-scroll/angular-scroll.js',
        './bower_components/jquery.easy-pie-chart/dist/angular.easypiechart.js',
        './bower_components/oridomi/oridomi.js'
      ]
    },
    modernizr: './bower_components/modernizr/modernizr.js',
    services: {
      dest: '../app/js/services/',
      sources: './js/services/*.json'
    },
    app: {
      output: 'app.js',
      sources: [
        './js/*.js',
        './js/**/*.js'
      ]
    }
  },

  css: {
    dest: '../app/css/',
    vendors: {
      output: 'vendors.css',
      sources: [
        './bower_components/angular-snap/angular-snap.min.css',
        './bower_components/animate.css/animate.min.css'
      ]
    }
  }


};

gulp.task('files-images', function () {
  return gulp.src(config.files.images.sources)
    .pipe(changed(config.files.images.dest))
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(config.files.images.dest));
});

gulp.task('files-pdf', function () {
  return gulp.src(config.files.pdf.sources)
    .pipe(changed(config.files.pdf.dest))
    .pipe(gulp.dest(config.files.pdf.dest));
});

gulp.task('javascript-vendors', function () {
  return gulp.src(config.javascript.vendors.sources)
    .pipe(sourcemaps.init())
    .pipe(concat(config.javascript.vendors.output))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.javascript.dest))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.javascript.dest));
});

gulp.task('javascript-modernizr', function () {
  return gulp.src(config.javascript.modernizr)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.javascript.dest));
});

gulp.task('javascript-services', function () {
  return gulp.src(config.javascript.services.sources)
    .pipe(gulp.dest(config.javascript.services.dest));
});

gulp.task('javascript-app', function () {
  return gulp.src(config.javascript.app.sources)
    .pipe(sourcemaps.init())
    .pipe(concat(config.javascript.app.output))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.javascript.dest))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.javascript.dest));
});

gulp.task('css-vendors', function () {
  return gulp.src(config.css.vendors.sources)
    .pipe(sourcemaps.init())
    .pipe(concat(config.css.vendors.output))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.css.dest))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.css.dest));
});


gulp.task('default', ['files-images', 'files-pdf', 'javascript-vendors', 'javascript-modernizr', 'javascript-services', 'javascript-app']);