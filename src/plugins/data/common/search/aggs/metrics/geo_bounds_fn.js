"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggGeoBounds = exports.aggGeoBoundsFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggGeoBoundsFnName = 'aggGeoBounds';
exports.aggGeoBoundsFnName = aggGeoBoundsFnName;

const aggGeoBounds = () => ({
  name: aggGeoBoundsFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.geo_bounds.help', {
    defaultMessage: 'Generates a serialized agg config for a Geo Bounds agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.geo_bounds.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.geo_bounds.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.geo_bounds.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.geo_bounds.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.geo_bounds.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.geo_bounds.customLabel.help', {
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
        type: _.METRIC_TYPES.GEO_BOUNDS,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggGeoBounds = aggGeoBounds;