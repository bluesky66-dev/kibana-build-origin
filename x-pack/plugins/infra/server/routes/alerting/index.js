"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preview = require("./preview");

Object.keys(_preview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _preview[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _preview[key];
    }
  });
});