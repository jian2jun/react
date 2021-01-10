import {options} from "./hooks.js";
import {updateChildren, createNode} from "./init.js";
import {Fragment} from "./Fragment.js";

const defer =
    typeof Promise == "function"
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout;

function renderComponent(component){
    if (options._render){
        options._render(component._vnode);
    }

    component._renderOldVnode = component._renderVnode;
    let vnode = component.render(
        component.props,
        component.state,
        component.context
    );
    if(vnode.selector === Fragment){
        vnode = vnode.children;
    }

    component._renderVnode = Array.isArray(vnode) ? vnode : [vnode];
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

export function Component(props, context) {
    this.props = props;
    this.state = {};
    this.context = Object.assign(context, {component: this});
    this._renderCallbacks = [];
}

Component.prototype.render = Fragment;
Component.prototype.setState = function(state, callback) {
    if (typeof state == "function") {
        state = state(this.state, this.props);
    }
    this.state = Object.assign({}, this.state, state);
    if (this._renderVnode) {
        if (callback) {
            this._renderCallbacks.push(callback);
        }
        if(!this._dirty){
            this._dirty = true
            defer(() => {
                this._dirty = false;
                renderComponent(this);

                const queue = [];
                if(this._renderCallbacks.length){
                    queue.push(this);
                }

                updateChildren(this._parentNode, this._renderOldVnode, this._renderVnode, {context: this.context, queue});

                if(options.diffed){
                    options.diffed(this._vnode);
                }

                if(options._commit){
                    options._commit(this._vnode, queue);
                }
            });
        }
    }
};

export function createComponent(vnode, {context, queue, parentNode}, nodes){
    let component;
    const render = vnode.selector;
    const ctx = Object.assign({}, context);
    const props = {
        ...vnode.data,
        children: vnode.children
    };

    if ("prototype" in render && render.prototype.render) {
        vnode._component = component = new render(props, ctx);
    }
    else {
        vnode._component = component = new Component(props, ctx);
        component.render = function (props, state, context){
            return render(props, context);
        };
    }

    component._vnode = vnode;
    component._parentNode = parentNode;

    renderComponent(component);

    if(component.getChildContext){
        context = Object.assign({}, context, component.getChildContext());
    }

    if(component._renderCallbacks.length){
        queue.push(component);
    }

    component._renderVnode.forEach(vnode => {
        createNode(vnode, {queue, parentNode, context}, nodes);
    });

    if(options.diffed){
        options.diffed(vnode);
    }
}

export function updateComponent(oldVnode, vnode, {context, queue}){
    const component = vnode._component = oldVnode._component;

    component.props = {
        ...vnode.data,
        children: vnode.children
    };

    renderComponent(component);
    if(component._renderCallbacks.length){
        queue.push(component);
    }

    updateChildren(component._parentNode, component._renderOldVnode, component._renderVnode, {context, queue});

    if(options.diffed){
        options.diffed(vnode);
    }
}