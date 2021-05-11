"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCorrelationsForSlowTransactions = getCorrelationsForSlowTransactions;

var _queries = require("../../../../common/utils/queries");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _get_duration_for_percentile = require("./get_duration_for_percentile");

var _process_significant_term_aggs = require("../process_significant_term_aggs");

var _get_latency_distribution = require("./get_latency_distribution");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getCorrelationsForSlowTransactions({
  environment,
  serviceName,
  transactionType,
  transactionName,
  durationPercentile,
  fieldNames,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_correlations_for_slow_transactions', async () => {
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

    const durationForPercentile = await (0, _get_duration_for_percentile.getDurationForPercentile)({
      durationPercentile,
      backgroundFilters,
      setup
    });
    const response = await (0, _with_apm_span.withApmSpan)('get_significant_terms', () => {
      const params = {
        apm: {
          events: [_processor_event.ProcessorEvent.transaction]
        },
        body: {
          size: 0,
          query: {
            bool: {
              // foreground filters
              filter: backgroundFilters,
              must: {
                function_score: {
                  query: {
                    range: {
                      [_elasticsearch_fieldnames.TRANSACTION_DURATION]: {
                        gte: durationForPercentile
                      }
                    }
                  },
                  script_score: {
                    script: {
                      source: `Math.log(2 + doc['${_elasticsearch_fieldnames.TRANSACTION_DURATION}'].value)`
                    }
                  }
                }
              }
            }
          },
          aggs: fieldNames.reduce((acc, fieldName) => {
            return { ...acc,
              [fieldName]: {
                significant_terms: {
                  size: 10,
                  field: fieldName,
                  background_filter: {
                    bool: {
                      filter: [...backgroundFilters, {
                        range: {
                          [_elasticsearch_fieldnames.TRANSACTION_DURATION]: {
                            lt: durationForPercentile
                          }
                        }
                      }]
                    }
                  }
                }
              }
            };
          }, {})
        }
      };
      return apmEventClient.search(params);
    });

    if (!response.aggregations) {
      return {};
    }

    const topSigTerms = (0, _process_significant_term_aggs.processSignificantTermAggs)({
      sigTermAggs: response.aggregations
    });
    return (0, _get_latency_distribution.getLatencyDistribution)({
      setup,
      backgroundFilters,
      topSigTerms
    });
  });
}