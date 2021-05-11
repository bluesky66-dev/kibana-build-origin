"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shared_exports = require("./shared_exports");

Object.keys(_shared_exports).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _shared_exports[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _shared_exports[key];
    }
  });
});