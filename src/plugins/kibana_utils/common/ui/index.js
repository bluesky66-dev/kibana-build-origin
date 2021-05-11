"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ui_component = require("./ui_component");

Object.keys(_ui_component).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ui_component[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ui_component[key];
    }
  });
});