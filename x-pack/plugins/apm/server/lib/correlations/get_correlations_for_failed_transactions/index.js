"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCorrelationsForFailedTransactions = getCorrelationsForFailedTransactions;
exports.getErrorRateTimeSeries = getErrorRateTimeSeries;

var _lodash = require("lodash");

var _event_outcome = require("../../../../common/event_outcome");

var _process_significant_term_aggs = require("../process_significant_term_aggs");

var _queries = require("../../../../common/utils/queries");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _transaction_error_rate = require("../../helpers/transaction_error_rate");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getCorrelationsForFailedTransactions({
  environment,
  serviceName,
  transactionType,
  transactionName,
  fieldNames,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_correlations_for_failed_transactions', async () => {
    var _response$aggregation;

    const {
      start,
      end,
      esFilter,
      apmEventClient
    } = setup;
    const backgroundFilters = [{
      term: {
        [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
      }
    }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];

    if (serviceName) {
      backgroundFilters.push({
        term: {
          [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
        }
      });
    }

    if (transactionType) {
      backgroundFilters.push({
        term: {
          [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
        }
      });
    }

    if (transactionName) {
      backgroundFilters.push({
        term: {
          [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
        }
      });
    }

    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      track_total_hits: true,
      body: {
        size: 0,
        query: {
          bool: {
            filter: backgroundFilters
          }
        },
        aggs: {
          failed_transactions: {
            filter: {
              term: {
                [_elasticsearch_fieldnames.EVENT_OUTCOME]: _event_outcome.EventOutcome.failure
              }
            },
            // significant term aggs
            aggs: fieldNames.reduce((acc, fieldName) => {
              return { ...acc,
                [fieldName]: {
                  significant_terms: {
                    size: 10,
                    field: fieldName,
                    background_filter: {
                      bool: {
                        filter: backgroundFilters,
                        must_not: {
                          term: {
                            [_elasticsearch_fieldnames.EVENT_OUTCOME]: _event_outcome.EventOutcome.failure
                          }
                        }
                      }
                    }
                  }
                }
              };
            }, {})
          }
        }
      }
    };
    const response = await apmEventClient.search(params);

    if (!response.aggregations) {
      return {};
    }

    const sigTermAggs = (0, _lodash.omit)((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.failed_transactions, 'doc_count');
    const topSigTerms = (0, _process_significant_term_aggs.processSignificantTermAggs)({
      sigTermAggs
    });
    return getErrorRateTimeSeries({
      setup,
      backgroundFilters,
      topSigTerms
    });
  });
}

async function getErrorRateTimeSeries({
  setup,
  backgroundFilters,
  topSigTerms
}) {
  return (0, _with_apm_span.withApmSpan)('get_error_rate_timeseries', async () => {
    const {
      start,
      end,
      apmEventClient
    } = setup;
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)({
      start,
      end,
      numBuckets: 15
    });

    if ((0, _lodash.isEmpty)(topSigTerms)) {
      return {};
    }

    const timeseriesAgg = {
      date_histogram: {
        field: '@timestamp',
        fixed_interval: intervalString,
        min_doc_count: 0,
        extended_bounds: {
          min: start,
          max: end
        }
      },
      aggs: {
        outcomes: (0, _transaction_error_rate.getOutcomeAggregation)()
      }
    };
    const perTermAggs = topSigTerms.reduce((acc, term, index) => {
      acc[`term_${index}`] = {
        filter: {
          term: {
            [term.fieldName]: term.fieldValue
          }
        },
        aggs: {
          timeseries: timeseriesAgg
        }
      };
      return acc;
    }, {});
    const params = {
      // TODO: add support for metrics
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: backgroundFilters
          }
        },
        aggs: (0, _lodash.merge)({
          timeseries: timeseriesAgg
        }, perTermAggs)
      }
    };
    const response = await apmEventClient.search(params);
    const {
      aggregations
    } = response;

    if (!aggregations) {
      return {};
    }

    return {
      overall: {
        timeseries: (0, _transaction_error_rate.getTransactionErrorRateTimeSeries)(aggregations.timeseries.buckets)
      },
      significantTerms: topSigTerms.map((topSig, index) => {
        const agg = aggregations[`term_${index}`];
        return { ...topSig,
          timeseries: (0, _transaction_error_rate.getTransactionErrorRateTimeSeries)(agg.timeseries.buckets)
        };
      })
    };
  });
}