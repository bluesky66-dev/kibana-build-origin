"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggGeoHash = exports.aggGeoHashFnName = void 0;

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
const aggGeoHashFnName = 'aggGeoHash';
exports.aggGeoHashFnName = aggGeoHashFnName;

const aggGeoHash = () => ({
  name: aggGeoHashFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.geoHash.help', {
    defaultMessage: 'Generates a serialized agg config for a Geo Hash agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    useGeocentroid: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.useGeocentroid.help', {
        defaultMessage: 'Specifies whether to use geocentroid for this aggregation'
      })
    },
    autoPrecision: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.autoPrecision.help', {
        defaultMessage: 'Specifies whether to use auto precision for this aggregation'
      })
    },
    isFilteredByCollar: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.isFilteredByCollar.help', {
        defaultMessage: 'Specifies whether to filter by collar'
      })
    },
    boundingBox: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.boundingBox.help', {
        defaultMessage: 'Filter results based on a point location within a bounding box'
      })
    },
    precision: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.precision.help', {
        defaultMessage: 'Precision to use for this aggregation.'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.geoHash.customLabel.help', {
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
        type: _.BUCKET_TYPES.GEOHASH_GRID,
        params: { ...rest,
          boundingBox: (0, _get_parsed_value.getParsedValue)(args, 'boundingBox')
        }
      }
    };
  }
});

exports.aggGeoHash = aggGeoHash;