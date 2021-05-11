"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoCentroidMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _geo_centroid_fn = require("./geo_centroid_fn");

var _metric_agg_type = require("./metric_agg_type");

var _metric_agg_types = require("./metric_agg_types");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const geoCentroidTitle = _i18n.i18n.translate('data.search.aggs.metrics.geoCentroidTitle', {
  defaultMessage: 'Geo Centroid'
});

const geoCentroidLabel = _i18n.i18n.translate('data.search.aggs.metrics.geoCentroidLabel', {
  defaultMessage: 'Geo Centroid'
});

const getGeoCentroidMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.GEO_CENTROID,
    expressionName: _geo_centroid_fn.aggGeoCentroidFnName,
    title: geoCentroidTitle,
    makeLabel: () => geoCentroidLabel,
    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: _common.KBN_FIELD_TYPES.GEO_POINT
    }],

    getValue(agg, bucket) {
      return bucket[agg.id] && bucket[agg.id].location;
    }

  });
};

exports.getGeoCentroidMetricAgg = getGeoCentroidMetricAgg;