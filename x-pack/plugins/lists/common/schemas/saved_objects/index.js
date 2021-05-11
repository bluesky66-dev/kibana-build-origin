"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exceptions_list_so_schema = require("./exceptions_list_so_schema");

Object.keys(_exceptions_list_so_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _exceptions_list_so_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _exceptions_list_so_schema[key];
    }
  });
});