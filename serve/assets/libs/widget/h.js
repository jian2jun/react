import $ from "../jquery/jquery.js";
import {vnode} from "../snabbdom/vnode.js";

var selReg = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
var selCache = {};
var selParse = function (selector){
    var match, tag = "div", classes = [], data = {};

    if(selector && (match = selCache[selector])){
        return match;
    }

    while (match = selReg.exec(selector)){
        var attrValue;
        var type = match[1], value = match[2];
        if (type === "" && value !== "") {
            tag = value;
        }
        else if (type === "#") data.id = value;
        else if (type === ".") classes.push(value);
        else if (match[3][0] === "[") {
            attrValue = match[6];
            if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
            if (match[4] === "class") classes.push(attrValue);
            else data[match[4]] = attrValue === "" ? attrValue : attrValue || true;
        }
    }

    if (classes.length > 0) data.class = classes;
    return selCache[selector] = {tag: tag, data: data};
};

var addNS = function (data, children, sel){
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (let i = 0; i < children.length; ++i) {
            const childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}

var getDct = function (arr){
    var result = {}, i = 0, v, children = [];

    if($.isPlainObject(arr[0]) && !arr[0].sel){
        result.data = arr[0];
        i = 1;
    }
    for( ; i < arr.length; i++){
        v = arr[i];
        if($.isArray(v)){
            getArrayChild(v, children);
        }
        else if($.isPlainObject(v)){
            children.push(v);
        }
        else if(v != null && typeof v !== "boolean"){
            children.push(String(v));
        }
    }
    if(children.length === 1 && typeof children[0] === "string"){
        result.text = children[0];
    }
    else if(children.length > 0){
        result.children = children;
    }

    return {
        data: result.data,
        children: result.children,
        text: result.text
    };
};

var getArrayChild = function (child, children){
    $.each(child, function(i, c){
        if($.isArray(c)){
            getArrayChild(c, children);
        }
        else if($.isPlainObject(c)){
            children.push(c);
        }
        else if(c != null && typeof c !== "boolean"){
            children.push(String(c));
        }
    });
};

var formatClass = function (classes){
    var result = {};

    if(classes == null || typeof classes === "boolean"){
        return;
    }
    if(typeof classes === "string"){
        classes = classes.split(/\s+/);
    }
    if($.isArray(classes)){
        $.each(classes, function (i, item) {
            if(item == null || typeof item === "boolean"){
                return;
            }
            if(typeof item === "string"){
                result[item] = true;
            }
            else if(typeof item === "object"){
                $.each(item, function (key, value){
                    result[key] = value;
                });
            }
        });
    }
    else if(typeof classes === "object"){
        result = classes;
    }

    return result;
};

var formatStyle = function (style){
    var result = {};

    if(style == null || typeof style === "boolean"){
        return;
    }
    if(typeof style === "string"){
        style = style.split(/;\s*/);
        $.each(style, function(i, item){
            if(item){
                item = item.split(/:\s*/);
                result[item[0]] = item[1];
            }
        });
    }
    else if(typeof style === "object"){
        result = style;
    }

    return result;
};

var transClassStyle = function (data) {
    if(data){
        data.class = formatClass(data.class);
        if(!data.class){
            delete data.class;
        }
        data.style = formatStyle(data.style);
        if(!data.style){
            delete data.style;
        }

        return data;
    }
}

var setData = function (value) {
    var data = {};
    var match;

    $.each(value, function(k, v){
        if($.inArray(k, ["key", "class", "style", "props", "hook", "dataset"]) > -1){
            data[k] = v;
        }else if(match = k.match(/^on(\w+)$/)){
            data.on = data.on || {};
            data.on[match[1]] = v;
        }
        else{
            data.attrs = data.attrs || {};
            data.attrs[k] = v;
        }
    });

    return data;
};

var setChildren = function (value) {
    var children = [];

    $.each(value, function (i, item) {
        if(typeof item === "string"){
            item = vnode(undefined, undefined, undefined, item, undefined);
        }
        children.push(item);
    });

    if(children.length){
        return children;
    }
};

export var h = function (sel, b, c){
    var slice = Array.prototype.slice;
    var selector = selParse(sel);
    sel = selector.tag;
    if(selector.data.id){
        sel += `#${selector.data.id}`;
    }
    if(selector.data.class){
        $.each(selector.data.class, function (i, item){
            sel += typeof i === "number" ? `.${item}` : `.${i}`;
        });
    }

    var dct = getDct(slice.call(arguments, 1));
    dct.data = $.widget.extend({}, transClassStyle(selector.data), transClassStyle(dct.data));
    var data = setData(dct.data);
    var children = setChildren(dct.children);
    var text = dct.text;

    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, undefined);
}