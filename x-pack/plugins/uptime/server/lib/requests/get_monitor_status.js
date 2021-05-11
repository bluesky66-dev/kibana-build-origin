"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorStatus = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLocationClause = locations => ({
  bool: {
    should: [...locations.map(location => ({
      term: {
        'observer.geo.name': location
      }
    }))]
  }
});

const getMonitorStatus = async ({
  uptimeEsClient,
  filters,
  locations,
  numTimes,
  timerange: {
    from,
    to
  }
}) => {
  let afterKey;
  const STATUS = 'down';
  let monitors = [];

  do {
    var _result$aggregations, _result$aggregations$, _result$aggregations2, _result$aggregations3; // today this value is hardcoded. In the future we may support
    // multiple status types for this alert, and this will become a parameter


    const esParams = {
      query: {
        bool: {
          filter: [{
            term: {
              'monitor.status': STATUS
            }
          }, {
            range: {
              '@timestamp': {
                gte: from,
                lte: to
              }
            }
          }, // append user filters, if defined
          ...(filters !== null && filters !== void 0 && filters.bool ? [filters] : [])]
        }
      },
      size: 0,
      aggs: {
        monitors: {
          composite: {
            size: 2000,

            /**
             * We "paginate" results by utilizing the `afterKey` field
             * to tell Elasticsearch where it should start on subsequent queries.
             */
            ...(afterKey ? {
              after: afterKey
            } : {}),
            sources: [{
              monitorId: {
                terms: {
                  field: 'monitor.id'
                }
              }
            }, {
              status: {
                terms: {
                  field: 'monitor.status'
                }
              }
            }, {
              location: {
                terms: {
                  field: 'observer.geo.name',
                  missing_bucket: true
                }
              }
            }]
          },
          aggs: {
            fields: {
              top_hits: {
                size: 1
              }
            }
          }
        }
      }
    };
    /**
     * Perform a logical `and` against the selected location filters.
     */

    if (locations.length) {
      esParams.query.bool.filter.push(getLocationClause(locations));
    }

    const {
      body: result
    } = await uptimeEsClient.search({
      body: esParams
    });
    afterKey = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$ = _result$aggregations.monitors) === null || _result$aggregations$ === void 0 ? void 0 : _result$aggregations$.after_key;
    monitors = monitors.concat((result === null || result === void 0 ? void 0 : (_result$aggregations2 = result.aggregations) === null || _result$aggregations2 === void 0 ? void 0 : (_result$aggregations3 = _result$aggregations2.monitors) === null || _result$aggregations3 === void 0 ? void 0 : _result$aggregations3.buckets) || []);
  } while (afterKey !== undefined);

  return monitors.filter(monitor => (monitor === null || monitor === void 0 ? void 0 : monitor.doc_count) >= numTimes).map(({
    key,
    doc_count: count,
    fields
  }) => {
    var _fields$hits, _fields$hits$hits, _fields$hits$hits$;

    return { ...key,
      count,
      monitorInfo: fields === null || fields === void 0 ? void 0 : (_fields$hits = fields.hits) === null || _fields$hits === void 0 ? void 0 : (_fields$hits$hits = _fields$hits.hits) === null || _fields$hits$hits === void 0 ? void 0 : (_fields$hits$hits$ = _fields$hits$hits[0]) === null || _fields$hits$hits$ === void 0 ? void 0 : _fields$hits$hits$._source
    };
  });
};

exports.getMonitorStatus = getMonitorStatus;