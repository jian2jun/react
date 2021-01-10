import {toVNode} from "./tovnode.js";
import {h} from "./h.js";
import {patch} from "./init.js";

export const render = (children, node) => {
    const oldVnode = toVNode(node);
    const vnode = h(oldVnode.selector, oldVnode.data, children);
    patch(oldVnode, vnode);
};