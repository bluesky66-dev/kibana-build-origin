"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkDns = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../../../common/constants");

var _build_query = require("../../../../../utils/build_query");

var _helpers = require("./helpers");

var _queryDns_network = require("./query.dns_network.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkDns = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    return (0, _queryDns_network.buildDnsQuery)(options);
  },
  parse: async (options, response) => {
    const {
      activePage,
      fakePossibleCount
    } = options.pagination;
    const totalCount = (0, _fp.getOr)(0, 'aggregations.dns_count.value', response.rawResponse);
    const edges = (0, _helpers.getDnsEdges)(response);
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryDns_network.buildDnsQuery)(options))]
    };
    const showMorePagesIndicator = totalCount > fakeTotalCount;
    return { ...response,
      edges,
      inspect,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        fakeTotalCount,
        showMorePagesIndicator
      },
      totalCount
    };
  }
};
exports.networkDns = networkDns;