"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionErrorRateChartPreview = getTransactionErrorRateChartPreview;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _queries = require("../../../../common/utils/queries");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _transaction_error_rate = require("../../helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTransactionErrorRateChartPreview({
  setup,
  alertParams
}) {
  const {
    apmEventClient,
    start,
    end
  } = setup;
  const {
    serviceName,
    environment,
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
  const outcomes = (0, _transaction_error_rate.getOutcomeAggregation)();
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start,
    end,
    numBuckets: 20
  });
  const aggs = {
    outcomes,
    timeseries: {
      date_histogram: {
        field: '@timestamp',
        fixed_interval: intervalString
      },
      aggs: {
        outcomes
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
    const errorPercentage = (0, _transaction_error_rate.calculateTransactionErrorPercentage)(bucket.outcomes);
    return {
      x: bucket.key,
      y: errorPercentage
    };
  });
}