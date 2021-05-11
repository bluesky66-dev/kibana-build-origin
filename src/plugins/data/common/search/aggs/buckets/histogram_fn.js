"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggHistogram = exports.aggHistogramFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

var _get_parsed_value = require("../utils/get_parsed_value");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggHistogramFnName = 'aggHistogram';
exports.aggHistogramFnName = aggHistogramFnName;

const aggHistogram = () => ({
  name: aggHistogramFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.histogram.help', {
    defaultMessage: 'Generates a serialized agg config for a Histogram agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    interval: {
      types: ['number', 'string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.interval.help', {
        defaultMessage: 'Interval to use for this aggregation'
      })
    },
    intervalBase: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.intervalBase.help', {
        defaultMessage: 'IntervalBase to use for this aggregation'
      })
    },
    min_doc_count: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.minDocCount.help', {
        defaultMessage: 'Specifies whether to use min_doc_count for this aggregation'
      })
    },
    maxBars: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.maxBars.help', {
        defaultMessage: 'Calculate interval to get approximately this many bars'
      })
    },
    has_extended_bounds: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.hasExtendedBounds.help', {
        defaultMessage: 'Specifies whether to use has_extended_bounds for this aggregation'
      })
    },
    extended_bounds: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.extendedBounds.help', {
        defaultMessage: 'With extended_bounds setting, you now can "force" the histogram aggregation to start building buckets on a specific min value and also keep on building buckets up to a max value '
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.histogram.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, args) => {
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
        type: _.BUCKET_TYPES.HISTOGRAM,
        params: { ...rest,
          extended_bounds: (0, _get_parsed_value.getParsedValue)(args, 'extended_bounds')
        }
      }
    };
  }
});

exports.aggHistogram = aggHistogram;