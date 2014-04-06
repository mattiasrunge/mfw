define([
  "core",
  "text!./Node.html",
  "./Files/Files"
], function(core, template, Files) {
  return core.zone({
    template: template,
    route: "/node/:id",
    zones: {
      "#filesContiner" : Files
    },
    onInit: function() {
      console.log("node:init");
    },
    onShow: function(args) {
      console.log("node:show", args);
    },
    onHide: function() {
      console.log("node:hide");
    }
  });
});
