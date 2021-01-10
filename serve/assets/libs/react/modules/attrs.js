const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58;
const xChar = 120;

export const patchAttr = (node, key, oldAttr, newAttr) => {
    if(newAttr === undefined){
        node.removeAttribute(key);
    }
    else{
        if (newAttr === true) {
            node.setAttribute(key, "");
        }
        else if (newAttr === false) {
            node.removeAttribute(key);
        }
        else {
            if (key.charCodeAt(0) !== xChar) {
                node.setAttribute(key, newAttr);
            }
            else if (key.charCodeAt(3) === colonChar) {
                node.setAttributeNS(xmlNS, key, newAttr);
            }
            else if (key.charCodeAt(5) === colonChar) {
                node.setAttributeNS(xlinkNS, key, newAttr);
            }
            else {
                node.setAttribute(key, newAttr);
            }
        }
    }
};