"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _results = require("./results");

Object.keys(_results).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _results[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _results[key];
    }
  });
});