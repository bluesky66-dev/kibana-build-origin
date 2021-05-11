"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _duplicate_index_pattern = require("./duplicate_index_pattern");

Object.keys(_duplicate_index_pattern).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _duplicate_index_pattern[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _duplicate_index_pattern[key];
    }
  });
});