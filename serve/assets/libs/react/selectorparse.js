const selectorReg = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
const selectorCache = {};

export const selectorParse = (selector) => {
    let match, tag = "div", classes = [], data = {};

    if(match = selectorCache[selector]){
        return match;
    }

    while (match = selectorReg.exec(selector)){
        let key = match[1], value = match[2];
        if (key === "" && value !== "") {
            tag = value;
        }
        else if (key === "#") data.id = value;
        else if (key === ".") classes.push(value);
        else if (match[3][0] === "[") {
            let attrValue = match[6];
            if (attrValue) {
                attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
            }
            if (match[4] === "class") {
                classes.push(attrValue);
            }
            else {
                data[match[4]] = attrValue === "" ? attrValue : attrValue || true;
            }
        }
    }

    if (classes.length > 0) {
        data.class = classes.join(" ");
    }

    return selectorCache[selector] = {tag, data};
};