import gulp from 'gulp';
import gulpif from 'gulp-if';
import newer from 'gulp-newer';
import pkg from './package.json';

// js
import { rollup } from 'rollup';
import rollupNodeResolve from "@rollup/plugin-node-resolve";
// import resolve from 'rollup-plugin-node-resolve';
import rollupBabel from "@rollup/plugin-babel";
// import babel from 'rollup-plugin-babel';
import rollupCommonjs from "@rollup/plugin-commonjs";
// import common from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
// css
// import sass from 'gulp-sass';
import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';

// svg
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgo';
import rename from 'gulp-rename';

// html
import swig from 'gulp-swig';
import htmlmin from 'gulp-htmlmin';
import data from 'gulp-data';
import yaml from 'js-yaml';
import fs from 'fs';

import notifier from 'node-notifier';

import browserSync from 'browser-sync';

const babelrc = Object.assign({}, pkg.babel);
const isProd = process.env.NODE_ENV === 'production' ? true : false;

const paths = {
  "url": "app.test",
  "src": "./src/",
  "dest": "./dist/",
  // "build": "./build/",
  "styles": {
    "src": "./src/assets/sass/",
    "dest": "./dist/css/",
    "main": "app"
  },
  "scripts": {
    "src": "./src/assets/js/",
    "dest": "./dist/js/",
    "main": "app",
    "vendors": {
      "src": "./dist/js/vendors/",
      "main": "vendors"
    }
  },
  "views": {
    "src": "./src/views/",
    "srcSwig": "./src/swig/",
    "dest": "./dist/",
  }
}
const processors = [
  autoprefixer({
    overrideBrowserslist: pkg.browserslist,
    cascade: false
  }),
  csso
];
// Error notify
const notify = (title, message) => {
  notifier.notify({
    title: title,
    message: message,
    sound: true
  });
};

const error = (object, error, type) => {
  const message = (type == 'stack') ? error.stack : error.toString();
  console.error(message);
  notify('🚫 Error! ', error.message);
  object.emit('end');
}


// js
const scripts = () => {
  return rollup({
    input: paths.scripts.src + paths.scripts.main + ".js",
    plugins: [
      rollupNodeResolve(),
      rollupBabel(babelrc),
      rollupCommonjs({
        include: "node_modules/**",
      }),
      terser(),
    ],
  }).then((bundle) => {
    return bundle.write({
      file: paths.scripts.dest + paths.scripts.main + ".js",
      name: paths.scripts.main,
      format: "umd", // es or iife
      sourcemap: isProd ? false : true,
    });
  });
};

// css
const styles = () => {
  return gulp.src(paths.styles.src + '/app.scss')
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: isProd ? 'compressed' : 'expanded', // nested, expanded, compact, compressed
        precision: 5
      })
      .on('error', function(err) {
        error(this, err, 'stack');
      })
    )
    //.pipe(postcss(processors))
    .pipe(gulpif(!isProd, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
};


// BrowserSync
const server = browserSync.create();
const serve = (done) => {
  server.init({
    server: {
      baseDir: !isProd ? [paths.dest, paths.dest] : paths.dest,
      directory: true,
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    // proxy: paths.url,
    // host: paths.url,
    open: 'external'
  });
  done();
}

// Copy
const img = () => {
  return gulp.src(`${paths.src}/assets/img/**`)
    .pipe(newer(`${paths.dest}/img/`))
    .pipe(gulp.dest(`${paths.dest}/img/`))
}
const staticfiles = () => {
  return gulp.src([`${paths.src}/u/**`, `${paths.src}/u/.*`])
    .pipe(gulp.dest(`${paths.dest}`))
}
// const views = () => {
//   return gulp
//     .src(`${paths.views.src}**/*.html`)
//     .on('error', function(err) {
//         error(this, err);
//     })
//     .pipe(gulp.dest(paths.views.dest));
// }

const htmlSwig = () => {
  return gulp
    .src(paths.views.srcSwig + '*.html')
    .pipe(data(function(file) {
        return yaml.safeLoad(fs.readFileSync(paths.views.srcSwig + '/data.yml', 'utf8'));
    }))
    .pipe(swig({
      defaults: {
        cache: false
      }
    }))
    .pipe(gulpif(isProd, htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true
    })))
    .on('error', function(err) {
        error(this, err);
    })
    .pipe(gulp.dest(paths.dest));
}

const spriteSVG = () => {
  return gulp
    .src(`${paths.src}/assets/sprite/**/*.svg`, { base: `${paths.src}/assets/sprite/` })
    .pipe(rename(function(file) {
      if (file.dirname != '.') {
        const name = file.dirname.split(path.sep);
        name.push(file.basename);
        file.basename = name.join('-');
      }
    }))
    .pipe(
      svgo({
        plugins: [
          { removeXMLNS: true },
          { cleanupListOfValues: true },
          { removeViewBox: false },
          { removeDimensions: true },
          { removeStyleElement: true },
          { removeScriptElement: true },
          { removeUselessStrokeAndFill: true },
          { mergePaths: false }, // ionic icons has multiple path
          { removeAttrs: { attrs: '(data-.*)' } },
        ],
        multipass: true,
      })
    )
    .pipe(svgstore())
    .on('error', function(err) {
        error(this, err);
    })
    .pipe(gulp.dest(`${paths.dest}/img/`));
}

// Watch
const watch = () => {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(`${paths.views.srcSwig}`, gulp.series(htmlSwig, reload));
  gulp.watch(`${paths.src}/assets/sprite/`, gulp.series(spriteSVG, reload));
  gulp.watch(`${paths.src}/assets/img/`, img);
  gulp.watch(`${paths.src}/u/`, staticfiles);
  // gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  // gulp.watch(paths.scripts.vendors.src, concat);
}

const reload = (done) => {
  server.reload();
  done();
}
const compile = gulp.series(
  styles,
  scripts,
  img,
  spriteSVG,
  htmlSwig,
  staticfiles
);
const main = isProd ? gulp.series(compile) : gulp.series(compile, serve, watch);

gulp.task('svg', spriteSVG);
gulp.task('js', scripts);
gulp.task('static', staticfiles);
gulp.task('img', img);
gulp.task("styles", styles);

gulp.task('default', main);

