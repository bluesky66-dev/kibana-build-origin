"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkKpiUniquePrivateIps = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../../utils/build_query");

var _common = require("../common");

var _queryNetwork_kpi_unique_private_ips = require("./query.network_kpi_unique_private_ips.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkKpiUniquePrivateIps = {
  buildDsl: options => (0, _queryNetwork_kpi_unique_private_ips.buildUniquePrivateIpsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryNetwork_kpi_unique_private_ips.buildUniquePrivateIpsQuery)(options))]
    };
    const uniqueSourcePrivateIpsHistogram = (0, _fp.getOr)(null, 'aggregations.source.histogram.buckets', response.rawResponse);
    const uniqueDestinationPrivateIpsHistogram = (0, _fp.getOr)(null, 'aggregations.destination.histogram.buckets', response.rawResponse);
    return { ...response,
      inspect,
      uniqueSourcePrivateIps: (0, _fp.getOr)(null, 'aggregations.source.unique_private_ips.value', response.rawResponse),
      uniqueDestinationPrivateIps: (0, _fp.getOr)(null, 'aggregations.destination.unique_private_ips.value', response.rawResponse),
      uniqueSourcePrivateIpsHistogram: (0, _common.formatHistogramData)(uniqueSourcePrivateIpsHistogram),
      uniqueDestinationPrivateIpsHistogram: (0, _common.formatHistogramData)(uniqueDestinationPrivateIpsHistogram)
    };
  }
};
exports.networkKpiUniquePrivateIps = networkKpiUniquePrivateIps;