"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistogramBucketAgg = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _common = require("../../../../common");

var _bucket_agg_type = require("./bucket_agg_type");

var _histogram = require("./create_filter/histogram");

var _bucket_agg_types = require("./bucket_agg_types");

var _histogram_fn = require("./histogram_fn");

var _interval_options = require("./_interval_options");

var _histogram_calculate_interval = require("./lib/histogram_calculate_interval");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getHistogramBucketAgg = ({
  getConfig,
  getFieldFormatsStart
}) => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.HISTOGRAM,
  expressionName: _histogram_fn.aggHistogramFnName,
  title: _i18n.i18n.translate('data.search.aggs.buckets.histogramTitle', {
    defaultMessage: 'Histogram'
  }),
  ordered: {},

  makeLabel(aggConfig) {
    return aggConfig.getFieldDisplayName();
  },

  createFilter: (0, _histogram.createFilterHistogram)(getFieldFormatsStart),

  decorateAggConfig() {
    let autoBounds;
    return {
      setAutoBounds: {
        configurable: true,

        value(newValue) {
          autoBounds = newValue;
        }

      },
      getAutoBounds: {
        configurable: true,

        value() {
          return autoBounds;
        }

      }
    };
  },

  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: _common.KBN_FIELD_TYPES.NUMBER
  }, {
    /*
     * This parameter can be set if you want the auto scaled interval to always
     * be a multiple of a specific base.
     */
    name: 'intervalBase',
    default: null,
    write: () => {}
  }, {
    name: 'interval',
    default: _interval_options.autoInterval,

    modifyAggConfigOnSearchRequestStart(aggConfig, searchSource, options) {
      const field = aggConfig.getField();
      const aggBody = field.scripted ? {
        script: {
          source: field.script,
          lang: field.lang
        }
      } : {
        field: field.name
      };
      const childSearchSource = searchSource.createChild().setField('size', 0).setField('aggs', {
        maxAgg: {
          max: aggBody
        },
        minAgg: {
          min: aggBody
        }
      });
      return childSearchSource.fetch(options).then(resp => {
        var _resp$aggregations$mi, _resp$aggregations, _resp$aggregations$mi2, _resp$aggregations$ma, _resp$aggregations2, _resp$aggregations2$m;

        const min = (_resp$aggregations$mi = (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : (_resp$aggregations$mi2 = _resp$aggregations.minAgg) === null || _resp$aggregations$mi2 === void 0 ? void 0 : _resp$aggregations$mi2.value) !== null && _resp$aggregations$mi !== void 0 ? _resp$aggregations$mi : 0;
        const max = (_resp$aggregations$ma = (_resp$aggregations2 = resp.aggregations) === null || _resp$aggregations2 === void 0 ? void 0 : (_resp$aggregations2$m = _resp$aggregations2.maxAgg) === null || _resp$aggregations2$m === void 0 ? void 0 : _resp$aggregations2$m.value) !== null && _resp$aggregations$ma !== void 0 ? _resp$aggregations$ma : 0;
        aggConfig.setAutoBounds({
          min,
          max
        });
      }).catch(e => {
        if (e.name === 'AbortError') return;
        throw new Error(_i18n.i18n.translate('data.search.aggs.histogram.missingMaxMinValuesWarning', {
          defaultMessage: 'Unable to retrieve max and min values to auto-scale histogram buckets. This may lead to poor visualization performance.'
        }));
      });
    },

    write(aggConfig, output) {
      output.params.interval = calculateInterval(aggConfig, getConfig);
    }

  }, {
    name: 'used_interval',
    default: _interval_options.autoInterval,

    shouldShow() {
      return false;
    },

    write: () => {},

    serialize(val, aggConfig) {
      if (!aggConfig) return undefined; // store actually used auto interval in serialized agg config to be able to read it from the result data table meta information

      return calculateInterval(aggConfig, getConfig);
    },

    toExpressionAst: () => undefined
  }, {
    name: 'maxBars',

    shouldShow(agg) {
      return (0, _interval_options.isAutoInterval)((0, _lodash.get)(agg, 'params.interval'));
    },

    write: () => {}
  }, {
    name: 'min_doc_count',
    default: false,

    write(aggConfig, output) {
      if (aggConfig.params.min_doc_count) {
        output.params.min_doc_count = 0;
      } else {
        output.params.min_doc_count = 1;
      }
    }

  }, {
    name: 'has_extended_bounds',
    default: false,
    write: () => {}
  }, {
    name: 'extended_bounds',
    default: {
      min: '',
      max: ''
    },

    write(aggConfig, output) {
      const {
        min,
        max
      } = aggConfig.params.extended_bounds;

      if (aggConfig.params.has_extended_bounds && (min || min === 0) && (max || max === 0)) {
        output.params.extended_bounds = {
          min,
          max
        };
      }
    },

    shouldShow: aggConfig => aggConfig.params.has_extended_bounds
  }]
});

exports.getHistogramBucketAgg = getHistogramBucketAgg;

function calculateInterval(aggConfig, getConfig) {
  var _aggConfig$params$fie, _aggConfig$params$fie2;

  const values = aggConfig.getAutoBounds();
  return (0, _histogram_calculate_interval.calculateHistogramInterval)({
    values,
    interval: aggConfig.params.interval,
    maxBucketsUiSettings: getConfig(_common.UI_SETTINGS.HISTOGRAM_MAX_BARS),
    maxBucketsUserInput: aggConfig.params.maxBars,
    intervalBase: aggConfig.params.intervalBase,
    esTypes: ((_aggConfig$params$fie = aggConfig.params.field) === null || _aggConfig$params$fie === void 0 ? void 0 : (_aggConfig$params$fie2 = _aggConfig$params$fie.spec) === null || _aggConfig$params$fie2 === void 0 ? void 0 : _aggConfig$params$fie2.esTypes) || []
  });
}