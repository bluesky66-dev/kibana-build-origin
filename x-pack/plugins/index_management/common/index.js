"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  API_BASE_PATH: true,
  BASE_PATH: true,
  getTemplateParameter: true
};
Object.defineProperty(exports, "API_BASE_PATH", {
  enumerable: true,
  get: function () {
    return _constants.API_BASE_PATH;
  }
});
Object.defineProperty(exports, "BASE_PATH", {
  enumerable: true,
  get: function () {
    return _constants.BASE_PATH;
  }
});
Object.defineProperty(exports, "getTemplateParameter", {
  enumerable: true,
  get: function () {
    return _lib.getTemplateParameter;
  }
});

var _constants = require("./constants");

var _lib = require("./lib");

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