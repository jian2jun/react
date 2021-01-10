define(["jquery", "widgets/base"], function($){

    $.widget("ued.dropdown", $.ued.base, {

        templates: {

            main: '\
                <div class="_dropdown">\
                    {tmpl "toggle"}\
                    {tmpl "menu"}\
                </div>',

            toggle: '\
                <a class="_toggle" href="#" data-toggle="dropdown">\
                    {slot "label"}\
                </a>',

            menu: '\
                <div class="_menu">\
                    {slot "menu"}\
                </div>'
        },

        options: {

            classes: {
                _dropdown: "dropdown",
                _toggle: "dropdown-toggle",
                _menu: "dropdown-menu"
            },

            slotLabel: null,

            slotMenu: null,

        },

        _create: function(){

        },

        _init: function(){

            this._replaceSlot(this.label, this.options.slotLabel);
            this._replaceSlot(this.menu, this.options.slotMenu);
        }

    });

});