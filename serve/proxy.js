import proxy from "koa-proxies";

export default (app) => {
    app.use(proxy("/ajax", {
        target: "http://hk-uat.4px.com",
        logs: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ajax/, ""),
        events: {
            proxyReq(proxyReq, req, res){
                proxyReq.setHeader("cookie", "");
            }
        }
    }));
};