import {jsx} from "./jsx.js";
import {Fragment} from "./component.js";

const getGlobal = function () {
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
};

const G = getGlobal();

G.jsx = jsx;
G.Fragment = Fragment;