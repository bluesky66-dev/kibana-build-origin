"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ems_defaults = require("./ems_defaults");

Object.keys(_ems_defaults).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ems_defaults[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ems_defaults[key];
    }
  });
});