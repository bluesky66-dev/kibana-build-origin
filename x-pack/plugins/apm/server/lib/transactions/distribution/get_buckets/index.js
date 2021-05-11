"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuckets = getBuckets;

var _with_apm_span = require("../../../../utils/with_apm_span");

var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../../common/processor_event");

var _join_by_key = require("../../../../../common/utils/join_by_key");

var _queries = require("../../../../../common/utils/queries");

var _aggregated_transactions = require("../../../helpers/aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getHistogramAggOptions({
  bucketSize,
  field,
  distributionMax
}) {
  return {
    field,
    interval: bucketSize,
    min_doc_count: 0,
    extended_bounds: {
      min: 0,
      max: distributionMax
    }
  };
}

async function getBuckets({
  environment,
  serviceName,
  transactionName,
  transactionType,
  transactionId,
  traceId,
  distributionMax,
  bucketSize,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_latency_distribution_buckets_with_samples', async () => {
    const {
      start,
      end,
      esFilter,
      apmEventClient
    } = setup;
    const commonFilters = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, {
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
      }
    }, {
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];

    async function getSamplesForDistributionBuckets() {
      var _response$aggregation, _response$aggregation2;

      const response = await (0, _with_apm_span.withApmSpan)('get_samples_for_latency_distribution_buckets', () => apmEventClient.search({
        apm: {
          events: [_processor_event.ProcessorEvent.transaction]
        },
        body: {
          query: {
            bool: {
              filter: [...commonFilters, {
                term: {
                  [_elasticsearch_fieldnames.TRANSACTION_SAMPLED]: true
                }
              }],
              should: [{
                term: {
                  [_elasticsearch_fieldnames.TRACE_ID]: traceId
                }
              }, {
                term: {
                  [_elasticsearch_fieldnames.TRANSACTION_ID]: transactionId
                }
              }]
            }
          },
          aggs: {
            distribution: {
              histogram: getHistogramAggOptions({
                bucketSize,
                field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
                distributionMax
              }),
              aggs: {
                samples: {
                  top_hits: {
                    _source: [_elasticsearch_fieldnames.TRANSACTION_ID, _elasticsearch_fieldnames.TRACE_ID],
                    size: 10,
                    sort: {
                      _score: 'desc'
                    }
                  }
                }
              }
            }
          }
        }
      }));
      return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.distribution.buckets.map(bucket => {
        const samples = bucket.samples.hits.hits;
        return {
          key: bucket.key,
          samples: samples.map(({
            _source: sample
          }) => ({
            traceId: sample.trace.id,
            transactionId: sample.transaction.id
          }))
        };
      })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
    }

    async function getDistributionBuckets() {
      var _response$aggregation3, _response$aggregation4;

      const response = await (0, _with_apm_span.withApmSpan)('get_latency_distribution_buckets', () => apmEventClient.search({
        apm: {
          events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
        },
        body: {
          query: {
            bool: {
              filter: [...commonFilters, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions)]
            }
          },
          aggs: {
            distribution: {
              histogram: getHistogramAggOptions({
                field: (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions),
                bucketSize,
                distributionMax
              })
            }
          }
        }
      }));
      return (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.distribution.buckets.map(bucket => {
        return {
          key: bucket.key,
          count: bucket.doc_count
        };
      })) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : [];
    }

    const [samplesForDistributionBuckets, distributionBuckets] = await Promise.all([getSamplesForDistributionBuckets(), getDistributionBuckets()]);
    const buckets = (0, _join_by_key.joinByKey)([...samplesForDistributionBuckets, ...distributionBuckets], 'key').map(bucket => {
      var _bucket$samples, _bucket$count;

      return { ...bucket,
        samples: (_bucket$samples = bucket.samples) !== null && _bucket$samples !== void 0 ? _bucket$samples : [],
        count: (_bucket$count = bucket.count) !== null && _bucket$count !== void 0 ? _bucket$count : 0
      };
    });
    return {
      noHits: buckets.length === 0,
      bucketSize,
      buckets
    };
  });
}