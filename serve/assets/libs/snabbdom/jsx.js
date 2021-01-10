import { vnode } from "./vnode.js";
import { h } from "../react/h.js";

function flattenAndFilter(children, flattened) {
    for (const child of children) {
        if (child !== undefined && child !== null && child !== false && child !== '') {
            if (Array.isArray(child)) {
                flattenAndFilter(child, flattened);
            }
            else if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
                flattened.push(vnode(undefined, undefined, undefined, String(child), undefined));
            }
            else {
                flattened.push(child);
            }
        }
    }
    return flattened;
}

export function jsx(tag, data, ...children) {
    const flatChildren = flattenAndFilter(children, []);
    if (flatChildren.length === 1 && !flatChildren[0].sel && flatChildren[0].text) {
        return h(tag, data, flatChildren[0].text);
    }
    else {
        return h(tag, data, flatChildren);
    }
}