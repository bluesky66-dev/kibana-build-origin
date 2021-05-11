"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  HostsKpiQueries: true
};
exports.HostsKpiQueries = void 0;

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

var _unique_ips = require("./unique_ips");

Object.keys(_unique_ips).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _unique_ips[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _unique_ips[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let HostsKpiQueries;
exports.HostsKpiQueries = HostsKpiQueries;

(function (HostsKpiQueries) {
  HostsKpiQueries["kpiAuthentications"] = "hostsKpiAuthentications";
  HostsKpiQueries["kpiHosts"] = "hostsKpiHosts";
  HostsKpiQueries["kpiUniqueIps"] = "hostsKpiUniqueIps";
})(HostsKpiQueries || (exports.HostsKpiQueries = HostsKpiQueries = {}));