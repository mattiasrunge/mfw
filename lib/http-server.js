"use strict";

const path = require("path");
const fs = require("fs-extra-promise");
const http = require("http");
const co = require("bluebird").coroutine;
const promisify = require("bluebird").promisify;
const promisifyAll = require("bluebird").promisifyAll;
const socketio = require("socket.io");
const koa = require("koa.io");
const bodyParser = require("koa-bodyparser");
const route = require("koa-route");
const staticFile = require("koa-static");
const parse = require("co-busboy");
const enableDestroy = require("server-destroy");
const HttpError = require("./http-error");
const CleanCSS = require("clean-css");
const uuid = require("node-uuid");
const moment = require("moment");
const babel = promisifyAll(require("babel-core"));

let server;
let params = {};

module.exports = {
    init: co(function*(config) {
        let css;
        let cssTime;
        let app = koa();
        let uploadIds = {};

        params = config;

        // Setup application
        app.name = params.name;
        app.use(bodyParser());

        // Configure error handling
        app.use(function*(next) {
            try {
                yield next;
            } catch (error) {
                console.error(error);
                console.error(error.stack);
                this.response.status = error.status || 500;
                this.type = "text/plain";
                this.body = error.message || error;
            }
        });

        // Serve static assets
        if (params.client) {
            app.use(route.get("/style.css", function*() {
                let stat = yield fs.statAsync(params.client + "/style.css");

                if (stat.mtime.toString() !== cssTime) {
                    cssTime = stat.mtime.toString();

                    let source1 = yield fs.readFileAsync(__dirname + "/../client/style.css");
                    let css1 = new CleanCSS({ root: __dirname + "/../client" }).minify(source1).styles;

                    let source2 = yield fs.readFileAsync(params.client + "/style.css");
                    let css2 = new CleanCSS({ root: params.client }).minify(source2).styles;

                    css = css1 + " " + css2;
                }

                this.type = "text/css";
                this.body = css;
            }));

            app.use(route.get("/components.json", function*() {
                let components = [];
                let componentPath = path.join(params.client, "components");
                let items = yield fs.readdirAsync(componentPath);

                for (let item of items) {
                    if (yield fs.isDirectoryAsync(path.join(componentPath, item))) {
                        components.push(item);
                    }
                }

                this.type = "application/json";
                this.body = JSON.stringify(components);
            }));

            if (params.bableCompileDirectory) {
                yield fs.removeAsync(params.bableCompileDirectory);

                app.use(function*(next) {
                    let ext = path.extname(this.originalUrl);
                    if (ext === ".js" && this.originalUrl.indexOf("node_modules") === -1 && this.originalUrl.indexOf("config.js") === -1) {
                        let filename = false;

                        if (!(yield fs.existsAsync(path.join(params.bableCompileDirectory, this.originalUrl)))) {
                            filename = path.join(params.client, this.originalUrl);

                            if (!(yield fs.existsAsync(filename))) {
                                filename = path.join(__dirname, "..", "client", this.originalUrl);

                                if (!(yield fs.existsAsync(filename))) {
                                    filename = false;
                                }
                            }
                        }

                        if (filename) {
                            let result = yield babel.transformFileAsync(filename, {
                                plugins: [
                                    "transform-es2015-modules-amd"
                                ]/*,
                                sourceMaps: "both",
                                sourceMapTarget: this.originalUrl + ".map"*/
                            });

                            yield fs.outputFileAsync(path.join(params.bableCompileDirectory, this.originalUrl), result.code);

                            //yield fs.outputFileAsync(path.join(params.bableCompileDirectory, this.originalUrl + ".map"), JSON.stringify(result.map));
                        }
                    }

                    yield next;
                });

                app.use(staticFile(params.bableCompileDirectory));
            }

            app.use(staticFile(params.client));
            app.use(staticFile(path.join(__dirname, "..", "client")));
        }

        // If we have an upload directory create the upload route
        if (params.uploadDirectory) {
        app.use(route.post("/upload/:id", function*(id) {
                if (!uploadIds[id]) {
                    throw new Error("Invalid upload id");
                }

                delete uploadIds[id];

                let part;
                while (part = yield parse(this)) {
                    let stream = fs.createWriteStream(path.join(params.uploadDirectory, id));
                    part.pipe(stream);
                }

                this.type = "json";
                this.body = JSON.stringify({ status: "success" }, null, 2);
            }));
        }

        // Create routes if we have any
        if (params.routes) {
            for (let name of Object.keys(params.routes)) {
                let method = "get";
                let routeName = name;

                if (name[0] !== "/") {
                    let parts = name.match(/(.+?)(\/.*)/);
                    method = parts[1];
                    routeName = parts[2];
                }

                app.use(route[method](routeName, params.routes[name]));
            }
        }

        // This must come after last app.use()
        server = http.Server(app.callback());

        enableDestroy(server);

        // Socket.io if we have defined API
        if (params.api) {
            let io = socketio(server);

            io.on("connection", (socket) => {
                socket.session = socket.session || {};

                socket.session.uploads = socket.session.uploads || {};

                socket.session.allocateUploadId = () => {
                    let id = uuid.v4();
                    uploadIds[id] = moment();
                    socket.session.uploads[id] = path.join(params.uploadDirectory, id);
                    return id;
                };

                for (let name of Object.keys(params.api)) {
                    socket.on(name, function(data, ack) {
                        co(params.api[name])(socket.session, data)
                        .then(function(result) {
                            ack(null, result);
                        })
                        .catch(function(error) {
                            ack(error.stack);
                        });
                    });
                }
            });

            params.api.emit = (event, data) => {
                io.emit(event, data);
            };
        }
    }),
    start: co(function*() {
        server.listen(params.port);
    }),
    stop: co(function*() {
        if (server) {
            yield promisify(server.destroy, { context: server })();
        }
    })
};
