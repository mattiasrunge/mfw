"use strict";

const http = require("http");
const co = require("bluebird").coroutine;
const socketio = require("socket.io");
const koa = require("koa.io");
const bodyParser = require("koa-bodyparser");
const route = require("koa-route");
const staticFile = require("koa-static");
const HttpError = require("./http-error");

let Server = function(options) {
    let app = koa();

    // Setup application
    app.name = options.name;
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
    app.use(staticFile(options.client));

    // Create routes if we have any
    if (options.routes) {
        for (let name of Object.keys(options.routes)) {
            app.use(route.get(name, options.routes[name]));
        }
    }

    // This must come after last app.use()
    let server = http.Server(app.callback());


    // Socket.io if we have defined API
    if (options.api) {
        let io = socketio(server);


        io.on("connection", function(socket) {
            for (let name of Object.keys(options.api)) {
                socket.on(name, function(data, ack) {
                    co(options.api[name])(data)
                    .then(function(result) {
                        ack(null, result);
                    })
                    .catch(function(error) {
                        ack(error.stack);
                    });
                });
            }
        });
    }

    this.start = function() {
        server.listen(options.port);
        return this;
    };
};

module.exports = function(options) {
    return new Server(options);
};
