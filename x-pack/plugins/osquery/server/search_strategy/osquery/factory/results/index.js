"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allResults = void 0;

var _constants = require("../../../../../common/constants");

var _build_query = require("../../../../../common/utils/build_query");

var _queryAll_results = require("./query.all_results.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const allResults = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    return (0, _queryAll_results.buildResultsQuery)(options);
  },
  parse: async (options, response) => {
    const {
      activePage
    } = options.pagination;
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryAll_results.buildResultsQuery)(options))]
    };
    return { ...response,
      inspect,
      edges: response.rawResponse.hits.hits,
      totalCount: response.rawResponse.hits.total,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        fakeTotalCount: 0,
        showMorePagesIndicator: false
      }
    };
  }
};
exports.allResults = allResults;