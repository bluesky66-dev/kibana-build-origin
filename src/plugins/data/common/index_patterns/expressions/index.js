"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _load_index_pattern = require("./load_index_pattern");

Object.keys(_load_index_pattern).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _load_index_pattern[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _load_index_pattern[key];
    }
  });
});