"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uncommonProcesses = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../../../common/constants");

var _ecs_fields = require("../../../../../../common/ecs/ecs_fields");

var _build_query = require("../../../../../utils/build_query");

var _query = require("./dsl/query.dsl");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uncommonProcesses = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    return (0, _query.buildQuery)(options);
  },
  parse: async (options, response) => {
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const totalCount = (0, _fp.getOr)(0, 'aggregations.process_count.value', response.rawResponse);
    const buckets = (0, _fp.getOr)([], 'aggregations.group_by_process.buckets', response.rawResponse);
    const hits = (0, _helpers.getHits)(buckets);
    const uncommonProcessesEdges = hits.map(hit => (0, _helpers.formatUncommonProcessesData)(_helpers.uncommonProcessesFields, hit, { ..._ecs_fields.processFieldsMap,
      ..._ecs_fields.userFieldsMap
    }));
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const edges = uncommonProcessesEdges.splice(cursorStart, querySize - cursorStart);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _query.buildQuery)(options))],
      response: [(0, _build_query.inspectStringifyObject)(response)]
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
exports.uncommonProcesses = uncommonProcesses;