import {h} from "./h.js";
import {Fragment} from "./Fragment.js";

let i = 0;
export const createContext = (defaultValue, contextId) => {
    contextId = `__cC${i++}`;
    return {
        _id: contextId,
        _defaultValue: defaultValue,
        Provider({value, children}, {component}){
            if (!component.getChildContext) {
                const subs = [];
                const ctx = {
                    [contextId]: component
                };

                component.getChildContext = () => ctx;
                component.sub = c => {
                    subs.push(c);
                };
            }
            return h(Fragment, children);
        }
    };
}