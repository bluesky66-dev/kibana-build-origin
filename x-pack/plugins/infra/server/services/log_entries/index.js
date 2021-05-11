"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log_entries_service = require("./log_entries_service");

Object.keys(_log_entries_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _log_entries_service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _log_entries_service[key];
    }
  });
});