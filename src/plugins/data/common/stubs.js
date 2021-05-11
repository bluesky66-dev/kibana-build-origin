"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  stubIndexPattern: true,
  stubIndexPatternWithFields: true,
  stubFields: true
};
Object.defineProperty(exports, "stubIndexPattern", {
  enumerable: true,
  get: function () {
    return _index_pattern.stubIndexPattern;
  }
});
Object.defineProperty(exports, "stubIndexPatternWithFields", {
  enumerable: true,
  get: function () {
    return _index_pattern.stubIndexPatternWithFields;
  }
});
Object.defineProperty(exports, "stubFields", {
  enumerable: true,
  get: function () {
    return _field.stubFields;
  }
});

var _index_pattern = require("./index_patterns/index_pattern.stub");

var _field = require("./index_patterns/field.stub");

var _stubs = require("./es_query/filters/stubs");

Object.keys(_stubs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _stubs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _stubs[key];
    }
  });
});