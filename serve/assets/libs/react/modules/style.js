export const patchStyle = (node, oldStyle, newStyle) => {
    for(let key in oldStyle){
        if(!newStyle[key]){
            if (key[0] === "-" && name[1] === "-") {
                node.style.removeProperty(key);
            }
            else {
                node.style[key] = "";
            }
        }
    }
    for(let key in newStyle){
        let value = newStyle[key];
        if(oldStyle[key] !== value){
            if (key[0] === "-" && name[1] === "-") {
                node.style.setProperty(key, value);
            }
            else {
                node.style[key] = value;
            }
        }
    }
};