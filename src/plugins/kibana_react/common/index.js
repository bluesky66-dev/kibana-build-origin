"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _eui_styled_components = require("./eui_styled_components");

Object.keys(_eui_styled_components).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _eui_styled_components[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _eui_styled_components[key];
    }
  });
});