"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostsFactory = void 0;

var _security_solution = require("../../../../../common/search_strategy/security_solution");

var _all = require("./all");

var _details = require("./details");

var _overview = require("./overview");

var _last_first_seen = require("./last_first_seen");

var _uncommon_processes = require("./uncommon_processes");

var _authentications = require("./authentications");

var _authentications2 = require("./kpi/authentications");

var _hosts = require("./kpi/hosts");

var _unique_ips = require("./kpi/unique_ips");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostsFactory = {
  [_security_solution.HostsQueries.details]: _details.hostDetails,
  [_security_solution.HostsQueries.hosts]: _all.allHosts,
  [_security_solution.HostsQueries.overview]: _overview.hostOverview,
  [_security_solution.HostsQueries.firstOrLastSeen]: _last_first_seen.firstOrLastSeenHost,
  [_security_solution.HostsQueries.uncommonProcesses]: _uncommon_processes.uncommonProcesses,
  [_security_solution.HostsQueries.authentications]: _authentications.authentications,
  [_security_solution.HostsKpiQueries.kpiAuthentications]: _authentications2.hostsKpiAuthentications,
  [_security_solution.HostsKpiQueries.kpiHosts]: _hosts.hostsKpiHosts,
  [_security_solution.HostsKpiQueries.kpiUniqueIps]: _unique_ips.hostsKpiUniqueIps
};
exports.hostsFactory = hostsFactory;