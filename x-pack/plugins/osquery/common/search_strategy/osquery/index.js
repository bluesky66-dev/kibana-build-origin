"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  OsqueryQueries: true
};
exports.OsqueryQueries = void 0;

var _actions = require("./actions");

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _actions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _actions[key];
    }
  });
});

var _agents = require("./agents");

Object.keys(_agents).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _agents[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _agents[key];
    }
  });
});

var _results = require("./results");

Object.keys(_results).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _results[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _results[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let OsqueryQueries;
exports.OsqueryQueries = OsqueryQueries;

(function (OsqueryQueries) {
  OsqueryQueries["actions"] = "actions";
  OsqueryQueries["actionDetails"] = "actionDetails";
  OsqueryQueries["actionResults"] = "actionResults";
  OsqueryQueries["agents"] = "agents";
  OsqueryQueries["results"] = "results";
})(OsqueryQueries || (exports.OsqueryQueries = OsqueryQueries = {}));