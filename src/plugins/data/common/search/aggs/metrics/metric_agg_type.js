"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMetricAggType = isMetricAggType;
exports.MetricAggType = void 0;

var _i18n = require("@kbn/i18n");

var _agg_type = require("../agg_type");

var _metric_agg_types = require("./metric_agg_types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const metricType = 'metrics';

class MetricAggType extends _agg_type.AggType {
  constructor(config) {
    super(config);

    _defineProperty(this, "subtype", void 0);

    _defineProperty(this, "isScalable", void 0);

    _defineProperty(this, "type", metricType);

    _defineProperty(this, "getKey", () => {});

    this.getValue = config.getValue || ((agg, bucket) => {
      // Metric types where an empty set equals `zero`
      const isSettableToZero = [_metric_agg_types.METRIC_TYPES.CARDINALITY, _metric_agg_types.METRIC_TYPES.SUM].includes(agg.type.name); // Return proper values when no buckets are present
      // `Count` handles empty sets properly

      if (!bucket[agg.id] && isSettableToZero) return 0;
      return bucket[agg.id] && bucket[agg.id].value;
    });

    this.subtype = config.subtype || _i18n.i18n.translate('data.search.aggs.metrics.metricAggregationsSubtypeTitle', {
      defaultMessage: 'Metric Aggregations'
    });

    this.isScalable = config.isScalable || (() => false);
  }

}

exports.MetricAggType = MetricAggType;

function isMetricAggType(aggConfig) {
  return aggConfig && aggConfig.type === metricType;
}