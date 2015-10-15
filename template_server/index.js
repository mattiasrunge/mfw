"use strict";

const mfw = require("mfw");

mfw({
    name: "mfw",
    port: 3000,
    api: require("./lib/http-api"),
    routes: require("./lib/http-routes"),
    client: __dirname + "/client"
}).start();
