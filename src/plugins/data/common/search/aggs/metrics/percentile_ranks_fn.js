"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggPercentileRanks = exports.aggPercentileRanksFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggPercentileRanksFnName = 'aggPercentileRanks';
exports.aggPercentileRanksFnName = aggPercentileRanksFnName;

const aggPercentileRanks = () => ({
  name: aggPercentileRanksFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.percentile_ranks.help', {
    defaultMessage: 'Generates a serialized agg config for a Percentile Ranks agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentile_ranks.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentile_ranks.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentile_ranks.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentile_ranks.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    values: {
      types: ['number'],
      multi: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentile_ranks.values.help', {
        defaultMessage: 'Range of percentiles ranks'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentile_ranks.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentile_ranks.customLabel.help', {
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
        type: _.METRIC_TYPES.PERCENTILE_RANKS,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggPercentileRanks = aggPercentileRanks;