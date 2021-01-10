import render from "koa-art-template";
import path from "path";

export default (app) => {
    render(app, {
        root: path.join(__dirname, "./views"),
        extname: ".html",
        debug: process.env.NODE_ENV !== "production"
    });
};