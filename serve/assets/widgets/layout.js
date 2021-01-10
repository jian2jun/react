import widget, {h} from "../libs/widget/index.js";
import "./carousel.js";
import "./alert.js";

export default (props, context) => {



    return h("div#layout.layout.aaa[role=layout]", [
        h("div.carousel"),
        h("div.alert"),
        h("div.header", o.text),
        h("div.body", o.text)
    ]);
};



/*export default widget("ui.layout", {

    options: {
        text: "hello world"
    },

    _create(){
        this._render(o => {
            return h("div#layout.layout.aaa[role=layout]",
                h("div.carousel"),
                h("div.alert"),
                h("div.header", o.text),
                h("div.body", o.text)
            );
        });
    },

    _init(){
        this._carousel();
        this._alert();
    },

    _carousel(){
        this.element.find(".carousel").carousel();
    },

    _alert(){
        this.element.find(".alert").alert({
            type: "success",
            dismissible: true,
            fade: true,
            content: [
                "A simple success alert with ",
                h("a.alert-link[href=#]", "an example link"),
                ". Give it a click if you like."
            ]
        });
    }
});*/
