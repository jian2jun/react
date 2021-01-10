export {h} from "./h.js";
export {render} from "./render.js";
export {Fragment} from "./Fragment.js";
export {createContext} from "./Context.js";
export * from "./hooks.js";

/*
let i = 0;
export const createContext = (defaultValue, contextId) => {
    contextId = '__cC' + i++;
    const context = {
        _id: contextId,
        _defaultValue: defaultValue,
        Provider(props, subs, ctx) {
            if (!this.getChildContext) {
                subs = [];
                ctx = {};
                ctx[contextId] = this;

                this.getChildContext = () => ctx;
                this.sub = c => {
                    subs.push(c);
                };
            }
            return props.children;
        }
    };
    return context;
};

const refModule = {
    create(oldVnode, vnode){
        if(vnode.data.ref){
            vnode.data.ref.current = vnode.elm;
        }
    },
    update(oldVnode, vnode){
        if(vnode.data.ref){
            vnode.data.ref.current = vnode.elm;
        }
        if(oldVnode.data.ref){
            oldVnode.data.ref = null;
        }
    }
};
*/