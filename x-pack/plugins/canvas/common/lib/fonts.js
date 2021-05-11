"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fonts = require("../../../../../src/plugins/expressions/common/fonts");

Object.keys(_fonts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _fonts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fonts[key];
    }
  });
});