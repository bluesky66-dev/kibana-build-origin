"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggBucketSum = exports.aggBucketSumFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggBucketSumFnName = 'aggBucketSum';
exports.aggBucketSumFnName = aggBucketSumFnName;

const aggBucketSum = () => ({
  name: aggBucketSumFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.bucket_sum.help', {
    defaultMessage: 'Generates a serialized agg config for a Sum Bucket agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.bucket_sum.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.bucket_sum.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.bucket_sum.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    customBucket: {
      types: ['agg_type'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.bucket_sum.customBucket.help', {
        defaultMessage: 'Agg config to use for building sibling pipeline aggregations'
      })
    },
    customMetric: {
      types: ['agg_type'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.bucket_sum.customMetric.help', {
        defaultMessage: 'Agg config to use for building sibling pipeline aggregations'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.bucket_sum.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.bucket_sum.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, args) => {
    var _args$customBucket, _args$customMetric;

    const {
      id,
      enabled,
      schema,
      ...rest
    } = args;
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _.METRIC_TYPES.SUM_BUCKET,
        params: { ...rest,
          customBucket: (_args$customBucket = args.customBucket) === null || _args$customBucket === void 0 ? void 0 : _args$customBucket.value,
          customMetric: (_args$customMetric = args.customMetric) === null || _args$customMetric === void 0 ? void 0 : _args$customMetric.value
        }
      }
    };
  }
});

exports.aggBucketSum = aggBucketSum;