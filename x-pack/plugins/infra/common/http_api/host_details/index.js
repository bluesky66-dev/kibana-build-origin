"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _process_list = require("./process_list");

Object.keys(_process_list).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _process_list[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _process_list[key];
    }
  });
});