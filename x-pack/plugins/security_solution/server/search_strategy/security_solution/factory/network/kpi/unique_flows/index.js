"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkKpiUniqueFlows = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../../utils/build_query");

var _queryNetwork_kpi_unique_flows = require("./query.network_kpi_unique_flows.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkKpiUniqueFlows = {
  buildDsl: options => (0, _queryNetwork_kpi_unique_flows.buildUniqueFlowsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryNetwork_kpi_unique_flows.buildUniqueFlowsQuery)(options))]
    };
    return { ...response,
      inspect,
      uniqueFlowId: (0, _fp.getOr)(null, 'aggregations.unique_flow_id.value', response.rawResponse)
    };
  }
};
exports.networkKpiUniqueFlows = networkKpiUniqueFlows;