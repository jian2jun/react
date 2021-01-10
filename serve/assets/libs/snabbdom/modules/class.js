var reflowForced = false;
function setNextFrame(elm, name, cur) {
    setTimeout(function () {
        elm.classList[cur ? 'add' : 'remove'](name);
    });
}

function updateClass(oldVnode, vnode) {
    var cur;
    var name;
    var elm = vnode.elm;
    var oldClass = oldVnode.data.class;
    var klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    var oldHasDel = 'delayed' in oldClass;
    for (name in oldClass) {
        if(name === 'delayed' && oldClass.delayed){
            for (const name2 in oldClass.delayed) {
                if (!klass.delayed || !Object.prototype.hasOwnProperty.call(klass.delayed, name2)) {
                    elm.classList.remove(name2);
                }
            }
        }
        else if (oldClass[name] &&
            !Object.prototype.hasOwnProperty.call(klass, name)) {
            // was `true` and now not provided
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (name === 'delayed' && klass.delayed) {
            for (const name2 in klass.delayed) {
                cur = klass.delayed[name2];
                if (!oldHasDel || cur !== oldClass.delayed[name2]) {
                    setNextFrame(elm, name2, cur);
                }
            }
        }
        else if (name !== 'remove' && cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
function applyDestroyClass(vnode) {
    var klass;
    var name;
    var elm = vnode.elm;
    var s = vnode.data.class;
    if (!s || !(klass = s.destroy))
        return;
    var cur;
    for (name in klass) {
        cur = klass[name];
        elm.classList[cur ? 'add' : 'remove'](name);
    }
}
function applyRemoveClass(vnode, rm) {
    var s = vnode.data.class;
    if (!s || !s.remove) {
        rm();
        return;
    }
    if (!reflowForced) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        vnode.elm.offsetLeft;
        reflowForced = true;
    }
    var name;
    var elm = vnode.elm;
    var compStyle;
    var klass = s.remove;
    var amount = 0;
    var cur;
    for (name in klass) {
        cur = klass[name];
        elm.classList[cur ? 'add' : 'remove'](name);
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    amount = props.length;

    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
function forceReflow() {
    reflowForced = false;
}
export const classModule = {
    pre: forceReflow,
    create: updateClass,
    update: updateClass,
    destroy: applyDestroyClass,
    remove: applyRemoveClass
};