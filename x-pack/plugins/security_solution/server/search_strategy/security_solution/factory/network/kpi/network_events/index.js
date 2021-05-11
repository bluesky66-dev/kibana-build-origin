"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkKpiNetworkEvents = void 0;

var _build_query = require("../../../../../../utils/build_query");

var _queryNetwork_kpi_network_events = require("./query.network_kpi_network_events.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkKpiNetworkEvents = {
  buildDsl: options => (0, _queryNetwork_kpi_network_events.buildNetworkEventsQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryNetwork_kpi_network_events.buildNetworkEventsQuery)(options))]
    };
    return { ...response,
      inspect,
      networkEvents: response.rawResponse.hits.total
    };
  }
};
exports.networkKpiNetworkEvents = networkKpiNetworkEvents;