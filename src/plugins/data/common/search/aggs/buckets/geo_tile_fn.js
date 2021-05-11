"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggGeoTile = exports.aggGeoTileFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggGeoTileFnName = 'aggGeoTile';
exports.aggGeoTileFnName = aggGeoTileFnName;

const aggGeoTile = () => ({
  name: aggGeoTileFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.geoTile.help', {
    defaultMessage: 'Generates a serialized agg config for a Geo Tile agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    useGeocentroid: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.useGeocentroid.help', {
        defaultMessage: 'Specifies whether to use geocentroid for this aggregation'
      })
    },
    precision: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.precision.help', {
        defaultMessage: 'Precision to use for this aggregation.'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoTile.customLabel.help', {
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
        type: _.BUCKET_TYPES.GEOTILE_GRID,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggGeoTile = aggGeoTile;