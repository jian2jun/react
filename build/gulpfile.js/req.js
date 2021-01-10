const {src, dest} = require('gulp');
const filter = require('gulp-filter');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const {input, output, version} = require('./utils');

function req(){
    const envFilter = filter('**/env.js', {
        restore: true // 回退
    });
    return src ([
        input + '/vendors/require/env.js',
        input + '/vendors/require/require.config.js',
        input + '/vendors/require/require.js'
    ])
        .pipe(envFilter)
        .pipe(replace('_VERSION_', version))
        .pipe(envFilter.restore)
        .pipe(concat('require.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(dest(output + '/vendors/require'));
}

exports.default = req;