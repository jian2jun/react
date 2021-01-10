import { vnode } from "./vnode.js";
import * as is from "./is.js";
import { htmlDomApi } from "./htmldomapi.js";
import {createComponent, updateComponent} from "./component.js";
import {options} from "./usehooks.js";

function isUndef(s) {
    return s === undefined;
}
function isDef(s) {
    return s !== undefined;
}
const emptyNode = vnode('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
    return vnode.sel !== undefined;
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
    const id = elm.id ? '#' + elm.id : '';
    const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
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
export function createElm(vnode, globalContext, commitQueue, options) {
    var _a, _b;
    let i;
    let data = vnode.data;
    if (data !== undefined) {
        const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
        if (isDef(init)) {
            init(vnode);
            data = vnode.data;
        }
    }
    const children = vnode.children;
    const sel = vnode.sel;
    if (sel === '!') {
        if (isUndef(vnode.text)) {
            vnode.text = '';
        }
        vnode.elm = api.createComment(vnode.text);
    }
    else if(typeof sel === "function"){
        createComponent(vnode, globalContext, commitQueue, options);
    }
    else if (sel !== undefined) {
        // Parse selector
        const hashIdx = sel.indexOf('#');
        const dotIdx = sel.indexOf('.', hashIdx);
        const hash = hashIdx > 0 ? hashIdx : sel.length;
        const dot = dotIdx > 0 ? dotIdx : sel.length;
        const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
        const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
            ? api.createElementNS(i, tag)
            : api.createElement(tag);
        if (hash < dot)
            elm.setAttribute('id', sel.slice(hash + 1, dot));
        if (dotIdx > 0)
            elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
        for (i = 0; i < cbs.create.length; ++i)
            cbs.create[i](emptyNode, vnode);
        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                const ch = children[i];
                if (ch != null) {
                    api.appendChild(elm, createElm(ch, globalContext, commitQueue, {parentElm: elm, method: "appendChild"}));
                }
            }
        }
        else if (is.primitive(vnode.text)) {
            api.appendChild(elm, api.createTextNode(vnode.text));
        }
    }
    else {
        vnode.elm = api.createTextNode(vnode.text);
    }
    return vnode.elm;
}
function addVnodes(parentElm, before, vnodes, startIdx, endIdx, globalContext, commitQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        if (ch != null) {
            api.insertBefore(
                parentElm,
                createElm(ch, globalContext, commitQueue, {parentElm: parentElm, method: "insertBefore", referenceNode: before}),
                before
            );
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
function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    var _a, _b;
    for (; startIdx <= endIdx; ++startIdx) {
        let listeners;
        let rm;
        const ch = vnodes[startIdx];
        if (ch != null) {
            if (isDef(ch.sel)) {
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
                api.removeChild(parentElm, ch.elm);
            }
        }
    }
}
export function updateChildren(parentElm, oldCh, newCh, globalContext, commitQueue) {
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
    let elmToMove;
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
            patchVnode(oldStartVnode, newStartVnode, globalContext, commitQueue);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, globalContext, commitQueue);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode, globalContext, commitQueue);
            api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, globalContext, commitQueue);
            api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (isUndef(idxInOld)) { // New element
                api.insertBefore(
                    parentElm,
                    createElm(newStartVnode, globalContext, commitQueue, {parentElm: parentElm, method: "insertBefore", referenceNode: oldStartVnode.elm}),
                    oldStartVnode.elm
                );
            }
            else {
                elmToMove = oldCh[idxInOld];
                if (elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(
                        parentElm,
                        createElm(newStartVnode, globalContext, commitQueue, {parentElm: parentElm, method: "insertBefore", referenceNode: oldStartVnode.elm}),
                        oldStartVnode.elm
                    );
                }
                else {
                    patchVnode(elmToMove, newStartVnode, globalContext, commitQueue);
                    oldCh[idxInOld] = undefined;
                    api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                }
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, globalContext, commitQueue);
        }
        else {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
}
function patchVnode(oldVnode, vnode, globalContext, commitQueue) {
    var _a, _b, _c, _d, _e;
    const hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
    (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode);
    const elm = vnode.elm = oldVnode.elm;
    const oldCh = oldVnode.children;
    const ch = vnode.children;
    if (oldVnode === vnode)
        return;
    if(typeof vnode.sel === "function"){
        return commitQueue.push(updateComponent(vnode, oldVnode, globalContext));
    }
    if (vnode.data !== undefined) {
        for (let i = 0; i < cbs.update.length; ++i)
            cbs.update[i](oldVnode, vnode);
        (_d = (_c = vnode.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch)
                updateChildren(elm, oldCh, ch, globalContext, commitQueue);
        }
        else if (isDef(ch)) {
            if (isDef(oldVnode.text))
                api.setTextContent(elm, '');
            addVnodes(elm, null, ch, 0, ch.length - 1, globalContext, commitQueue);
        }
        else if (isDef(oldCh)) {
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        }
        else if (isDef(oldVnode.text)) {
            api.setTextContent(elm, '');
        }
    }
    else if (oldVnode.text !== vnode.text) {
        if (isDef(oldCh)) {
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        }
        api.setTextContent(elm, vnode.text);
    }
    (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode);
}
function patch(oldVnode, vnode) {
    let i, elm, parent, before, newElm;
    const commitQueue = [];
    const globalContext = {};
    for (i = 0; i < cbs.pre.length; ++i)
        cbs.pre[i]();
    if (!isVnode(oldVnode)) {
        oldVnode = emptyNodeAt(oldVnode);
    }
    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, globalContext, commitQueue);
    }
    else {
        elm = oldVnode.elm;
        parent = api.parentNode(elm);
        before = api.nextSibling(elm);
        newElm = createElm(vnode, globalContext, commitQueue, {parentElm: parent, method: "insertBefore", referenceNode: before});
        if (parent !== null) {
            api.insertBefore(parent, newElm, before);
            removeVnodes(parent, [oldVnode], 0, 0);
        }
    }

    if(options._commit){
        options._commit(vnode, commitQueue);
    }

    for (i = 0; i < cbs.post.length; ++i)
        cbs.post[i]();

    return vnode;
}

const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
let cbs, api;

export function init(modules, domApi) {
    let i;
    let j;
    cbs = {
        create: [],
        update: [],
        remove: [],
        destroy: [],
        pre: [],
        post: []
    };
    api = domApi !== undefined ? domApi : htmlDomApi;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            const hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }

    return patch;
}