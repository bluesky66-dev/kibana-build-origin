"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineEventsAll = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../../../common/constants");

var _build_query = require("../../../../../utils/build_query");

var _queryEvents_all = require("./query.events_all.dsl");

var _constants2 = require("./constants");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const timelineEventsAll = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    const {
      fieldRequested,
      ...queryOptions
    } = (0, _fp.cloneDeep)(options);
    queryOptions.fields = (0, _fp.uniq)([...fieldRequested, ..._constants2.TIMELINE_EVENTS_FIELDS]);
    return (0, _queryEvents_all.buildTimelineEventsAllQuery)(queryOptions);
  },
  parse: async (options, response) => {
    const {
      fieldRequested,
      ...queryOptions
    } = (0, _fp.cloneDeep)(options);
    queryOptions.fields = (0, _fp.uniq)([...fieldRequested, ..._constants2.TIMELINE_EVENTS_FIELDS]);
    const {
      activePage,
      querySize
    } = options.pagination;
    const totalCount = response.rawResponse.hits.total || 0;
    const hits = response.rawResponse.hits.hits;
    const edges = await Promise.all(hits.map(hit => (0, _helpers.formatTimelineData)(options.fieldRequested, _constants2.TIMELINE_EVENTS_FIELDS, hit)));
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryEvents_all.buildTimelineEventsAllQuery)(queryOptions))]
    };
    return { ...response,
      inspect,
      edges,
      totalCount,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        querySize
      }
    };
  }
};
exports.timelineEventsAll = timelineEventsAll;