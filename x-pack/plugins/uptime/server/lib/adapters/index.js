"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _framework = require("./framework");

Object.keys(_framework).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _framework[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _framework[key];
    }
  });
});

var _telemetry = require("./telemetry");

Object.keys(_telemetry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _telemetry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _telemetry[key];
    }
  });
});