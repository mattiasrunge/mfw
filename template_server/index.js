"use strict";

const mfw = require("mfw");

mfw.init({
    name: "mfw",
    port: 3000,
    api: require("./lib/http-api"),
    routes: require("./lib/http-routes"),
    client: __dirname + "/client",
    uploadDirectory: "/tmp",
    bableCompileDirectory: "/tmp/bableCompile"
}).then(() => {
    return mfw.start();
});
