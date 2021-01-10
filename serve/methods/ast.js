import * as babel from "@babel/core";
import path from "path";
import jsx from "../babels/jsx";

export default async (ctx) => {
    return new Promise((resolve, reject) => {
        babel.transformFile(path.join( __dirname,  "../assets/widgets/test.js"), {
           /* presets: [
                "@babel/preset-react"
            ],*/
            plugins: [
                ["@babel/plugin-transform-react-jsx", {
                    pragma: "h",
                    pragmaFrag: "fragment"
                }]
            ]
        }, function(err, result) {
            ctx.body = result.code;
            resolve();
        });
    });
};