import widget, {h, $} from "../libs/widget/index.js";

export default widget("ui.carousel", {

    options: {
        items: [
            {
                src: "./imgs/01.jpg",
                content: [
                    h("h5", "First slide label"),
                    h("p", "Nulla vitae elit libero, a pharetra augue mollis interdum.")
                ]
            },
            {
                src: "./imgs/02.jpg",
                content: [
                    h("h5", "First slide label"),
                    h("p", "Nulla vitae elit libero, a pharetra augue mollis interdum.")
                ]
            },
            {
                src: "./imgs/03.jpg",
                content: [
                    h("h5", "First slide label"),
                    h("p", "Nulla vitae elit libero, a pharetra augue mollis interdum.")
                ]
            }
        ],
        hasControls: true,
        hasIndicators: true,
        delay: 6000,
        active: 0,
        sliding: false
    },

    _create(){
        this._render(o => {
            return h("div.carousel.slide", {id: o.id}, [
                !!o.hasIndicators && h("ol.carousel-indicators", o.items.map((item, index) => {
                    return h("li", {
                        class: o.active === index && !o.sliding && "active"
                    });
                })),
                h("div.carousel-inner", o.items.map((item, index) => {
                    return h("div.carousel-item", {
                        class: [
                            o.active === index && "active",
                            !!o.sliding && o.next[0] === index && `carousel-item-${o.next[1]}`,
                            !!o.sliding && (o.active === index || o.next[0] === index) && {
                                delayed: {
                                    [`carousel-item-${o.next[2]}`]: true
                                }
                            }
                        ]
                    }, [
                        h("img.d-block.w-100", {
                            src: item.src
                        }),
                        !!item.content && h("div.carousel-caption.d-none.d-md-block", item.content)
                    ]);
                })),
                !!o.hasControls && [
                    h("span.carousel-control-prev[role=button]", [
                        h("span.carousel-control-prev-icon[aria-hidden=true]"),
                        h("span.sr-only", "Previous")
                    ]),
                    h("span.carousel-control-next[role=button]", [
                        h("span.carousel-control-next-icon[aria-hidden=true]"),
                        h("span.sr-only", "Next")
                    ])
                ]
            ]);
        });

        this._on({
            "click .carousel-control-prev": "_clickPrev",
            "click .carousel-control-next": "_clickNext",
            "click .carousel-indicators > li": "_clickIndicator"
        });

        this._auto();
    },

    _auto(){
        const o = this.options;
        this.timeout = setTimeout(() => {
            this._next();
        }, o.delay);
    },

    _clickPrev(){
        if(this.options.sliding){
            return;
        }
        clearTimeout(this.timeout);
        this._prev();
    },

    _clickNext(){
        if(this.options.sliding){
            return;
        }
        clearTimeout(this.timeout);
        this._next();
    },

    _clickIndicator(e){
        const o = this.options;
        const index = $(e.currentTarget).index();
        if(o.sliding || o.active === index){
            return;
        }
        clearTimeout(this.timeout);
        this._goto(index);
    },

    _goto(index){
        const o = this.options;

        if(index > o.active){
            o.next = [index, "next", "left"];
        }
        else if(index < o.active){
            o.next = [index, "prev", "right"];
        }
        this.option("sliding", true);

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            o.active = index;
            this.option("sliding", false);
            this._auto();
        }, 650);
    },


    _prev(){
        const o = this.options;
        const leng = o.items.length;

        if(o.active === 0){
            o.next = [leng - 1, "prev", "right"];
        }else{
            o.next = [o.active - 1, "prev", "right"];
        }
        this.option("sliding", true);

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            o.active = o.active === 0 ? leng - 1 : o.active - 1;
            this.option("sliding", false);
            this._auto();
        }, 650);
    },

    _next(){
        const o = this.options;
        const leng = o.items.length;

        if(o.active === leng - 1){
            o.next = [0, "next", "left"];
        }else{
            o.next = [o.active + 1, "next", "left"];
        }
        this.option("sliding", true);

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            o.active = o.active < leng - 1 ? o.active + 1 : 0;
            this.option("sliding", false);
            this._auto();
        }, 650);
    }

});