"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoTitleBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _geo_tile_fn = require("./geo_tile_fn");

var _common = require("../../../../common");

var _metric_agg_types = require("../metrics/metric_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const geotileGridTitle = _i18n.i18n.translate('data.search.aggs.buckets.geotileGridTitle', {
  defaultMessage: 'Geotile'
});

const getGeoTitleBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.GEOTILE_GRID,
  expressionName: _geo_tile_fn.aggGeoTileFnName,
  title: geotileGridTitle,
  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: _common.KBN_FIELD_TYPES.GEO_POINT
  }, {
    name: 'useGeocentroid',
    default: true,
    write: _lodash.noop
  }, {
    name: 'precision',
    default: 0
  }],

  getRequestAggs(agg) {
    const aggs = [];
    const useGeocentroid = agg.getParam('useGeocentroid');
    aggs.push(agg);

    if (useGeocentroid) {
      const aggConfig = {
        type: _metric_agg_types.METRIC_TYPES.GEO_CENTROID,
        enabled: true,
        params: {
          field: agg.getField()
        }
      };
      aggs.push(agg.aggConfigs.createAggConfig(aggConfig, {
        addToAggConfigs: false
      }));
    }

    return aggs;
  }

});

exports.getGeoTitleBucketAgg = getGeoTitleBucketAgg;