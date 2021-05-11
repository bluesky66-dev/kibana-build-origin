"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _esaggs_fn = require("./esaggs_fn");

Object.keys(_esaggs_fn).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _esaggs_fn[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _esaggs_fn[key];
    }
  });
});