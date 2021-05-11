"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoHashBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _common = require("../../../../common");

var _bucket_agg_types = require("./bucket_agg_types");

var _geo_hash_fn = require("./geo_hash_fn");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultBoundingBox = {
  top_left: {
    lat: 1,
    lon: 1
  },
  bottom_right: {
    lat: 0,
    lon: 0
  }
};
const defaultPrecision = 2;

const geohashGridTitle = _i18n.i18n.translate('data.search.aggs.buckets.geohashGridTitle', {
  defaultMessage: 'Geohash'
});

const getGeoHashBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.GEOHASH_GRID,
  expressionName: _geo_hash_fn.aggGeoHashFnName,
  title: geohashGridTitle,
  makeLabel: () => geohashGridTitle,
  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: _common.KBN_FIELD_TYPES.GEO_POINT
  }, {
    name: 'autoPrecision',
    default: true,
    write: () => {}
  }, {
    name: 'precision',
    default: defaultPrecision,

    write(aggConfig, output) {
      output.params.precision = aggConfig.params.precision;
    }

  }, {
    name: 'useGeocentroid',
    default: true,
    write: () => {}
  }, {
    name: 'isFilteredByCollar',
    default: true,
    write: () => {}
  }, {
    name: 'boundingBox',
    default: null,
    write: () => {}
  }],

  getRequestAggs(agg) {
    const aggs = [];
    const params = agg.params;

    if (params.isFilteredByCollar && agg.getField()) {
      aggs.push(agg.aggConfigs.createAggConfig({
        type: 'filter',
        id: 'filter_agg',
        enabled: true,
        params: {
          geo_bounding_box: {
            ignore_unmapped: true,
            [agg.getField().name]: params.boundingBox || defaultBoundingBox
          }
        }
      }, {
        addToAggConfigs: false
      }));
    }

    aggs.push(agg);

    if (params.useGeocentroid) {
      aggs.push(agg.aggConfigs.createAggConfig({
        type: 'geo_centroid',
        enabled: true,
        params: {
          field: agg.getField()
        }
      }, {
        addToAggConfigs: false
      }));
    }

    return aggs;
  }

});

exports.getGeoHashBucketAgg = getGeoHashBucketAgg;