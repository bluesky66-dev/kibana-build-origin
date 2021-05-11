"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkFactory = void 0;

var _security_solution = require("../../../../../common/search_strategy/security_solution");

var _dns = require("./kpi/dns");

var _network_events = require("./kpi/network_events");

var _tls_handshakes = require("./kpi/tls_handshakes");

var _unique_flows = require("./kpi/unique_flows");

var _unique_private_ips = require("./kpi/unique_private_ips");

var _details = require("./details");

var _dns2 = require("./dns");

var _http = require("./http");

var _overview = require("./overview");

var _tls = require("./tls");

var _top_countries = require("./top_countries");

var _top_n_flow = require("./top_n_flow");

var _users = require("./users");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkFactory = {
  [_security_solution.NetworkQueries.details]: _details.networkDetails,
  [_security_solution.NetworkQueries.dns]: _dns2.networkDns,
  [_security_solution.NetworkQueries.http]: _http.networkHttp,
  [_security_solution.NetworkQueries.overview]: _overview.networkOverview,
  [_security_solution.NetworkQueries.tls]: _tls.networkTls,
  [_security_solution.NetworkQueries.topCountries]: _top_countries.networkTopCountries,
  [_security_solution.NetworkQueries.topNFlow]: _top_n_flow.networkTopNFlow,
  [_security_solution.NetworkQueries.users]: _users.networkUsers,
  [_security_solution.NetworkKpiQueries.dns]: _dns.networkKpiDns,
  [_security_solution.NetworkKpiQueries.networkEvents]: _network_events.networkKpiNetworkEvents,
  [_security_solution.NetworkKpiQueries.tlsHandshakes]: _tls_handshakes.networkKpiTlsHandshakes,
  [_security_solution.NetworkKpiQueries.uniqueFlows]: _unique_flows.networkKpiUniqueFlows,
  [_security_solution.NetworkKpiQueries.uniquePrivateIps]: _unique_private_ips.networkKpiUniquePrivateIps
};
exports.networkFactory = networkFactory;