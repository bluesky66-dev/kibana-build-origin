"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allHosts = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../../../common/constants");

var _build_query = require("../../../../../utils/build_query");

var _queryAll_hosts = require("./query.all_hosts.dsl");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const allHosts = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    return (0, _queryAll_hosts.buildHostsQuery)(options);
  },
  parse: async (options, response) => {
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const totalCount = (0, _fp.getOr)(0, 'aggregations.host_count.value', response.rawResponse);
    const buckets = (0, _fp.getOr)([], 'aggregations.host_data.buckets', response.rawResponse);
    const hostsEdges = buckets.map(bucket => (0, _helpers.formatHostEdgesData)(_helpers.HOSTS_FIELDS, bucket));
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const edges = hostsEdges.splice(cursorStart, querySize - cursorStart);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryAll_hosts.buildHostsQuery)(options))]
    };
    const showMorePagesIndicator = totalCount > fakeTotalCount;
    return { ...response,
      inspect,
      edges,
      totalCount,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        fakeTotalCount,
        showMorePagesIndicator
      }
    };
  }
};
exports.allHosts = allHosts;