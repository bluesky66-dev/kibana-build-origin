"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  infraSourceConfigurationSavedObjectType: true
};
Object.defineProperty(exports, "infraSourceConfigurationSavedObjectType", {
  enumerable: true,
  get: function () {
    return _saved_object_type.infraSourceConfigurationSavedObjectType;
  }
});

var _defaults = require("./defaults");

Object.keys(_defaults).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _defaults[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _defaults[key];
    }
  });
});

var _saved_object_type = require("./saved_object_type");

var _sources = require("./sources");

Object.keys(_sources).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _sources[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sources[key];
    }
  });
});

var _source_api = require("../../../common/http_api/source_api");

Object.keys(_source_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _source_api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _source_api[key];
    }
  });
});