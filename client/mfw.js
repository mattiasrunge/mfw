"use strict";

const libs = require("json!libs.json");
const shim = require("json!shim.json");
const components = require("json!components.json");
const ko = require("knockout");
const utils = require("mfw/utils");

require("mfw/bindings");
require("bootstrap");
require("ripples");
require("material");

require.config({
    paths: libs,
    shim: shim
});

utils.registerComponents(components);

let Model = function() {};

ko.applyBindings(new Model(), document.body);
