"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostsKpiHosts = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../../utils/build_query");

var _queryHosts_kpi_hosts = require("./query.hosts_kpi_hosts.dsl");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostsKpiHosts = {
  buildDsl: options => (0, _queryHosts_kpi_hosts.buildHostsKpiHostsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryHosts_kpi_hosts.buildHostsKpiHostsQuery)(options))]
    };
    const hostsHistogram = (0, _fp.getOr)(null, 'aggregations.hosts_histogram.buckets', response.rawResponse);
    return { ...response,
      inspect,
      hosts: (0, _fp.getOr)(null, 'aggregations.hosts.value', response.rawResponse),
      hostsHistogram: (0, _common.formatGeneralHistogramData)(hostsHistogram)
    };
  }
};
exports.hostsKpiHosts = hostsKpiHosts;