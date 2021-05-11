"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securitySolutionTimelineEqlSearchStrategyProvider = void 0;

var _operators = require("rxjs/operators");

var _server = require("../../../../../../../src/plugins/data/server");

var _common = require("../../../../../data_enhanced/common");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const securitySolutionTimelineEqlSearchStrategyProvider = data => {
  const esEql = data.search.getSearchStrategy(_common.EQL_SEARCH_STRATEGY);
  return {
    search: (request, options, deps) => {
      const dsl = (0, _helpers.buildEqlDsl)(request);
      return esEql.search({ ...request,
        params: dsl
      }, options, deps).pipe((0, _operators.map)(response => {
        return { ...response,
          ...{
            rawResponse: (0, _server.shimHitsTotal)(response.rawResponse)
          }
        };
      }), (0, _operators.mergeMap)(async esSearchRes => (0, _helpers.parseEqlResponse)(request, esSearchRes)));
    },
    cancel: async (id, options, deps) => {
      if (esEql.cancel) {
        return esEql.cancel(id, options, deps);
      }
    }
  };
};

exports.securitySolutionTimelineEqlSearchStrategyProvider = securitySolutionTimelineEqlSearchStrategyProvider;