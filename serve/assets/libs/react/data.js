import {patchClass} from "./modules/class.js";
import {patchStyle} from "./modules/style.js";
import {patchRef} from "./modules/ref.js";
import {patchEvent} from "./modules/events.js";
import {patchAttr} from "./modules/attrs.js";

const filterKeys = ["key", "ref", "class", "style"];

export const patchData = (oldVnode, vnode) => {
    const node = vnode.node;
    const oldData = oldVnode.data;
    const data = vnode.data;

    patchClass(node, oldData.class || [], data.class || []);
    patchStyle(node, oldData.style || {}, data.style || {});
    patchRef(node, oldData, data);

    for(let key in oldData){
        if (!filterKeys.includes(key) && !(key in data)) {
            if(key[0] === "o" && key[1] === "n") {
                patchEvent(node, key, oldData[key], undefined);
            }
            else{
                patchAttr(node, key, oldData[key], undefined);
            }
        }
    }
    for(let key in data){
        if (!filterKeys.includes(key) && oldData[key] !== data[key]) {
            if(key[0] === "o" && key[1] === "n") {
                patchEvent(node, key, oldData[key], data[key]);
            }
            else{
                patchAttr(node, key, oldData[key], data[key]);
            }
        }
    }
};