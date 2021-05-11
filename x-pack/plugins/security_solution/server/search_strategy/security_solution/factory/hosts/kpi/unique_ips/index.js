"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostsKpiUniqueIps = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../../utils/build_query");

var _queryHosts_kpi_unique_ips = require("./query.hosts_kpi_unique_ips.dsl");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostsKpiUniqueIps = {
  buildDsl: options => (0, _queryHosts_kpi_unique_ips.buildHostsKpiUniqueIpsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryHosts_kpi_unique_ips.buildHostsKpiUniqueIpsQuery)(options))]
    };
    const uniqueSourceIpsHistogram = (0, _fp.getOr)(null, 'aggregations.unique_source_ips_histogram.buckets', response.rawResponse);
    const uniqueDestinationIpsHistogram = (0, _fp.getOr)(null, 'aggregations.unique_destination_ips_histogram.buckets', response.rawResponse);
    return { ...response,
      inspect,
      uniqueSourceIps: (0, _fp.getOr)(null, 'aggregations.unique_source_ips.value', response.rawResponse),
      uniqueSourceIpsHistogram: (0, _common.formatGeneralHistogramData)(uniqueSourceIpsHistogram),
      uniqueDestinationIps: (0, _fp.getOr)(null, 'aggregations.unique_destination_ips.value', response.rawResponse),
      uniqueDestinationIpsHistogram: (0, _common.formatGeneralHistogramData)(uniqueDestinationIpsHistogram)
    };
  }
};
exports.hostsKpiUniqueIps = hostsKpiUniqueIps;