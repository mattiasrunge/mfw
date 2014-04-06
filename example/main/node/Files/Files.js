define([
  "core",
  "text!./Files.html"
], function(core, template) {
  return core.zone({
    template: template,
    route: "/files",
    onInit: function() {
      console.log("files:init");
    },
    onShow: function(args) {
      console.log("files:show", args);
      core.com.emit("SetTitle", "Files");
    },
    onHide: function() {
      console.log("files:hide");
      core.com.emit("SetTitle", "???");
    }
  });
});
