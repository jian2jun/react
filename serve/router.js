import Router from "koa-router";
import ast from "./methods/ast";

const router = new Router();

router.get("/", async ( ctx )=>{
    await ctx.render("index", {
        title: "hello world"
    });
});
router.get("/api/ast", ast);

export default router;