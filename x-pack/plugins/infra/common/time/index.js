"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _time_unit = require("./time_unit");

Object.keys(_time_unit).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _time_unit[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _time_unit[key];
    }
  });
});

var _time_scale = require("./time_scale");

Object.keys(_time_scale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _time_scale[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _time_scale[key];
    }
  });
});

var _time_key = require("./time_key");

Object.keys(_time_key).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _time_key[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _time_key[key];
    }
  });
});

var _time_range = require("./time_range");

Object.keys(_time_range).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _time_range[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _time_range[key];
    }
  });
});