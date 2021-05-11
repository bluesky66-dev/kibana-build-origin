"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _esaggs = require("./esaggs");

Object.keys(_esaggs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _esaggs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _esaggs[key];
    }
  });
});