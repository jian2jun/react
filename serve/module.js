import {transform} from "@babel/core";
import fs from "fs-extra";
import path from "path";

export default (app) => {
    const modReg = /^\/@modules\//;

    app.use(async (ctx, next) => {
        if (!modReg.test(ctx.path)) {
            return next()
        }

        const p = ctx.path.replace(modReg, "node_modules/");
        ctx.type = 'js'

        let content = await fs.readFile(path.join( __dirname,  `../${p}/dist/jquery.js`));
        if (typeof content !== "string") {
            content = content.toString()
        }

        console.log(content)

        ctx.type = "js";
        ctx.body = content;

    });
};