"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  NetworkKpiQueries: true
};
exports.NetworkKpiQueries = void 0;

var _dns = require("./dns");

Object.keys(_dns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _dns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dns[key];
    }
  });
});

var _network_events = require("./network_events");

Object.keys(_network_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _network_events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _network_events[key];
    }
  });
});

var _tls_handshakes = require("./tls_handshakes");

Object.keys(_tls_handshakes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _tls_handshakes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tls_handshakes[key];
    }
  });
});

var _unique_flows = require("./unique_flows");

Object.keys(_unique_flows).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _unique_flows[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _unique_flows[key];
    }
  });
});

var _unique_private_ips = require("./unique_private_ips");

Object.keys(_unique_private_ips).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _unique_private_ips[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _unique_private_ips[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let NetworkKpiQueries;
exports.NetworkKpiQueries = NetworkKpiQueries;

(function (NetworkKpiQueries) {
  NetworkKpiQueries["dns"] = "networkKpiDns";
  NetworkKpiQueries["networkEvents"] = "networkKpiNetworkEvents";
  NetworkKpiQueries["tlsHandshakes"] = "networkKpiTlsHandshakes";
  NetworkKpiQueries["uniqueFlows"] = "networkKpiUniqueFlows";
  NetworkKpiQueries["uniquePrivateIps"] = "networkKpiUniquePrivateIps";
})(NetworkKpiQueries || (exports.NetworkKpiQueries = NetworkKpiQueries = {}));