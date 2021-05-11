"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _function_help = require("./function_help");

Object.keys(_function_help).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _function_help[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _function_help[key];
    }
  });
});

var _function_errors = require("./function_errors");

Object.keys(_function_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _function_errors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _function_errors[key];
    }
  });
});