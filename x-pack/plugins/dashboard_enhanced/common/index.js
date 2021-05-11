"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drilldowns = require("./drilldowns");

Object.keys(_drilldowns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _drilldowns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _drilldowns[key];
    }
  });
});