function eventProxy(e) {
    this._listeners[e.type](e);
}

export const patchEvent = (node, key, oldValue, newValue) => {
    key = key.toLowerCase();
    key = key.slice(2);

    if (!node._listeners) node._listeners = {};
    node._listeners[key] = newValue;

    if (newValue) {
        if (!oldValue) node.addEventListener(key, eventProxy, false);
    }
    else {
        node.removeEventListener(key, eventProxy, false);
    }
};