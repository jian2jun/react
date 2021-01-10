import { vnode } from "./vnode.js";
import { htmlDomApi as api } from "./htmldomapi.js";
import { selectorParse } from "./selectorparse.js";
import {patchData} from "./data.js";
import {createComponent, updateComponent} from "./component.js";
import {options} from "./hooks.js";

function isUndef(s) {
    return s === undefined;
}

function isDef(s) {
    return s !== undefined;
}

const emptyNode = vnode("", {}, undefined, undefined, undefined);

function sameVnode(vnode1, vnode2) {
    return vnode1.data.key === vnode2.data.key && vnode1.selector === vnode2.selector;
}

function isVnode(vnode) {
    return vnode.selector !== undefined;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var _a;
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
        if (key !== undefined) {
            map[key] = i;
        }
    }
    return map;
}

function emptyNodeAt(elm) {
    const id = elm.id ? "#" + elm.id : "";
    const c = elm.className ? "." + elm.className.split(" ").join(".") : "";
    return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
}

function createRmCb(childElm, listeners) {
    return function rmCb() {
        if (--listeners === 0) {
            const parent = api.parentNode(childElm);
            api.removeChild(parent, childElm);
        }
    };
}
export function createNode(vnode, {context, queue, parentNode}, nodes) {
    let i;
    const data = vnode.data;
    const children = vnode.children;
    const selector = vnode.selector;

    if(typeof selector === "function"){
        createComponent(vnode, {context, queue, parentNode}, nodes);
    }
    else if (selector === "!") {
        if (isUndef(vnode.text)) {
            vnode.text = "";
        }
        vnode.node = api.createComment(vnode.text);
        nodes.push(vnode.node);
    }
    else if (selector !== "") {
        const ret = selectorParse(selector);
        const node = vnode.node = data.ns
            ? api.createElementNS(data.ns, ret.tag)
            : api.createElement(ret.tag);

        for(let key in ret.data){
            node.setAttribute(key, ret.data[key]);
        }
        patchData(emptyNode, vnode);

        if (children) {
            for (i = 0; i < children.length; ++i) {
                const childVnode = children[i];
                const childNodes = createNode(childVnode, {context, queue, parentNode: node}, []);
                childNodes.forEach(childNode => {
                    api.appendChild(node, childNode);
                });
            }
        }
        else if (vnode.text) {
            api.appendChild(node, api.createTextNode(vnode.text));
        }

        nodes.push(vnode.node);
    }
    else if(vnode.text){
        vnode.node = api.createTextNode(vnode.text);
        nodes.push(vnode.node);
    }

    return nodes;
}

function addVnodes(parentNode, before, vnodes, startIdx, endIdx, {context, queue}) {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        if (ch != null) {
            let nodes = createNode(ch, {parentNode, context, queue}, []);
            nodes.forEach(node => {
                api.insertBefore(
                    parentNode,
                    node,
                    before
                );
            });
        }
    }
}
function invokeDestroyHook(vnode) {
    var _a, _b;
    const data = vnode.data;
    if (data !== undefined) {
        (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode);
        for (let i = 0; i < cbs.destroy.length; ++i)
            cbs.destroy[i](vnode);
        if (vnode.children !== undefined) {
            for (let j = 0; j < vnode.children.length; ++j) {
                const child = vnode.children[j];
                if (child != null && typeof child !== 'string') {
                    invokeDestroyHook(child);
                }
            }
        }
    }
}
function removeVnodes(parentNode, vnodes, startIdx, endIdx) {
    var _a, _b;
    for (; startIdx <= endIdx; ++startIdx) {
        let listeners;
        let rm;
        const ch = vnodes[startIdx];
        if (ch != null) {
            if (isDef(ch.selector)) {
                invokeDestroyHook(ch);
                listeners = cbs.remove.length + 1;
                rm = createRmCb(ch.elm, listeners);
                for (let i = 0; i < cbs.remove.length; ++i)
                    cbs.remove[i](ch, rm);
                const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
                if (isDef(removeHook)) {
                    removeHook(ch, rm);
                }
                else {
                    rm();
                }
            }
            else { // Text node
                api.removeChild(parentNode, ch.elm);
            }
        }
    }
}
export function updateChildren(parentNode, oldCh, newCh, {context, queue}) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let nodeToMove;
    let before;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode, {context, queue});
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, {context, queue});
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode, {context, queue});
            api.insertBefore(parentNode, oldStartVnode.node, api.nextSibling(oldEndVnode.node));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, {context, queue});
            api.insertBefore(parentNode, oldEndVnode.node, oldStartVnode.node);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (isUndef(idxInOld)) {
                let nodes = createNode(newStartVnode, {parentNode, context, queue}, []);
                nodes.forEach(node => {
                    api.insertBefore(
                        parentNode,
                        node,
                        oldStartVnode.node
                    );
                });
            }
            else {
                nodeToMove = oldCh[idxInOld];
                if (nodeToMove.selector !== newStartVnode.selector) {
                    let nodes = createNode(newStartVnode, {parentNode, context, queue}, []);
                    nodes.forEach(node => {
                        api.insertBefore(
                            parentNode,
                            node,
                            oldStartVnode.node
                        );
                    });
                }
                else {
                    patchVnode(nodeToMove, newStartVnode, {context, queue});
                    oldCh[idxInOld] = undefined;
                    api.insertBefore(parentNode, nodeToMove.node, oldStartVnode.node);
                }
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].node;
            addVnodes(parentNode, before, newCh, newStartIdx, newEndIdx, {context, queue});
        }
        else {
            removeVnodes(parentNode, oldCh, oldStartIdx, oldEndIdx);
        }
    }
}
export const patchVnode = (oldVnode, vnode, {context, queue}) => {
    const node = vnode.node = oldVnode.node;
    const oldCh = oldVnode.children;
    const ch = vnode.children;

    if(typeof vnode.selector === "function"){
        return updateComponent(oldVnode, vnode, {context, queue});
    }

    patchData(oldVnode, vnode);

    if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch)
                updateChildren(node, oldCh, ch, {context, queue});
        }
        else if (isDef(ch)) {
            if (isDef(oldVnode.text))
                api.setTextContent(node, "");
            addVnodes(node, null, ch, 0, ch.length - 1, {context, queue});
        }
        else if (isDef(oldCh)) {
            removeVnodes(node, oldCh, 0, oldCh.length - 1);
        }
        else if (isDef(oldVnode.text)) {
            api.setTextContent(node, "");
        }
    }
    else if (oldVnode.text !== vnode.text) {
        if (isDef(oldCh)) {
            removeVnodes(node, oldCh, 0, oldCh.length - 1);
        }
        api.setTextContent(node, vnode.text);
    }
};

export const patch = (oldVnode, vnode) => {
    const context = {};
    const queue = [];

    if (!isVnode(oldVnode)) {
        oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, {context, queue});
    }
    else {
        const oldNode = oldVnode.node;
        const parentNode = api.parentNode(oldNode);
        if (parentNode != null) {
            const nextNode = api.nextSibling(oldNode);
            const nodes = createNode(vnode, {context, queue, parentNode}, []);
            nodes.forEach(node => {
                api.insertBefore(parentNode, node, nextNode);
            });
            removeVnodes(parentNode, [oldVnode], 0, 0);
        }
    }

    if(options._commit){
        options._commit(vnode, queue);
    }

    return vnode;
}