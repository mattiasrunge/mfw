/* global define, require, document */

require.config({
  paths: {
    text        : "node_modules/text/text",
    jquery      : "node_modules/jquery/dist/jquery.min",
    tpl         : "node_modules/requirejs-tpl/lib/tpl",
    q           : "node_modules/q/q",
    
    bootstrap   : "modules/bootstrap/js/bootstrap.min",
    
    css         : "modules/css",

    knockout    : "lib/ko.extensions",
    core        : "lib/core"
  },
  shim: {
    "bootstrap": {
      deps: ["jquery"],
      exports: "jQuery"
    },
    "jquery-cookie": {
      deps: ["jquery"],
      exports: "jQuery"
    },
    "typeahead": {
      deps: ["jquery"],
      exports: "jQuery"
    },
  }
});

define([
  "core",
  "jquery",
  "main/Main"
], function(core, $, Main) {
  "use strict";

  core.com.on("SetTitle", function(title) {
    document.title = title;
  });

  $(function() {
    var main = new Main();
    
    main.init();
    
    core.router.process();
  });
});
