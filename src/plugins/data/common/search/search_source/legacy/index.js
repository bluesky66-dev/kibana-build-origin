"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  fetchSoon: true
};
Object.defineProperty(exports, "fetchSoon", {
  enumerable: true,
  get: function () {
    return _fetch_soon.fetchSoon;
  }
});

var _fetch_soon = require("./fetch_soon");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});