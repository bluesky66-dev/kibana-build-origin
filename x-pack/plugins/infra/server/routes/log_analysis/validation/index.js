"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _datasets = require("./datasets");

Object.keys(_datasets).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _datasets[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _datasets[key];
    }
  });
});

var _indices = require("./indices");

Object.keys(_indices).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _indices[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _indices[key];
    }
  });
});