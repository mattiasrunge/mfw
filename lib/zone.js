/* global define, console */

define([
  "jquery",
  "knockout",
  "./router"
], function($, ko, router) {
  "use strict";

  return function(obj) {
    return function(options) {
      options = options || {};

      var zones = [];

      this.route = false;
      this.zones = {};
      this.template = "<div></div>";
      this.parent = options.parent;
      this.onInit = function() {};
      this.onShow = function() {};
      this.onHide = function() {};

      this.getRoute = function() {
        if (this.route === false) {
          return false;
        }

        var parentRoute = this.parent.getRoute && this.parent.getRoute() !== false ? this.parent.getRoute() : "";
        return parentRoute + this.route;
      };

      this.getZones = function() {
        return zones;
      };

      this.init = function() {
        this.onInit();

        if (this.getRoute() !== false) {
          router.register(this.getRoute(), this);
        }

        for (var name in this.zones) {
          var zone = new this.zones[name]({
            parent    : this,
            container : name
          });

          zone.init();
          zones.push(zone);
        }
      };

      this.show = function(args) {
        var jsonArgs = JSON.stringify(args);

        if (this._isCreated()) {
          if (this._args !== jsonArgs) {
            this._args = jsonArgs;
            this.onShow(args);
          }

          return;
        }

        if (this._create()) {
          this._args = jsonArgs;
          this.onShow(args);
        }
      };

      this.hide = function() {
        if (!this._isCreated()) {
          return;
        }

        this.onHide();

        this._destroy();
      };

      this._isCreated = function() {
        return !!this.element;
      };

      this._create = function() {
        if (this._isCreated()) {
          return true;
        }

        var container = null;

        if (options.container) {
          if (!this.parent.element) {
            console.error("Parent zone is not created, can not create this zone", this);
            return false;
          }

          container = $(this.parent.element).find(options.container);
        } else {
          container = $("body").get(0);
        }

        if (!container) {
          console.error("Could not find the designated container in parent zone", this, options.container);
          return false;
        }

        var $element = $(this.template);

        if (!$element) {
          console.error("Could not create element from template", this);
          return false;
        }

        this.element = $element.get(0);

        ko.applyBindings(this, this.element);
        $element.appendTo(container);

        return true;
      };

      this._destroy = function() {
        if (!this._isCreated()) {
          return false;
        }

        var $element = $(this.element);

        $element.find("*").each(function() {
          $(this).off();
        });

        ko.removeNode(this.element);
        $element.remove();

        delete this.element;

        return true;
      };

      var keys = Object.keys(obj);

      for (var n = 0; n < keys.length; n++) {
        if (typeof obj[keys[n]] === "function") {
          this[keys[n]] = obj[keys[n]].bind(this);
        } else {
          this[keys[n]] = obj[keys[n]];
        }
      }
    };
  };
});
