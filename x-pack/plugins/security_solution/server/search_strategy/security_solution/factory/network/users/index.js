"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkUsers = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../../../common/constants");

var _build_query = require("../../../../../utils/build_query");

var _helpers = require("./helpers");

var _queryUsers_network = require("./query.users_network.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkUsers = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    return (0, _queryUsers_network.buildUsersQuery)(options);
  },
  parse: async (options, response) => {
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const totalCount = (0, _fp.getOr)(0, 'aggregations.user_count.value', response.rawResponse);
    const usersEdges = (0, _helpers.getUsersEdges)(response);
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const edges = usersEdges.splice(cursorStart, querySize - cursorStart);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryUsers_network.buildUsersQuery)(options))]
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
exports.networkUsers = networkUsers;