"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorAvailability = exports.formatBuckets = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formatBuckets = async (buckets) => // eslint-disable-next-line @typescript-eslint/naming-convention
buckets.map(({
  key,
  fields,
  up_sum,
  down_sum,
  ratio
}) => {
  var _fields$hits, _fields$hits$hits, _fields$hits$hits$;

  return { ...key,
    monitorInfo: fields === null || fields === void 0 ? void 0 : (_fields$hits = fields.hits) === null || _fields$hits === void 0 ? void 0 : (_fields$hits$hits = _fields$hits.hits) === null || _fields$hits$hits === void 0 ? void 0 : (_fields$hits$hits$ = _fields$hits$hits[0]) === null || _fields$hits$hits$ === void 0 ? void 0 : _fields$hits$hits$._source,
    up: up_sum.value,
    down: down_sum.value,
    availabilityRatio: ratio.value
  };
});

exports.formatBuckets = formatBuckets;

const getMonitorAvailability = async ({
  uptimeEsClient,
  range,
  rangeUnit,
  threshold: thresholdString,
  filters
}) => {
  const queryResults = [];
  let afterKey;
  const threshold = Number(thresholdString) / 100;

  if (threshold <= 0 || threshold > 1.0) {
    throw new Error(`Invalid availability threshold value ${thresholdString}. The value must be between 0 and 100`);
  }

  const gte = `now-${range}${rangeUnit}`;
  let parsedFilters;

  if (filters) {
    parsedFilters = JSON.parse(filters);
  }

  do {
    var _parsedFilters, _result$aggregations, _result$aggregations$, _result$aggregations2, _result$aggregations3;

    const esParams = {
      query: {
        bool: {
          filter: [{
            range: {
              '@timestamp': {
                gte,
                lte: 'now'
              }
            }
          }, // append user filters, if defined
          ...((_parsedFilters = parsedFilters) !== null && _parsedFilters !== void 0 && _parsedFilters.bool ? [parsedFilters] : [])]
        }
      },
      size: 0,
      aggs: {
        monitors: {
          composite: {
            size: 2000,
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
                size: 1,
                sort: [{
                  '@timestamp': {
                    order: 'desc'
                  }
                }]
              }
            },
            up_sum: {
              sum: {
                field: 'summary.up',
                missing: 0
              }
            },
            down_sum: {
              sum: {
                field: 'summary.down',
                missing: 0
              }
            },
            ratio: {
              bucket_script: {
                buckets_path: {
                  upTotal: 'up_sum',
                  downTotal: 'down_sum'
                },
                script: `
                if (params.upTotal + params.downTotal > 0) {
                  return params.upTotal / (params.upTotal + params.downTotal);
                } return null;`
              }
            },
            filtered: {
              bucket_selector: {
                buckets_path: {
                  threshold: 'ratio.value'
                },
                script: `params.threshold < ${threshold}`
              }
            }
          }
        }
      }
    };
    const {
      body: result
    } = await uptimeEsClient.search({
      body: esParams
    });
    afterKey = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$ = _result$aggregations.monitors) === null || _result$aggregations$ === void 0 ? void 0 : _result$aggregations$.after_key;
    queryResults.push(formatBuckets((result === null || result === void 0 ? void 0 : (_result$aggregations2 = result.aggregations) === null || _result$aggregations2 === void 0 ? void 0 : (_result$aggregations3 = _result$aggregations2.monitors) === null || _result$aggregations3 === void 0 ? void 0 : _result$aggregations3.buckets) || []));
  } while (afterKey !== undefined);

  return (await Promise.all(queryResults)).reduce((acc, cur) => acc.concat(cur), []);
};

exports.getMonitorAvailability = getMonitorAvailability;