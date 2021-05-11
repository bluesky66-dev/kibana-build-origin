"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topLogEntryCategoriesResponseRT = exports.logEntryCategoryBucketRT = exports.createTopLogEntryCategoriesQuery = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _elasticsearch_runtime_types = require("../../../utils/elasticsearch_runtime_types");

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


const getAggregationOrderForSortField = field => {
  switch (field) {
    case 'maximumAnomalyScore':
      return 'filter_record>maximum_record_score';
      break;

    case 'logEntryCount':
      return 'filter_model_plot>sum_actual';
      break;

    default:
      return 'filter_model_plot>sum_actual';
  }
};

const createTopLogEntryCategoriesQuery = (logEntryCategoriesJobId, startTime, endTime, size, datasets, sort) => ({ ..._common.defaultRequestParameters,
  body: {
    query: {
      bool: {
        filter: [...(0, _common.createJobIdFilters)(logEntryCategoriesJobId), ...(0, _common.createTimeRangeFilters)(startTime, endTime), ...(0, _common.createDatasetsFilters)(datasets), {
          bool: {
            should: [{
              bool: {
                filter: [...(0, _common.createResultTypeFilters)(['model_plot']), {
                  range: {
                    actual: {
                      gt: 0
                    }
                  }
                }]
              }
            }, {
              bool: {
                filter: (0, _common.createResultTypeFilters)(['record'])
              }
            }],
            minimum_should_match: 1
          }
        }]
      }
    },
    aggs: {
      terms_category_id: {
        terms: {
          field: 'by_field_value',
          size,
          order: {
            [getAggregationOrderForSortField(sort.field)]: sort.direction
          }
        },
        aggs: {
          filter_model_plot: {
            filter: {
              term: {
                result_type: 'model_plot'
              }
            },
            aggs: {
              sum_actual: {
                sum: {
                  field: 'actual'
                }
              },
              terms_dataset: {
                terms: {
                  field: 'partition_field_value',
                  size: 1000
                }
              }
            }
          },
          filter_record: {
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
              terms_dataset: {
                terms: {
                  field: 'partition_field_value',
                  size: 1000
                },
                aggs: {
                  maximum_record_score: {
                    max: {
                      field: 'record_score'
                    }
                  }
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

exports.createTopLogEntryCategoriesQuery = createTopLogEntryCategoriesQuery;
const metricAggregationRT = rt.type({
  value: rt.union([rt.number, rt.null])
});
const logEntryCategoryBucketRT = rt.type({
  key: rt.string,
  doc_count: rt.number,
  filter_record: rt.type({
    maximum_record_score: metricAggregationRT,
    terms_dataset: rt.type({
      buckets: rt.array(rt.type({
        key: rt.string,
        doc_count: rt.number,
        maximum_record_score: metricAggregationRT
      }))
    })
  }),
  filter_model_plot: rt.type({
    sum_actual: metricAggregationRT,
    terms_dataset: rt.type({
      buckets: rt.array(rt.type({
        key: rt.string,
        doc_count: rt.number
      }))
    })
  })
});
exports.logEntryCategoryBucketRT = logEntryCategoryBucketRT;
const topLogEntryCategoriesResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.partial({
  aggregations: rt.type({
    terms_category_id: rt.type({
      buckets: rt.array(logEntryCategoryBucketRT)
    })
  })
})]);
exports.topLogEntryCategoriesResponseRT = topLogEntryCategoriesResponseRT;