"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _time_range = require("../../time/time_range");

Object.keys(_time_range).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _time_range[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _time_range[key];
    }
  });
});