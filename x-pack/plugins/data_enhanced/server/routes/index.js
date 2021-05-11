"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _session = require("./session");

Object.keys(_session).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _session[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _session[key];
    }
  });
});