"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _function_wrapper = require("./function_wrapper");

Object.keys(_function_wrapper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _function_wrapper[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _function_wrapper[key];
    }
  });
});

var _mock_agg_types_registry = require("./mock_agg_types_registry");

Object.keys(_mock_agg_types_registry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mock_agg_types_registry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mock_agg_types_registry[key];
    }
  });
});