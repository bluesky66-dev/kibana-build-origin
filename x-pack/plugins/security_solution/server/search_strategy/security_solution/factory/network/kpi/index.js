"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkKpiFactory = void 0;

var _security_solution = require("../../../../../../common/search_strategy/security_solution");

var _dns = require("./dns");

var _network_events = require("./network_events");

var _tls_handshakes = require("./tls_handshakes");

var _unique_flows = require("./unique_flows");

var _unique_private_ips = require("./unique_private_ips");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkKpiFactory = {
  [_security_solution.NetworkKpiQueries.dns]: _dns.networkKpiDns,
  [_security_solution.NetworkKpiQueries.networkEvents]: _network_events.networkKpiNetworkEvents,
  [_security_solution.NetworkKpiQueries.tlsHandshakes]: _tls_handshakes.networkKpiTlsHandshakes,
  [_security_solution.NetworkKpiQueries.uniqueFlows]: _unique_flows.networkKpiUniqueFlows,
  [_security_solution.NetworkKpiQueries.uniquePrivateIps]: _unique_private_ips.networkKpiUniquePrivateIps
};
exports.networkKpiFactory = networkKpiFactory;