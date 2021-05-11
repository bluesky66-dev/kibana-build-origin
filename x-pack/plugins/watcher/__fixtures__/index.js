"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watch = require("./watch");

Object.keys(_watch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _watch[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _watch[key];
    }
  });
});

var _watch_history = require("./watch_history");

Object.keys(_watch_history).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _watch_history[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _watch_history[key];
    }
  });
});

var _execute_details = require("./execute_details");

Object.keys(_execute_details).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _execute_details[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _execute_details[key];
    }
  });
});