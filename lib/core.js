/* global define */

define([
  "lib/com",
  "lib/zone",
  "lib/router"
], function(com, zone, router) {
  "use strict";

  return {
    com    : com,
    zone   : zone,
    router : router,
    start  : function(path) {
      console.log("start", path);
    }
  };
});
