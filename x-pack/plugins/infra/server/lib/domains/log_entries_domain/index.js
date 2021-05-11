"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log_entries_domain = require("./log_entries_domain");

Object.keys(_log_entries_domain).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _log_entries_domain[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _log_entries_domain[key];
    }
  });
});