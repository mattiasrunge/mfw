define([
  "core",
  "text!./Main.html",
  "./node/Node"
], function(core, template, Node) {
  return core.zone({
    template: template,
    zones: {
      "#nodeContainer" : Node
    },
    onInit: function() {
      console.log("main:init");

      this.show();
    },
    onShow: function() {
      console.log("main:show");
    },
    onHide: function() {
      console.log("main:hide");
    }
  });
});
