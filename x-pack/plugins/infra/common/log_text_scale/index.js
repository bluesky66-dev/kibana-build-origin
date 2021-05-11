"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log_text_scale = require("./log_text_scale");

Object.keys(_log_text_scale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _log_text_scale[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _log_text_scale[key];
    }
  });
});