import {options} from "./usehooks.js";
import {updateChildren, createElm} from "./init.js";
import { htmlDomApi } from "./htmldomapi.js";
import * as is from "./is.js";


const defer =
    typeof Promise == "function"
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout;

function renderComponent(c){
    let ret = c.render(c.props, c.state, c.context);
    if(ret.sel === Fragment){
        ret = ret.children;
    }
    c._oldVnodes = c._vnodes;
    c._vnodes = Array.isArray(ret) ? ret : [ret];
}

function flattenAndFilter(children, flattened) {
    for (const child of children) {
        if (Array.isArray(child)) {
            flattenAndFilter(child, flattened);
        }
        else {
            flattened.push(child);
        }
    }
    return flattened;
}

export function Fragment({children}){
    return children;
}

export function Component(props, context) {
    this.props = props;
    this.context = context;
    this.state = {};
    this._renderCallbacks = [];
}

Component.prototype.render = Fragment;
Component.prototype.setState = function(state, callback) {
    if (typeof state == "function") {
        state = state(this.state, this.props);
    }
    this.state = Object.assign({}, this.state, state);
    if (this._vnodes) {
        if (callback) {
            this._renderCallbacks.push(callback);
        }
        if(!this._dirty){
            this._dirty = true
            defer(() => {
                this._dirty = false;
                if (options._render){
                    options._render(this._parentVnode);
                }

                renderComponent(this);

                const commitQueue = [this];
                updateChildren(this._parentElm, this._oldVnodes, this._vnodes, this.context, commitQueue);

                if(options.diffed){
                    options.diffed(this._parentVnode);
                }

                if(options._commit){
                    options._commit(this._parentVnode, commitQueue);
                }
            });
        }
    }
};

export function createComponent(vnode, globalContext, commitQueue, config){
    let F = vnode.sel;
    let c;
    let props = {
        children: vnode.children,
        ...vnode.data.attrs,
        ...vnode.data.on,
        style: vnode.data.style,
        class: vnode.data.class
    }
    if ("prototype" in F && F.prototype.render) {
        vnode._component = c = new F(props, Object.assign({}, globalContext));
    } else {
        vnode._component = c = new Component(props, Object.assign({}, globalContext));
        c.constructor = F;
        c.render = (props, state, context) => {
            return c.constructor(props, context);
        };
    }

    c._parentVnode = vnode;
    c._parentElm = config.parentElm;

    if (options._render){
        options._render(vnode);
    }

    renderComponent(c);

    if(c.getChildContext){
        c.context = Object.assign(c.context, c.getChildContext());
    }
    if(c._renderCallbacks.length){
        commitQueue.push(c);
    }

    let elms = c._vnodes.map(item => {
        return createElm(item, c.context, commitQueue, config);
    });
    flattenAndFilter(elms, []).forEach(elm => {
        if (is.primitive(elm)) {
            htmlDomApi.appendChild(config.parentElm, htmlDomApi.createTextNode(elm));
        }else{
            htmlDomApi[config.method](config.parentElm, elm, config.referenceNode);
        }

    });

    if(options.diffed){
        options.diffed(vnode);
    }

    return c;
}

export function updateComponent(vnode, oldVnode, globalContext){
    const c = vnode._component = oldVnode._component;

    if (options._render){
        options._render(vnode);
    }

    renderComponent(c);

    updateChildren(c._parentElm, c._oldVnodes, c._vnodes, globalContext);

    if(options.diffed){
        options.diffed(vnode);
    }

    return c;
}