"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  IndexPatternMissingIndices: true,
  getTitle: true,
  isDefault: true,
  validateIndexPattern: true
};
Object.defineProperty(exports, "IndexPatternMissingIndices", {
  enumerable: true,
  get: function () {
    return _errors.IndexPatternMissingIndices;
  }
});
Object.defineProperty(exports, "getTitle", {
  enumerable: true,
  get: function () {
    return _get_title.getTitle;
  }
});
Object.defineProperty(exports, "isDefault", {
  enumerable: true,
  get: function () {
    return _is_default.isDefault;
  }
});
Object.defineProperty(exports, "validateIndexPattern", {
  enumerable: true,
  get: function () {
    return _validate_index_pattern.validateIndexPattern;
  }
});

var _errors = require("./errors");

var _get_title = require("./get_title");

var _is_default = require("./is_default");

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

var _validate_index_pattern = require("./validate_index_pattern");