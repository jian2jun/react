const { parallel, src, dest } = require('gulp');
const cssmin = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const babel = require('gulp-babel');
const {input, output} = require('./utils');

function css() {
    return src([
        input + '/**/*.css'
    ])
        .pipe(cssmin())
        .pipe(rename(function (path) {
            return {
                dirname: path.dirname,
                basename: path.basename,
                extname: path.extname
            };
        }))
        .pipe(dest(output));
}

function fonts() {
    return src([
        input + '/**/*.eot',
        input + '/**/*.svg',
        input + '/**/*.ttf',
        input + '/**/*.woff',
        input + '/**/*.woff2'
    ])
        .pipe(dest(output));
}

function images() {
    return src([
        input + '/**/*.png',
        input + '/**/*.jpg',
        input + '/**/*.jpeg',
        input + '/**/*.gif',
        input + '/**/*.swf',
    ])
        .pipe(dest(output));
}

function js(){
    return src([
        input + '/**/*.js',
    ])
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    modules: false // 不添加严格模式语句
                }]
            ]
        }))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(rename(function (path) {
            return {
                dirname: path.dirname,
                basename: path.basename,
                extname: path.extname
            };
        }))
        .pipe(dest(output));
}

exports.default = parallel(
    css,
    fonts,
    images,
    js
);