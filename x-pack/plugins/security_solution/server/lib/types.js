"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Configuration: true
};
Object.defineProperty(exports, "Configuration", {
  enumerable: true,
  get: function () {
    return _config.ConfigType;
  }
});

var _config = require("../config");

var _hosts = require("./hosts");

Object.keys(_hosts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _hosts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hosts[key];
    }
  });
});