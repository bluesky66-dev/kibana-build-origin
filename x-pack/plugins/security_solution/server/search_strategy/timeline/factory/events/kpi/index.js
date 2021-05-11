"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineKpi = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _queryKpi = require("./query.kpi.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const timelineKpi = {
  buildDsl: options => (0, _queryKpi.buildTimelineKpiQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryKpi.buildTimelineKpiQuery)(options))]
    };
    return { ...response,
      destinationIpCount: (0, _fp.getOr)(0, 'aggregations.destinationIpCount.value', response.rawResponse),
      inspect,
      hostCount: (0, _fp.getOr)(0, 'aggregations.hostCount.value', response.rawResponse),
      processCount: (0, _fp.getOr)(0, 'aggregations.processCount.value', response.rawResponse),
      sourceIpCount: (0, _fp.getOr)(0, 'aggregations.sourceIpCount.value', response.rawResponse),
      userCount: (0, _fp.getOr)(0, 'aggregations.userCount.value', response.rawResponse)
    };
  }
};
exports.timelineKpi = timelineKpi;