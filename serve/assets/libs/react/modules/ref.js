export const patchRef = (node, oldData, newData) => {
    if(newData.ref){
        newData.ref.current = node;
    }
    if(oldData.ref){
        oldData.ref = null;
    }
};