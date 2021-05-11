"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistogramForMonitors = exports.getMonitorStates = void 0;

var _constants = require("../../../common/constants");

var _search = require("./search");

var _get_histogram_interval = require("../helper/get_histogram_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// To simplify the handling of the group of pagination vars they're passed back to the client as a string


const jsonifyPagination = p => {
  if (!p) {
    return null;
  }

  return JSON.stringify(p);
}; // Gets a page of monitor states.


const getMonitorStates = async ({
  uptimeEsClient,
  dateRangeStart,
  dateRangeEnd,
  pagination,
  pageSize,
  filters,
  statusFilter
}) => {
  pagination = pagination || _constants.CONTEXT_DEFAULTS.CURSOR_PAGINATION;
  statusFilter = statusFilter === null ? undefined : statusFilter;
  const queryContext = new _search.QueryContext(uptimeEsClient, dateRangeStart, dateRangeEnd, pagination, filters && filters !== '' ? JSON.parse(filters) : null, pageSize, statusFilter);
  const size = Math.min(queryContext.size, _constants.QUERY.DEFAULT_AGGS_CAP);
  const iterator = new _search.MonitorSummaryIterator(queryContext);
  const page = await iterator.nextPage(size);
  const minInterval = (0, _get_histogram_interval.getHistogramInterval)(queryContext.dateRangeStart, queryContext.dateRangeEnd, 12);
  const histograms = await getHistogramForMonitors(queryContext, page.monitorSummaries.map(s => s.monitor_id), minInterval);
  page.monitorSummaries.forEach(s => {
    s.histogram = histograms[s.monitor_id];
    s.minInterval = minInterval;
  });
  return {
    summaries: page.monitorSummaries,
    nextPagePagination: jsonifyPagination(page.nextPagePagination),
    prevPagePagination: jsonifyPagination(page.prevPagePagination)
  };
};

exports.getMonitorStates = getMonitorStates;

const getHistogramForMonitors = async (queryContext, monitorIds, minInterval) => {
  var _result$aggregations$, _result$aggregations;

  const params = {
    size: 0,
    query: {
      bool: {
        filter: [{
          range: {
            'summary.down': {
              gt: 0
            }
          }
        }, {
          terms: {
            'monitor.id': monitorIds
          }
        }, {
          range: {
            '@timestamp': {
              gte: queryContext.dateRangeStart,
              lte: queryContext.dateRangeEnd
            }
          }
        }]
      }
    },
    aggs: {
      histogram: {
        date_histogram: {
          field: '@timestamp',
          // 12 seems to be a good size for performance given
          // long monitor lists of up to 100 on the overview page
          fixed_interval: minInterval + 'ms',
          missing: 0
        },
        aggs: {
          by_id: {
            terms: {
              field: 'monitor.id',
              size: Math.max(monitorIds.length, 1)
            },
            aggs: {
              totalDown: {
                sum: {
                  field: 'summary.down'
                }
              }
            }
          }
        }
      }
    }
  };
  const {
    body: result
  } = await queryContext.search({
    body: params
  });
  const histoBuckets = (_result$aggregations$ = (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : _result$aggregations.histogram.buckets) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : [];
  const simplified = histoBuckets.map(histoBucket => {
    const byId = {};
    histoBucket.by_id.buckets.forEach(idBucket => {
      byId[idBucket.key] = idBucket.totalDown.value;
    });
    return {
      timestamp: parseInt(histoBucket.key, 10),
      byId
    };
  });
  const histosById = {};
  monitorIds.forEach(id => {
    const points = [];
    simplified.forEach(simpleHisto => {
      points.push({
        timestamp: simpleHisto.timestamp,
        up: undefined,
        down: simpleHisto.byId[id]
      });
    });
    histosById[id] = {
      points
    };
  });
  return histosById;
};

exports.getHistogramForMonitors = getHistogramForMonitors;