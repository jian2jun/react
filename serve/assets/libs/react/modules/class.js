export const patchClass = (node, oldClass, newClass) => {
    oldClass.forEach(item => {
        if(!newClass.includes(item)){
            node.classList.remove(item);
        }
    });
    newClass.forEach(item => {
        if(!oldClass.includes(item)){
            node.classList.add(item);
        }
    });
};