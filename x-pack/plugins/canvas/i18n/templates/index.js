"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apply_strings = require("./apply_strings");

Object.keys(_apply_strings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _apply_strings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _apply_strings[key];
    }
  });
});

var _template_strings = require("./template_strings");

Object.keys(_template_strings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _template_strings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _template_strings[key];
    }
  });
});