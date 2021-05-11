"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  HostsQueries: true
};
exports.HostsQueries = void 0;

var _all = require("./all");

Object.keys(_all).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _all[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _all[key];
    }
  });
});

var _authentications = require("./authentications");

Object.keys(_authentications).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _authentications[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authentications[key];
    }
  });
});

var _common = require("./common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});

var _details = require("./details");

Object.keys(_details).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _details[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _details[key];
    }
  });
});

var _first_last_seen = require("./first_last_seen");

Object.keys(_first_last_seen).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _first_last_seen[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _first_last_seen[key];
    }
  });
});

var _kpi = require("./kpi");

Object.keys(_kpi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _kpi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _kpi[key];
    }
  });
});

var _overview = require("./overview");

Object.keys(_overview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _overview[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _overview[key];
    }
  });
});

var _uncommon_processes = require("./uncommon_processes");

Object.keys(_uncommon_processes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _uncommon_processes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _uncommon_processes[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let HostsQueries;
exports.HostsQueries = HostsQueries;

(function (HostsQueries) {
  HostsQueries["authentications"] = "authentications";
  HostsQueries["details"] = "details";
  HostsQueries["firstOrLastSeen"] = "firstOrLastSeen";
  HostsQueries["hosts"] = "hosts";
  HostsQueries["overview"] = "overviewHost";
  HostsQueries["uncommonProcesses"] = "uncommonProcesses";
})(HostsQueries || (exports.HostsQueries = HostsQueries = {}));