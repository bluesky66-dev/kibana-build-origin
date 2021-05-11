"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPotentialMatches = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This is the first phase of the query. In it, we find all monitor IDs that have ever matched the given filters.
 * @param queryContext the data and resources needed to perform the query
 * @param searchAfter indicates where Elasticsearch should continue querying on subsequent requests, if at all
 * @param size the minimum size of the matches to chunk
 */


const findPotentialMatches = async (queryContext, searchAfter, size) => {
  var _queryResult$aggregat, _queryResult$aggregat2, _queryResult$aggregat3, _queryResult$aggregat4;

  const {
    body: queryResult
  } = await query(queryContext, searchAfter, size);
  const monitorIds = [];
  ((_queryResult$aggregat = (_queryResult$aggregat2 = queryResult.aggregations) === null || _queryResult$aggregat2 === void 0 ? void 0 : _queryResult$aggregat2.monitors.buckets) !== null && _queryResult$aggregat !== void 0 ? _queryResult$aggregat : []).forEach(b => {
    const monitorId = b.key.monitor_id;
    monitorIds.push(monitorId);
  });
  return {
    monitorIds,
    searchAfter: (_queryResult$aggregat3 = queryResult.aggregations) === null || _queryResult$aggregat3 === void 0 ? void 0 : (_queryResult$aggregat4 = _queryResult$aggregat3.monitors) === null || _queryResult$aggregat4 === void 0 ? void 0 : _queryResult$aggregat4.after_key
  };
};

exports.findPotentialMatches = findPotentialMatches;

const query = async (queryContext, searchAfter, size) => {
  const body = await queryBody(queryContext, searchAfter, size);
  const params = {
    body
  };
  return await queryContext.search(params);
};

const queryBody = async (queryContext, searchAfter, size) => {
  const filters = await queryContext.dateAndCustomFilters();

  if (queryContext.statusFilter) {
    filters.push({
      match: {
        'monitor.status': queryContext.statusFilter
      }
    });
  }

  const body = {
    size: 0,
    query: {
      bool: {
        filter: filters
      }
    },
    aggs: {
      monitors: {
        composite: {
          size,
          sources: [{
            monitor_id: {
              terms: {
                field: 'monitor.id',
                order: queryContext.cursorOrder()
              }
            }
          }]
        }
      }
    }
  };

  if (searchAfter) {
    (0, _saferLodashSet.set)(body, 'aggs.monitors.composite.after', searchAfter);
  }

  return body;
};