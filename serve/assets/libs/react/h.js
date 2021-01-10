import {vnode} from "./vnode.js";

const formatClass = (classes) => {
    let ret = [];
    if(typeof classes === "string" && classes !== ""){
        ret = classes.split(/\s+/);
    }
    else if(Array.isArray(classes)){
        classes.forEach(item => {
            if(typeof item === "string" && item !== ""){
                ret.push(item);
            }
        });
    }
    else if(classes !== null && typeof classes === "object"){
        for(let key in classes){
            if(!!classes[key]){
                ret.push(key);
            }
        }
    }
    return ret;
};

const formatStyle = (style) => {
    let ret = {};
    if(typeof style === "string" && style !== ""){
        style = style.split(/;\s*/);
        style.forEach(item => {
            if(item){
                item = item.split(/:\s*/);
                ret[item[0]] = item[1];
            }
        });
    }
    else if(style !== null && typeof style === "object"){
        ret = style;
    }
    return ret;
};

const setData = (data) => {
    if(data.style){
        data.style = formatStyle(data.style);
    }

    data.class = data.class || data.className;
    if(data.class){
        data.class = formatClass(data.class);
    }
    if(data.className){
        delete data.className;
    }

    return data;
};

const setChildren = (children, ret) => {
    for (const child of children) {
        if (child !== undefined && child !== null && child !== false && child !== "") {
            if (Array.isArray(child)) {
                setChildren(child, ret);
            }
            else if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
                ret.push(vnode("", {}, undefined, String(child), undefined));
            }
            else {
                ret.push(child);
            }
        }
    }
    return ret;
};

const addNS = (data, children, selector) => {
    data.ns = "http://www.w3.org/2000/svg";
    if (selector !== "foreignObject" && children !== undefined) {
        for (let i = 0; i < children.length; i++) {
            const childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].selector);
            }
        }
    }
}

export const h = (selector, data, ...children) => {
    let text;

    if(data == null){
        data = {};
    }
    else if(
        typeof data !== "object" || Array.isArray(data) || data.selector !== undefined
    ){
        children.unshift(data);
        data = {};
    }

    data = setData(data);
    children = setChildren(children, []);

    if (children.length === 1 && !children[0].selector && children[0].text) {
        text = children[0].text;
        children = undefined;
    }

    if (selector[0] === "s" && selector[1] === "v" && selector[2] === "g" &&
        (selector.length === 3 || selector[3] === "." || selector[3] === "#" || selector[3] === "[")) {
        addNS(data, children, selector);
    }

    return vnode(selector, data, children, text, undefined);
};