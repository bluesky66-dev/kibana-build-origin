"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggMovingAvg = exports.aggMovingAvgFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggMovingAvgFnName = 'aggMovingAvg';
exports.aggMovingAvgFnName = aggMovingAvgFnName;

const aggMovingAvg = () => ({
  name: aggMovingAvgFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.moving_avg.help', {
    defaultMessage: 'Generates a serialized agg config for a Moving Average agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    metricAgg: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.metricAgg.help', {
        defaultMessage: 'Id for finding agg config to use for building parent pipeline aggregations'
      })
    },
    customMetric: {
      types: ['agg_type'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.customMetric.help', {
        defaultMessage: 'Agg config to use for building parent pipeline aggregations'
      })
    },
    window: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.window.help', {
        defaultMessage: 'The size of window to "slide" across the histogram.'
      })
    },
    buckets_path: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.derivative.buckets_path.help', {
        defaultMessage: 'Path to the metric of interest'
      })
    },
    script: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.script.help', {
        defaultMessage: 'Id for finding agg config to use for building parent pipeline aggregations'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.moving_avg.customLabel.help', {
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
        type: _.METRIC_TYPES.MOVING_FN,
        params: { ...rest,
          customMetric: (_args$customMetric = args.customMetric) === null || _args$customMetric === void 0 ? void 0 : _args$customMetric.value
        }
      }
    };
  }
});

exports.aggMovingAvg = aggMovingAvg;