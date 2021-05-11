"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entries = require("./entries");

Object.keys(_entries).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _entries[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _entries[key];
    }
  });
});