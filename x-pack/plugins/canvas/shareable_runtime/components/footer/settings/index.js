"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = require("./settings");

Object.keys(_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _settings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _settings[key];
    }
  });
});