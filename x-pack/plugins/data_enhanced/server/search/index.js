"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  enhancedEsSearchStrategyProvider: true,
  eqlSearchStrategyProvider: true
};
Object.defineProperty(exports, "enhancedEsSearchStrategyProvider", {
  enumerable: true,
  get: function () {
    return _es_search_strategy.enhancedEsSearchStrategyProvider;
  }
});
Object.defineProperty(exports, "eqlSearchStrategyProvider", {
  enumerable: true,
  get: function () {
    return _eql_search_strategy.eqlSearchStrategyProvider;
  }
});

var _es_search_strategy = require("./es_search_strategy");

var _eql_search_strategy = require("./eql_search_strategy");

var _session = require("./session");

Object.keys(_session).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _session[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _session[key];
    }
  });
});