const { series, parallel } = require('gulp');
const del = require('delete');
const {output, viewsOutput} = require('./utils');

function clean(cb){
    del([
        output,
        viewsOutput
    ], {force: true}, cb);
}

/*exports.default = series(
    clean,
    require('./main').default,
    parallel(
        require('./layout').default,
        require('./req').default
    ),
    require('./views').default
);*/

exports.default = series(
    clean,
    require('./rollup').default
);