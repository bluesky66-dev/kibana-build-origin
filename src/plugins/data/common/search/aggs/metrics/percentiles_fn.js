"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggPercentiles = exports.aggPercentilesFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggPercentilesFnName = 'aggPercentiles';
exports.aggPercentilesFnName = aggPercentilesFnName;

const aggPercentiles = () => ({
  name: aggPercentilesFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.percentiles.help', {
    defaultMessage: 'Generates a serialized agg config for a Percentiles agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentiles.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentiles.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentiles.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentiles.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    percents: {
      types: ['number'],
      multi: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentiles.percents.help', {
        defaultMessage: 'Range of percentiles ranks'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentiles.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.percentiles.customLabel.help', {
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
        type: _.METRIC_TYPES.PERCENTILES,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggPercentiles = aggPercentiles;