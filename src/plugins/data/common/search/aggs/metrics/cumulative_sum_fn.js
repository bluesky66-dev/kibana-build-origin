"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggCumulativeSum = exports.aggCumulativeSumFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggCumulativeSumFnName = 'aggCumulativeSum';
exports.aggCumulativeSumFnName = aggCumulativeSumFnName;

const aggCumulativeSum = () => ({
  name: aggCumulativeSumFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.cumulative_sum.help', {
    defaultMessage: 'Generates a serialized agg config for a Cumulative Sum agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    metricAgg: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.metricAgg.help', {
        defaultMessage: 'Id for finding agg config to use for building parent pipeline aggregations'
      })
    },
    customMetric: {
      types: ['agg_type'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.customMetric.help', {
        defaultMessage: 'Agg config to use for building parent pipeline aggregations'
      })
    },
    buckets_path: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.buckets_path.help', {
        defaultMessage: 'Path to the metric of interest'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.cumulative_sum.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, args) => {
    var _args$customMetric;

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
        type: _.METRIC_TYPES.CUMULATIVE_SUM,
        params: { ...rest,
          customMetric: (_args$customMetric = args.customMetric) === null || _args$customMetric === void 0 ? void 0 : _args$customMetric.value
        }
      }
    };
  }
});

exports.aggCumulativeSum = aggCumulativeSum;