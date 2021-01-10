import widget, {h} from "../libs/widget/index.js";

export default widget("ui.alert", {

    options: {
        type: "primary",
        content: "",
        dismissible: false,
        fade: false,
        //--
        dismiss: false
    },

    _create(){
        this._render(o => {
            if(o.dismiss){
                return h("!");
            }else{
                return h("div.alert[role=alert]", {
                    class: [
                        `alert-${o.type}`,
                        !!o.dismissible &&  "alert-dismissible",
                        !!o.fade && "fade",
                        !!o.fade && {
                            delayed: {show: true},
                            remove: {show: false}
                        }
                    ],
                    hook: {
                        remove(vnode, rm){
                            rm();
                        }
                    }
                }, [
                    o.content,
                    !!o.dismissible && h("button.close[type=button][aria-label=Close]", [
                        h("span[aria-hidden=true]", "×")
                    ])
                ]);
            }
        });

        this._on({
            "click .close": "_clickClose"
        });
    },

    _init(){

    },

    _clickClose(){
        this.option("dismiss", true);
    }

});