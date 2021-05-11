"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dashboard_drilldown = require("./dashboard_drilldown");

Object.keys(_dashboard_drilldown).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _dashboard_drilldown[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dashboard_drilldown[key];
    }
  });
});