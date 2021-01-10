import assets from "koa-static";
import path from "path";

export default (app) => {
    app.use(assets(
        path.join( __dirname,  "./assets")
        // path.join( __dirname,  "../build/static")
    ));
};