"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logRateModelPlotResponseRT = exports.logRateModelPlotBucketRT = exports.createLogEntryRateQuery = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _common = require("./common");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createLogEntryRateQuery = (logRateJobId, startTime, endTime, bucketDuration, size, afterKey, datasets) => ({ ..._common.defaultRequestParameters,
  body: {
    query: {
      bool: {
        filter: [...(0, _common.createJobIdFilters)(logRateJobId), ...(0, _common.createTimeRangeFilters)(startTime, endTime), ...(0, _common.createResultTypeFilters)(['model_plot', 'record']), ...(0, _common.createDatasetsFilters)(datasets), {
          term: {
            detector_index: {
              value: 0
            }
          }
        }]
      }
    },
    aggs: {
      timestamp_partition_buckets: {
        composite: {
          after: afterKey,
          size,
          sources: [{
            timestamp: {
              date_histogram: {
                field: 'timestamp',
                fixed_interval: `${bucketDuration}ms`,
                order: 'asc'
              }
            }
          }, {
            partition: {
              terms: {
                field: 'partition_field_value',
                order: 'asc'
              }
            }
          }]
        },
        aggs: {
          filter_model_plot: {
            filter: {
              term: {
                result_type: 'model_plot'
              }
            },
            aggs: {
              average_actual: {
                avg: {
                  field: 'actual'
                }
              },
              sum_actual: {
                sum: {
                  field: 'actual'
                }
              }
            }
          },
          filter_records: {
            filter: {
              term: {
                result_type: 'record'
              }
            },
            aggs: {
              maximum_record_score: {
                max: {
                  field: 'record_score'
                }
              },
              top_hits_record: {
                top_hits: {
                  _source: Object.keys(logRateMlRecordRT.props),
                  size: 100,
                  sort: [{
                    timestamp: 'asc'
                  }]
                }
              }
            }
          }
        }
      }
    }
  },
  size: 0
});

exports.createLogEntryRateQuery = createLogEntryRateQuery;
const logRateMlRecordRT = rt.type({
  actual: rt.array(rt.number),
  bucket_span: rt.number,
  record_score: rt.number,
  timestamp: rt.number,
  typical: rt.array(rt.number)
});
const metricAggregationRT = rt.type({
  value: rt.union([rt.number, rt.null])
});
const compositeTimestampPartitionKeyRT = rt.type({
  partition: rt.string,
  timestamp: rt.number
});
const logRateModelPlotBucketRT = rt.type({
  key: compositeTimestampPartitionKeyRT,
  filter_records: rt.type({
    doc_count: rt.number,
    maximum_record_score: metricAggregationRT,
    top_hits_record: rt.type({
      hits: rt.type({
        hits: rt.array(rt.type({
          _id: rt.string,
          _source: logRateMlRecordRT
        }))
      })
    })
  }),
  filter_model_plot: rt.type({
    doc_count: rt.number,
    average_actual: metricAggregationRT,
    sum_actual: metricAggregationRT
  })
});
exports.logRateModelPlotBucketRT = logRateModelPlotBucketRT;
const logRateModelPlotResponseRT = rt.partial({
  aggregations: rt.type({
    timestamp_partition_buckets: rt.intersection([rt.type({
      buckets: rt.array(logRateModelPlotBucketRT)
    }), rt.partial({
      after_key: compositeTimestampPartitionKeyRT
    })])
  })
});
exports.logRateModelPlotResponseRT = logRateModelPlotResponseRT;