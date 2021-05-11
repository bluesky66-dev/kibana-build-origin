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

var _element_strings = require("./element_strings");

Object.keys(_element_strings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _element_strings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _element_strings[key];
    }
  });
});