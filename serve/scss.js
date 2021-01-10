import sass from "sass";
import path from "path";

export default (app) => {
    app.use(async (ctx, next) => {
        if (!ctx.path.endsWith(".scss")) {
            return next();
        }
        var result = sass.renderSync({
            file: path.join( __dirname,  `./assets${ctx.path}`),
            sourceMap: true
        })
        ctx.type = "text/css; charset=utf-8";
        ctx.body = result.css.toString();
    });
};