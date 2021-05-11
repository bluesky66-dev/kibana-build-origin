"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log_entry = require("./log_entry");

Object.keys(_log_entry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _log_entry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _log_entry[key];
    }
  });
});

var _log_entry_cursor = require("./log_entry_cursor");

Object.keys(_log_entry_cursor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _log_entry_cursor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _log_entry_cursor[key];
    }
  });
});