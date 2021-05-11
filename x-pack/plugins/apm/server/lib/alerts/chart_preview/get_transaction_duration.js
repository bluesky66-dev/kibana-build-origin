"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDurationChartPreview = getTransactionDurationChartPreview;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _queries = require("../../../../common/utils/queries");

var _with_apm_span = require("../../../utils/with_apm_span");

var _get_bucket_size = require("../../helpers/get_bucket_size");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getTransactionDurationChartPreview({
  alertParams,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_duration_chart_preview', async () => {
    const {
      apmEventClient,
      start,
      end
    } = setup;
    const {
      aggregationType,
      environment,
      serviceName,
      transactionType
    } = alertParams;
    const query = {
      bool: {
        filter: [{
          term: {
            [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _processor_event.ProcessorEvent.transaction
          }
        }, ...(serviceName ? [{
          term: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
          }
        }] : []), ...(transactionType ? [{
          term: {
            [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
          }
        }] : []), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment)]
      }
    };
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)({
      start,
      end,
      numBuckets: 20
    });
    const aggs = {
      timeseries: {
        date_histogram: {
          field: '@timestamp',
          fixed_interval: intervalString
        },
        aggs: {
          agg: aggregationType === 'avg' ? {
            avg: {
              field: _elasticsearch_fieldnames.TRANSACTION_DURATION
            }
          } : {
            percentiles: {
              field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
              percents: [aggregationType === '95th' ? 95 : 99]
            }
          }
        }
      }
    };
    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 0,
        query,
        aggs
      }
    };
    const resp = await apmEventClient.search(params);

    if (!resp.aggregations) {
      return [];
    }

    return resp.aggregations.timeseries.buckets.map(bucket => {
      const percentilesKey = aggregationType === '95th' ? '95.0' : '99.0';
      const x = bucket.key;
      const y = aggregationType === 'avg' ? bucket.agg.value : bucket.agg.values[percentilesKey];
      return {
        x,
        y
      };
    });
  });
}