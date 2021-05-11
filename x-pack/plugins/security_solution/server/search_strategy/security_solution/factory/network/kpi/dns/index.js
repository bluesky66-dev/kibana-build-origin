"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkKpiDns = void 0;

var _build_query = require("../../../../../../utils/build_query");

var _queryNetwork_kpi_dns = require("./query.network_kpi_dns.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkKpiDns = {
  buildDsl: options => (0, _queryNetwork_kpi_dns.buildDnsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryNetwork_kpi_dns.buildDnsQuery)(options))]
    };
    return { ...response,
      inspect,
      dnsQueries: response.rawResponse.hits.total
    };
  }
};
exports.networkKpiDns = networkKpiDns;