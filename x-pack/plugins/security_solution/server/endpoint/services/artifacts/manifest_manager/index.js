"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _manifest_manager = require("./manifest_manager");

Object.keys(_manifest_manager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _manifest_manager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _manifest_manager[key];
    }
  });
});