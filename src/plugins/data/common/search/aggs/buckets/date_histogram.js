"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDateHistogramBucketAggConfig = isDateHistogramBucketAggConfig;
exports.getDateHistogramBucketAgg = void 0;

var _lodash = require("lodash");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _i18n = require("@kbn/i18n");

var _common = require("../../../../common");

var _interval_options = require("./_interval_options");

var _date_histogram = require("./create_filter/date_histogram");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _date_histogram_fn = require("./date_histogram_fn");

var _time_buckets = require("./lib/time_buckets");

var _agg_params = require("../agg_params");

var _metric_agg_type = require("../metrics/metric_agg_type");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const updateTimeBuckets = (agg, calculateBounds, customBuckets) => {
  const bounds = agg.params.timeRange && (agg.fieldIsTimeField() || (0, _interval_options.isAutoInterval)(agg.params.interval)) ? calculateBounds(agg.params.timeRange) : undefined;
  const buckets = customBuckets || agg.buckets;
  buckets.setBounds(bounds);
  buckets.setInterval(agg.params.interval);
};

function isDateHistogramBucketAggConfig(agg) {
  return Boolean(agg.buckets);
}

const getDateHistogramBucketAgg = ({
  calculateBounds,
  isDefaultTimezone,
  getConfig
}) => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.DATE_HISTOGRAM,
  expressionName: _date_histogram_fn.aggDateHistogramFnName,
  title: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogramTitle', {
    defaultMessage: 'Date Histogram'
  }),
  ordered: {
    date: true
  },

  makeLabel(agg) {
    let output = {};

    if (this.params) {
      output = (0, _agg_params.writeParams)(this.params, agg);
    }

    const field = agg.getFieldDisplayName();
    return _i18n.i18n.translate('data.search.aggs.buckets.dateHistogramLabel', {
      defaultMessage: '{fieldName} per {intervalDescription}',
      values: {
        fieldName: field,
        intervalDescription: output.metricScaleText || output.bucketInterval.description
      }
    });
  },

  createFilter: _date_histogram.createFilterDateHistogram,

  decorateAggConfig() {
    let buckets;
    return {
      buckets: {
        configurable: true,

        get() {
          if (buckets) return buckets;
          buckets = new _time_buckets.TimeBuckets({
            'histogram:maxBars': getConfig(_common.UI_SETTINGS.HISTOGRAM_MAX_BARS),
            'histogram:barTarget': getConfig(_common.UI_SETTINGS.HISTOGRAM_BAR_TARGET),
            dateFormat: getConfig('dateFormat'),
            'dateFormat:scaled': getConfig('dateFormat:scaled')
          });
          updateTimeBuckets(this, calculateBounds, buckets);
          return buckets;
        }

      }
    };
  },

  getSerializedFormat(agg) {
    return {
      id: 'date',
      params: {
        pattern: agg.buckets.getScaledDateFormat()
      }
    };
  },

  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: _common.KBN_FIELD_TYPES.DATE,

    default(agg) {
      var _agg$getIndexPattern$, _agg$getIndexPattern, _agg$getIndexPattern$2;

      return (_agg$getIndexPattern$ = (_agg$getIndexPattern = agg.getIndexPattern()).getTimeField) === null || _agg$getIndexPattern$ === void 0 ? void 0 : (_agg$getIndexPattern$2 = _agg$getIndexPattern$.call(_agg$getIndexPattern)) === null || _agg$getIndexPattern$2 === void 0 ? void 0 : _agg$getIndexPattern$2.name;
    },

    onChange(agg) {
      if ((0, _interval_options.isAutoInterval)((0, _lodash.get)(agg, 'params.interval')) && !agg.fieldIsTimeField()) {
        delete agg.params.interval;
      }
    }

  }, {
    name: 'timeRange',
    default: null,
    write: _lodash.noop
  }, {
    name: 'useNormalizedEsInterval',
    default: true,
    write: _lodash.noop
  }, {
    name: 'scaleMetricValues',
    default: false,
    write: _lodash.noop,
    advanced: true
  }, {
    name: 'interval',

    deserialize(state, agg) {
      // For upgrading from 7.0.x to 7.1.x - intervals are now stored as key of options or custom value
      if (state === 'custom') {
        return (0, _lodash.get)(agg, 'params.customInterval');
      }

      const interval = (0, _lodash.find)(_interval_options.intervalOptions, {
        val: state
      }); // For upgrading from 4.0.x to 4.1.x - intervals are now stored as 'y' instead of 'year',
      // but this maps the old values to the new values

      if (!interval && state === 'year') {
        return 'y';
      }

      return state;
    },

    default: _interval_options.autoInterval,
    options: _interval_options.intervalOptions,

    write(agg, output, aggs) {
      updateTimeBuckets(agg, calculateBounds);
      const {
        useNormalizedEsInterval,
        scaleMetricValues
      } = agg.params;
      const interval = agg.buckets.getInterval(useNormalizedEsInterval);
      output.bucketInterval = interval;

      if (interval.expression === '0ms') {
        // We are hitting this code a couple of times while configuring in editor
        // with an interval of 0ms because the overall time range has not yet been
        // set. Since 0ms is not a valid ES interval, we cannot pass it through dateHistogramInterval
        // below, since it would throw an exception. So in the cases we still have an interval of 0ms
        // here we simply skip the rest of the method and never write an interval into the DSL, since
        // this DSL will anyway not be used before we're passing this code with an actual interval.
        return;
      }

      output.params = { ...output.params,
        ...(0, _utils.dateHistogramInterval)(interval.expression)
      };
      const scaleMetrics = scaleMetricValues && interval.scaled && interval.scale && interval.scale < 1;

      if (scaleMetrics && aggs) {
        const metrics = aggs.aggs.filter(a => (0, _metric_agg_type.isMetricAggType)(a.type));
        const all = (0, _lodash.every)(metrics, a => {
          const {
            type
          } = a;

          if ((0, _metric_agg_type.isMetricAggType)(type)) {
            return type.isScalable();
          }
        });

        if (all) {
          var _interval$preScaled;

          output.metricScale = interval.scale;
          output.metricScaleText = ((_interval$preScaled = interval.preScaled) === null || _interval$preScaled === void 0 ? void 0 : _interval$preScaled.description) || '';
        }
      }
    }

  }, {
    name: 'time_zone',
    default: undefined,
    // We don't ever want this parameter to be serialized out (when saving or to URLs)
    // since we do all the logic handling it "on the fly" in the `write` method, to prevent
    // time_zones being persisted into saved_objects
    serialize: _lodash.noop,

    write(agg, output) {
      const tz = (0, _utils.inferTimeZone)(agg.params, agg.getIndexPattern(), isDefaultTimezone, getConfig);
      output.params.time_zone = tz;
    }

  }, {
    name: 'drop_partials',
    default: false,
    write: _lodash.noop,
    shouldShow: agg => {
      const field = agg.params.field;
      return field && field.name && field.name === agg.getIndexPattern().timeFieldName;
    }
  }, {
    name: 'format'
  }, {
    name: 'min_doc_count',
    default: 1
  }, {
    name: 'extended_bounds',
    default: {},

    write(agg, output) {
      const val = agg.params.extended_bounds;

      if (val.min != null || val.max != null) {
        output.params.extended_bounds = {
          min: (0, _momentTimezone.default)(val.min).valueOf(),
          max: (0, _momentTimezone.default)(val.max).valueOf()
        };
        return;
      }
    }

  }]
});

exports.getDateHistogramBucketAgg = getDateHistogramBucketAgg;