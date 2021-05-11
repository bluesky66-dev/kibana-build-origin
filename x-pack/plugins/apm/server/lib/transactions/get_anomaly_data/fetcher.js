"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anomalySeriesFetcher = anomalySeriesFetcher;

var _queries = require("../../../../common/utils/queries");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function anomalySeriesFetcher({
  serviceName,
  transactionType,
  intervalString,
  ml,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_latency_anomaly_data', async () => {
    const params = {
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              terms: {
                result_type: ['model_plot', 'record']
              }
            }, {
              term: {
                partition_field_value: serviceName
              }
            }, {
              term: {
                by_field_value: transactionType
              }
            }, ...(0, _queries.rangeQuery)(start, end, 'timestamp')]
          }
        },
        aggs: {
          job_id: {
            terms: {
              field: 'job_id'
            },
            aggs: {
              ml_avg_response_times: {
                date_histogram: {
                  field: 'timestamp',
                  fixed_interval: intervalString,
                  extended_bounds: {
                    min: start,
                    max: end
                  }
                },
                aggs: {
                  anomaly_score: {
                    top_metrics: {
                      metrics: [{
                        field: 'record_score'
                      }, {
                        field: 'timestamp'
                      }, {
                        field: 'bucket_span'
                      }],
                      sort: {
                        record_score: 'desc'
                      }
                    }
                  },
                  lower: {
                    min: {
                      field: 'model_lower'
                    }
                  },
                  upper: {
                    max: {
                      field: 'model_upper'
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    return ml.mlSystem.mlAnomalySearch(params, []);
  });
}