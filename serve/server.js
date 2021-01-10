import http from "http";
import os from "os";
import open from "open";

let port = 3000;
const protocol = "http";
const openBrowser = (url) => {
    open(url, {
        app: "chrome",
        url: true
    }).catch(() => {});
};

export default (app) => {

    // 创建服务
    const server = http.createServer(app.callback());

    // 端口占用，重启服务
    server.on("error", err => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is in use, trying another one...`);
            setTimeout(() => {
                server.close();
                server.listen(++port);
            }, 100);
        } else {
            console.error("Server error:");
            console.error(err);
        }
    });

    // 启动服务
    server.listen(port, () => {
        const interfaces = os.networkInterfaces();
        Object.keys(interfaces).forEach((key) => {
            (interfaces[key] || [])
                .filter(value => value.family === "IPv4")
                .map(value => {
                    return {
                        type: value.address.includes("127.0.0.1")
                            ? "Local:   "
                            : "Network: ",
                        host: value.address.replace("127.0.0.1", "localhost")
                    }
                })
                .forEach(({type, host}) => {
                    console.log(`  > ${type} ${protocol}://${host}:${port}/`);
                });
        });

        // openBrowser(`${protocol}://localhost:${port}`);
    });
};