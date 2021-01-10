define([
    "jquery",
    "widgets/base",
    "widgets/dropdown"
], function($){

    $.widget("ued.header", $.ued.base, {

        templates: {

            main: '\
                <nav class="navbar navbar-expand-lg navbar-light bg-light">\
                    {tmpl "brand"}\
                    {tmpl "toggler"}\
                    {tmpl "collapse"}\
                </nav>',

            brand: '\
                <a class="navbar-brand" href="#">FPX</a>',

            toggler: '\
                <button class="navbar-toggler" type="button">\
                    <span class="navbar-toggler-icon"></span>\
                </button>',

            collapse: '\
                <div class="collapse navbar-collapse">\
                    {tmpl "navleft"}\
                    {tmpl "search"}\
                    {tmpl "navright"}\
                </div>',

            navleft: '\
                <ul class="navbar-nav mr-auto">\
                    <li class="nav-item active">\
                        <a class="nav-link" href="#">管理控制台</a>\
                    </li>\
                    {slot "region"}\
                </ul>',

            region: '\
                <a class="dropdown-item" href="#">Action</a>\
                <a class="dropdown-item" href="#">Another action</a>\
                <div class="dropdown-divider"></div>\
                <a class="dropdown-item" href="#">Something else here</a>',

            search: '\
                <form class="form-inline my-2 my-lg-0">\
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">\
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>\
                </form>',

            navright: '\
                <ul class="navbar-nav">\
                    {slot "news"}\
                    {slot "other"}\
                    {slot "lang"}\
                    {slot "user"}\
                </ul>'


        },

        options: {


        },

        _create: function(){

        },

        _init: function(){
            this._region();
            this._news();
            this._other();
            this._lang();
            this._user();
        },

        _region: function(){
            this.region.dropdown({
                classes: {
                    _dropdown: "nav-item dropdown",
                    _toggle: "nav-link dropdown-toggle"
                },
                slotLabel: "全球",
                slotMenu: this._tmpl("region")
            });
        },

        _news: function(){
            this.news.dropdown({
                classes: {
                    _dropdown: "nav-item dropdown",
                    _toggle: "nav-link dropdown-toggle",
                    _menu: "dropdown-menu dropdown-menu-right"
                },
                slotLabel: "消息<span class=\"badge badge-danger\">5</span>",
                slotMenu: this._tmpl("region")
            });
        },

        _other: function(){
            this.other.dropdown({
                classes: {
                    _dropdown: "nav-item dropdown",
                    _toggle: "nav-link dropdown-toggle",
                    _menu: "dropdown-menu dropdown-menu-right"
                },
                slotLabel: "其它",
                slotMenu: this._tmpl("region")
            });
        },

        _lang: function(){
            this.lang.dropdown({
                classes: {
                    _dropdown: "nav-item dropdown",
                    _toggle: "nav-link dropdown-toggle",
                    _menu: "dropdown-menu dropdown-menu-right"
                },
                slotLabel: "语言",
                slotMenu: this._tmpl("region")
            });
        },

        _user: function(){
            this.user.dropdown({
                classes: {
                    _dropdown: "nav-item dropdown",
                    _toggle: "nav-link dropdown-toggle",
                    _menu: "dropdown-menu dropdown-menu-right"
                },
                type: "nav-link",
                slotLabel: "用户",
                slotMenu: this._tmpl("region")
            });
        }

    });

});