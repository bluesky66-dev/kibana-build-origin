"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schemas = require("./schemas");

Object.keys(_schemas).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _schemas[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _schemas[key];
    }
  });
});