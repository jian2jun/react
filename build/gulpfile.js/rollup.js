const {src, dest, series} = require('gulp');
const rollup = require('rollup');
const babel = require('gulp-babel');
const {input, output} = require('./utils');

async function build(){
    const bundle = await rollup.rollup({
        input: `${input}/js/index.js`
    });
    return await bundle.write({
        file: `${output}/js/index.js`,
        sourcemap: true
    });
}

function transES5(){
    return src([
        `${output}/js/index.js`
    ])
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    modules: false // 不添加严格模式语句
                }]
            ]
        }))
        .pipe(dest(`${output}/js`));
}

exports.default = series(
    build,
    transES5
);