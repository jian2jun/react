import { vnode } from "./vnode.js";
import { htmlDomApi } from "./htmldomapi.js";

export function toVNode(node) {
    const api = htmlDomApi;
    let text;
    if (api.isElement(node)) {
        const id = node.id ? "#" + node.id : "";
        const cn = node.getAttribute("class");
        const c = cn ? "." + cn.split(" ").join(".") : "";
        const selector = api.tagName(node).toLowerCase() + id + c;
        const data = {};
        const children = [];
        let name;
        let i, n;
        const nodeAttrs = node.attributes;
        const nodeChildren = node.childNodes;
        for (i = 0, n = nodeAttrs.length; i < n; i++) {
            name = nodeAttrs[i].nodeName;
            if (name !== "id" && name !== "class") {
                data[name] = nodeAttrs[i].nodeValue;
            }
        }
        for (i = 0, n = nodeChildren.length; i < n; i++) {
            children.push(toVNode(nodeChildren[i]));
        }
        return vnode(selector, data, children, undefined, node);
    }
    else if (api.isText(node)) {
        text = api.getTextContent(node);
        return vnode("", {}, undefined, text, node);
    }
    else if (api.isComment(node)) {
        text = api.getTextContent(node);
        return vnode("!", {}, undefined, text, node);
    }
    else {
        return vnode("", {}, undefined, undefined, node);
    }
}