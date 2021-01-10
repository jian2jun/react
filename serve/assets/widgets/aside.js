define([
    "jquery",
    "widgets/base",
    "widgets/dropdown"
], function($){

    $.widget("ued.aside", $.ued.base, {

        templates: {

            main: '\
                <div class="_aside">\
                    {tmpl "brand"}\
                    {tmpl "toggler"}\
                    {tmpl "collapse"}\
                </div>'
        },

        options: {


        },

        _create: function(){

        },

        _init: function(){

        }

    });

});