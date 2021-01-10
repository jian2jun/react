import Koa from "koa";
import assets from "./assets";
import views from "./views";
import module from "./module"
import scss from "./scss";
import jsx from "./jsx";
import proxy from "./proxy";
import router from "./router";
import server from "./server";

const app = new Koa();

// module
module(app);

// scss
scss(app);

// jsx
jsx(app);

// 静态资源
assets(app);

// 视图
views(app);

// 跨域代理
proxy(app);

// 路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
server(app);