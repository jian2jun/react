import $ from "../jquery/jquery.js";
import widget, {Widget} from "./widget.js";
import {init} from "../snabbdom/init.js";
import {classModule} from "../snabbdom/modules/class.js";
import {styleModule} from "../snabbdom/modules/style.js";
import {attributesModule} from "../snabbdom/modules/attributes.js";
import {h} from "./h.js";
import {toVNode} from "../snabbdom/tovnode.js";

const patch = init([
    attributesModule,
    classModule,
    styleModule
]);

const _setOptions = Widget.prototype._setOptions;

$.extend(Widget.prototype, {

    _render(render){
        if(render){
            this.__render = render;
        }
        if(this.__render){
            this.__oldVNode = this.__vNode || toVNode(this.element[0]);
            this.__vNode = this.__render(this.options);
            if(this.__vNode.sel !== "!"){
                this.__vNode.sel = this.__oldVNode.sel;
            }
            patch(this.__oldVNode, this.__vNode);
        }
    },

    _setOptions(options){
        _setOptions.call(this, options);
        this._render();
    }

});

export {h, $};
export default widget;