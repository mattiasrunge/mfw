'use strict';

require.config({
  baseUrl: "./node_modules/mfw",
  paths: {
    text        : "node_modules/text/text",
    tpl         : "node_modules/requirejs-tpl/lib/tpl",
    jquery      : "node_modules/jquery/dist/jquery.min",
    emitter     : "node_modules/tiny-emitter/dist/tinyemitter.min",
    knockout    : "node_modules/knockout/build/output/knockout-latest",

    ko          : "lib/ko.extensions",
    core        : "lib/core",
    root        : "../../"
  }
});

define([
  "core",
  "jquery",
  "root/main/Main"
], function(core, $, Main) {
  core.com.on("SetTitle", function(title) {
    document.title = title;
  });

  core.com.on("NavigateTo", function(path) {
    document.location.hash = "#" + path;
  });

  new Main().init();

  $(function() {
    core.router.process();
  });
});
