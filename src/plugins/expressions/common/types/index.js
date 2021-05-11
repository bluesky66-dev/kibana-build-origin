"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  TypeToString: true,
  KnownTypeToString: true,
  TypeString: true,
  UnmappedTypeStrings: true,
  SerializedFieldFormat: true
};
Object.defineProperty(exports, "TypeToString", {
  enumerable: true,
  get: function () {
    return _common.TypeToString;
  }
});
Object.defineProperty(exports, "KnownTypeToString", {
  enumerable: true,
  get: function () {
    return _common.KnownTypeToString;
  }
});
Object.defineProperty(exports, "TypeString", {
  enumerable: true,
  get: function () {
    return _common.TypeString;
  }
});
Object.defineProperty(exports, "UnmappedTypeStrings", {
  enumerable: true,
  get: function () {
    return _common.UnmappedTypeStrings;
  }
});
Object.defineProperty(exports, "SerializedFieldFormat", {
  enumerable: true,
  get: function () {
    return _common.SerializedFieldFormat;
  }
});

var _common = require("./common");

var _style = require("./style");

Object.keys(_style).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _style[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _style[key];
    }
  });
});

var _registry = require("./registry");

Object.keys(_registry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _registry[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _registry[key];
    }
  });
});