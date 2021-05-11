"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chart_preview_data = require("./chart_preview_data");

Object.keys(_chart_preview_data).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _chart_preview_data[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _chart_preview_data[key];
    }
  });
});