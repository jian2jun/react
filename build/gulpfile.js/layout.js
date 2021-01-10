const {src, dest} = require('gulp');
const requirejsOptimize = require('gulp-requirejs-optimize');
const uglify = require('gulp-uglify');
const {input, output} = require('./utils');
const requireConfig = require('../' + input + '/vendors/require/require.config.js');

function layout() {
    return src([
        input + '/js/layout.js'
    ])
        .pipe(requirejsOptimize(function(file){
            return Object.assign({}, requireConfig, {
                baseUrl: input + '/js',
                optimize: 'none', // 不压缩
                exclude: []
            });
        }))
        .pipe(uglify({
            mangle: false // 不压缩变量名
        }))
        .pipe(dest(output + '/js'));
}

exports.default = layout;