'use strict';

define(function() {
  var routes = [];

  function process() {
    var fragment = window.location.hash.replace("#", "");
    var routesToActivate = [];
    var routesToDeactivate = [];

    for (var n = 0; n < routes.length; n++) {
      if ((fragment === "/" || fragment === "") && routes[n].route === "") {
        routesToActivate.push({ route: routes[n].route, zone: routes[n].zone, params: {} });
      } else {
        var matcher = fragment.match(new RegExp(routes[n].route.replace(/:[^\s/]+/g, "([\\w-]+)")));

        if (matcher) {
          var params = {};
          var args = matcher.slice(1);
          var names = routes[n].route.match(/:[^\s/]+/g);

          if (names) {
            for (var i = 0; i < names.length; i++) {
              params[names[i].substr(1)] = args[i];
            }
          }

          routesToActivate.push({ route: routes[n].route, zone: routes[n].zone, params: params });
        } else if (fragment !== routes[n].route) {
          routesToDeactivate.push({ route: routes[n].route, zone: routes[n].zone });
        }
      }
    }

    routesToDeactivate.sort(function(a, b) {
      return b.route.length - a.route.length;
    });

    routesToActivate.sort(function(a, b) {
      return a.route.length - b.route.length;
    });

    for (n = 0; n < routesToDeactivate.length; n++) {
      routesToDeactivate[n].zone.hide();
    }

    for (n = 0; n < routesToActivate.length; n++) {
      routesToActivate[n].zone.show(routesToActivate[n].params);
    }
  }

  window.onhashchange = function() {
    process();
  };

  return {
    register: function(route, zone) {
      routes.push({ route: route, zone: zone });
    },
    process: function() {
      process();
    }
  };
});
