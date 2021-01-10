const {src, dest, parallel} = require('gulp');
const htmlminify = require('gulp-html-minify');
const replace = require('gulp-replace');
const {viewsInput, viewsOutput, version} = require('./utils');

function views(){
    return src ([
        viewsInput + '/**/*.html',
        `!${viewsInput}/layout/*.html`,
        `!${viewsInput}/fragment/*.html`
    ])
        .pipe(htmlminify())
        .pipe(replace(/\{\{extend(.+?)\}\}/, function (m, args){
            if(args.includes('layout/base')){
                return '<!DOCTYPE html><html layout:decorate="~{layout/base}"><head>';
            }else if(args.includes('layout/error')){
                return '<!DOCTYPE html><html layout:decorate="~{layout/error}"><head>';
            }else if(args.includes('layout/login')){
                return '<!DOCTYPE html><html layout:decorate="~{layout/login}"><head>';
            }else if(args.includes('layout/pass')){
                return '<!DOCTYPE html><html layout:decorate="~{layout/pass}"><head>';
            }else if(args.includes('layout/user')){
                return '<!DOCTYPE html><html layout:decorate="~{layout/user}"><head>';
            }
        }))
        .pipe(replace(/\{\{block(.+?)\}\}(.+?)\{\{\/block\}\}/g, function (m, args, cont){
            if(args.includes('title')){
                return '<title th:text="${title}"></title><meta name="description" th:content="${description}"><meta name="keywords" th:content="${keywords}">';
            }else if(args.includes('head')){
                return cont.replace(/\.css/g, `.css?v=${version}`) + '</head>';
            }else if(args.includes('body')){
                return '<body><div layout:fragment="body">' + cont + '</div>';
            }else if(args.includes('article')){
                return '<body><div layout:fragment="article">' + cont + '</div>';
            }else if(args.includes('script')){
                return cont.replace('<script>', '<script layout:fragment="script">') + '</body></html>';
            }
        }))
        .pipe(dest(viewsOutput));
}

function layout(){
    return src ([
        viewsInput + '/layout/*.html'
    ])
        .pipe(htmlminify())
        .pipe(replace(/\{\{block(.+?)\}\}(.*?)\{\{\/block\}\}/g, function (m, args, cont){
            if(args.includes('title') || args.includes('head')){
                return '';
            }else if(args.includes('body')){
                return '<div layout:fragment="body"></div>';
            }else if(args.includes('script')){
                return '<script layout:fragment="script"></script>';
            }
        }))
        .pipe(replace(/\{\{include(.+?)\}\}/g, function (m, args){
            if(args.includes('fragment/header')){
                return '<div th:replace="fragment/header"></div>';
            }else if(args.includes('fragment/footer')){
                return '<div th:replace="fragment/footer"></div>';
            }else if(args.includes('fragment/aside')){
                return '<div th:replace="fragment/aside"></div>';
            }
        }))
        .pipe(replace('<script src="/vendors/require/require.config.js"></script>', ''))
        .pipe(replace(/(\.css|\.js)/g, function (m, args){
            return `${m}?v=${version}`;
        }))
        .pipe(dest(`${viewsOutput}/layout`));
}

function fragment(){
    return src ([
        viewsInput + '/fragment/*.html'
    ])
        .pipe(htmlminify())
        .pipe(dest(`${viewsOutput}/fragment`));
}

exports.default = parallel(
    views,
    layout,
    fragment
);