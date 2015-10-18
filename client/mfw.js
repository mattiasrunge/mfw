"use strict";

require.config({
    baseUrl: ".",
    paths: {
        text: "node_modules/requirejs-text/text",
        jquery: "node_modules/jquery/dist/jquery.min",
        knockout: "node_modules/knockout/build/output/knockout-latest",
        bootstrap: "node_modules/bootstrap/dist/js/bootstrap.min",
        ripples: "node_modules/bootstrap-material-design/dist/js/ripples.min",
        material: "node_modules/bootstrap-material-design/dist/js/material.min",
        mprogress: "node_modules/mprogress/build/js/mprogress.min",
        moment: "node_modules/moment/min/moment.min"
        /** PATHS **/
    },
    shim: {
        bootstrap: {
            deps: ["jquery"],
            exports: "jQuery"
        },
        ripples: {
            deps: ["jquery"],
            exports: "jQuery"
        },
        material: {
            deps: ["jquery"],
            exports: "jQuery"
        },
        /** SHIM **/
    }
});

var components = [ /** COMPONENTS **/ ];

require([
    "knockout",
    "mfw/utils",
    "mfw/bindings",
    "bootstrap",
    "ripples",
    "material"
], function(ko, utils) {
    utils.registerComponents(components);

    var Model = function() {};

    ko.applyBindings(new Model(), document.body);
});
