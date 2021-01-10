import {transform} from "@babel/core";
import fs from "fs-extra";
import path from "path";

export default (app) => {
    app.use(async (ctx, next) => {
        if (!ctx.path.endsWith(".jsx")) {
            return next();
        }
        let content = await fs.readFile(path.join( __dirname,  `./assets${ctx.path}`));
        if (typeof content !== "string") {
            content = content.toString()
        }
        const result = transform(content, {
            presets: [],
            plugins: [
                ["@babel/plugin-transform-react-jsx", {
                    pragma: "h",
                    pragmaFrag: "Fragment"
                }]
            ]
        });
        ctx.type = "js";
        ctx.body = result.code;
    });
};