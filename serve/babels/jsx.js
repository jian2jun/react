export default ({ types: t }) => {
    return {
        visitor: {
            JSXElement(path, state){
                path.replaceWith(
                    t.callExpression(t.identifier("h"), [t.stringLiteral("a"), t.stringLiteral("b")])
                );
            }
        }
    };
};