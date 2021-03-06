"use strict";

require.config({
    baseUrl: ".",
    paths: {
        text: "node_modules/requirejs-text/text",
        json: "node_modules/requirejs-json/json",
        jquery: "node_modules/jquery/dist/jquery.min",
        knockout: "node_modules/knockout/build/output/knockout-latest",
        bootstrap: "node_modules/bootstrap/dist/js/bootstrap.min",
        ripples: "node_modules/bootstrap-material-design/dist/js/ripples.min",
        material: "node_modules/bootstrap-material-design/dist/js/material.min",
        mprogress: "node_modules/mprogress/build/js/mprogress.min",
        moment: "node_modules/moment/min/moment.min",
        snackbar: "node_modules/snackbarjs/dist/snackbar.min",
        bluebird: "node_modules/bluebird/js/browser/bluebird.min",
        "socket.io-client": "/socket.io/socket.io",
        co: "mfw/co"
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        ripples: {
            deps: ["jquery"]
        },
        material: {
            deps: ["jquery"]
        },
        snackbar: {
            deps: ["jquery"]
        }
    }
});

define(["mfw"], (mfw) => {});
