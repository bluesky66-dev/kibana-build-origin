"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _histogram = require("./histogram");

Object.keys(_histogram).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _histogram[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _histogram[key];
    }
  });
});

var _ping = require("./ping");

Object.keys(_ping).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ping[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ping[key];
    }
  });
});