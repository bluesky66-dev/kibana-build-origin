"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parentPipelineAggHelper = exports.parentPipelineType = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _nested_agg_helpers = require("./nested_agg_helpers");

var _parent_pipeline_agg_writer = require("./parent_pipeline_agg_writer");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const metricAggFilter = ['!top_hits', '!percentiles', '!percentile_ranks', '!median', '!std_dev', '!geo_bounds', '!geo_centroid'];

const parentPipelineType = _i18n.i18n.translate('data.search.aggs.metrics.parentPipelineAggregationsSubtypeTitle', {
  defaultMessage: 'Parent Pipeline Aggregations'
});

exports.parentPipelineType = parentPipelineType;
const parentPipelineAggHelper = {
  subtype: parentPipelineType,

  params() {
    return [{
      name: 'metricAgg',
      default: 'custom',
      write: _parent_pipeline_agg_writer.parentPipelineAggWriter
    }, {
      name: 'customMetric',
      type: 'agg',
      allowedAggs: metricAggFilter,

      makeAgg(termsAgg, state = {
        type: 'count'
      }) {
        const metricAgg = termsAgg.aggConfigs.createAggConfig(state, {
          addToAggConfigs: false
        });
        metricAgg.id = termsAgg.id + '-metric';
        return metricAgg;
      },

      modifyAggConfigOnSearchRequestStart: (0, _nested_agg_helpers.forwardModifyAggConfigOnSearchRequestStart)('customMetric'),
      write: _lodash.noop
    }, {
      name: 'buckets_path',
      write: _lodash.noop
    }];
  },

  getSerializedFormat(agg) {
    let subAgg;
    const customMetric = agg.getParam('customMetric');

    if (customMetric) {
      subAgg = customMetric;
    } else {
      subAgg = agg.aggConfigs.byId(agg.getParam('metricAgg'));
    }

    return subAgg ? subAgg.type.getSerializedFormat(subAgg) : {};
  }

};
exports.parentPipelineAggHelper = parentPipelineAggHelper;