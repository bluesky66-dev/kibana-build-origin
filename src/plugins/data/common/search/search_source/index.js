"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createSearchSource: true,
  injectReferences: true,
  extractReferences: true,
  parseSearchSourceJSON: true
};
Object.defineProperty(exports, "createSearchSource", {
  enumerable: true,
  get: function () {
    return _create_search_source.createSearchSource;
  }
});
Object.defineProperty(exports, "injectReferences", {
  enumerable: true,
  get: function () {
    return _inject_references.injectReferences;
  }
});
Object.defineProperty(exports, "extractReferences", {
  enumerable: true,
  get: function () {
    return _extract_references.extractReferences;
  }
});
Object.defineProperty(exports, "parseSearchSourceJSON", {
  enumerable: true,
  get: function () {
    return _parse_json.parseSearchSourceJSON;
  }
});

var _create_search_source = require("./create_search_source");

var _inject_references = require("./inject_references");

var _extract_references = require("./extract_references");

var _parse_json = require("./parse_json");

var _fetch = require("./fetch");

Object.keys(_fetch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _fetch[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fetch[key];
    }
  });
});

var _legacy = require("./legacy");

Object.keys(_legacy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _legacy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _legacy[key];
    }
  });
});

var _search_source = require("./search_source");

Object.keys(_search_source).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _search_source[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _search_source[key];
    }
  });
});

var _search_source_service = require("./search_source_service");

Object.keys(_search_source_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _search_source_service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _search_source_service[key];
    }
  });
});

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