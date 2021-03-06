"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionErrorCountChartPreview = getTransactionErrorCountChartPreview;

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


function getTransactionErrorCountChartPreview({
  setup,
  alertParams
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_error_count_chart_preview', async () => {
    const {
      apmEventClient,
      start,
      end
    } = setup;
    const {
      serviceName,
      environment
    } = alertParams;
    const query = {
      bool: {
        filter: [...(serviceName ? [{
          term: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
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
        }
      }
    };
    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.error]
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
      return {
        x: bucket.key,
        y: bucket.doc_count
      };
    });
  });
}