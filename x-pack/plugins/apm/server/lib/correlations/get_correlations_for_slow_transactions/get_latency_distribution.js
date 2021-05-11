"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatencyDistribution = getLatencyDistribution;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _get_max_latency = require("./get_max_latency");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getLatencyDistribution({
  setup,
  backgroundFilters,
  topSigTerms
}) {
  return (0, _with_apm_span.withApmSpan)('get_latency_distribution', async () => {
    const {
      apmEventClient
    } = setup;

    if ((0, _lodash.isEmpty)(topSigTerms)) {
      return {};
    }

    const maxLatency = await (0, _get_max_latency.getMaxLatency)({
      setup,
      backgroundFilters,
      topSigTerms
    });

    if (!maxLatency) {
      return {};
    }

    const intervalBuckets = 15;
    const distributionInterval = Math.floor(maxLatency / intervalBuckets);
    const distributionAgg = {
      // filter out outliers not included in the significant term docs
      filter: {
        range: {
          [_elasticsearch_fieldnames.TRANSACTION_DURATION]: {
            lte: maxLatency
          }
        }
      },
      aggs: {
        dist_filtered_by_latency: {
          histogram: {
            // TODO: add support for metrics
            field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
            interval: distributionInterval,
            min_doc_count: 0,
            extended_bounds: {
              min: 0,
              max: maxLatency
            }
          }
        }
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
          distribution: distributionAgg
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
        aggs: {
          // overall aggs
          distribution: distributionAgg,
          // per term aggs
          ...perTermAggs
        }
      }
    };
    const response = await (0, _with_apm_span.withApmSpan)('get_terms_distribution', () => apmEventClient.search(params));

    if (!response.aggregations) {
      return;
    }

    function formatDistribution(distribution) {
      const total = distribution.doc_count; // remove trailing buckets that are empty and out of bounds of the desired number of buckets

      const buckets = (0, _lodash.dropRightWhile)(distribution.dist_filtered_by_latency.buckets, (bucket, index) => bucket.doc_count === 0 && index > intervalBuckets - 1);
      return buckets.map(bucket => ({
        x: bucket.key,
        y: bucket.doc_count / total * 100
      }));
    }

    return {
      distributionInterval,
      overall: {
        distribution: formatDistribution(response.aggregations.distribution)
      },
      significantTerms: topSigTerms.map((topSig, index) => {
        // @ts-expect-error
        const agg = response.aggregations[`term_${index}`];
        return { ...topSig,
          distribution: formatDistribution(agg.distribution)
        };
      })
    };
  });
}