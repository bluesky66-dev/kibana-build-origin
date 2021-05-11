"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require("./common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});

var _osquery = require("./osquery");

Object.keys(_osquery).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _osquery[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _osquery[key];
    }
  });
});