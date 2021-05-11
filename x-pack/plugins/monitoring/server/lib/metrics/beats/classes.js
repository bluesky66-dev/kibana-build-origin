"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BeatsCpuUtilizationMetric = exports.BeatsByteRateMetric = exports.BeatsEventsRateMetric = exports.BeatsByteRateClusterMetric = exports.BeatsMetric = exports.BeatsEventsRateClusterMetric = exports.BeatsClusterMetric = void 0;

var _classes = require("../classes");

var _formatting = require("../../../../common/formatting");

var _constants = require("../../../../common/constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const perSecondUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.beats.perSecondUnitLabel', {
  defaultMessage: '/s'
});

class BeatsClusterMetric extends _classes.ClusterMetric {
  constructor(opts) {
    super({ ...opts,
      app: 'beats',
      ...BeatsClusterMetric.getMetricFields()
    });
  }

  static getMetricFields() {
    return {
      uuidField: 'beats_stats.beat.uuid',
      timestampField: 'beats_stats.timestamp'
    };
  }

}

exports.BeatsClusterMetric = BeatsClusterMetric;

class BeatsEventsRateClusterMetric extends BeatsClusterMetric {
  constructor(opts) {
    super({ ...opts,
      derivative: true,
      format: _formatting.LARGE_FLOAT,
      metricAgg: 'max',
      units: perSecondUnitLabel
    });
    this.aggs = {
      beats_uuids: {
        terms: {
          field: 'beats_stats.beat.uuid',
          size: 10000
        },
        aggs: {
          event_rate_per_beat: {
            max: {
              field: this.field
            }
          }
        }
      },
      event_rate: {
        sum_bucket: {
          buckets_path: 'beats_uuids>event_rate_per_beat',
          gap_policy: 'skip'
        }
      },
      metric_deriv: {
        derivative: {
          buckets_path: 'event_rate',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      }
    };
  }

}

exports.BeatsEventsRateClusterMetric = BeatsEventsRateClusterMetric;

class BeatsMetric extends _classes.Metric {
  constructor(opts) {
    super({ ...opts,
      app: 'beats',
      ...BeatsMetric.getMetricFields()
    });
  }

  static getMetricFields() {
    return {
      uuidField: 'beats_stats.beat.uuid',
      timestampField: 'beats_stats.timestamp'
    };
  }

}

exports.BeatsMetric = BeatsMetric;

class BeatsByteRateClusterMetric extends BeatsEventsRateClusterMetric {
  constructor(opts) {
    super({ ...opts,
      format: _formatting.LARGE_BYTES
    });
  }

}

exports.BeatsByteRateClusterMetric = BeatsByteRateClusterMetric;

class BeatsEventsRateMetric extends BeatsMetric {
  constructor(opts) {
    super({ ...opts,
      format: _formatting.LARGE_FLOAT,
      metricAgg: 'max',
      units: perSecondUnitLabel,
      derivative: true
    });
  }

}

exports.BeatsEventsRateMetric = BeatsEventsRateMetric;

class BeatsByteRateMetric extends BeatsMetric {
  constructor(opts) {
    super({ ...opts,
      format: _formatting.LARGE_BYTES,
      metricAgg: 'max',
      units: perSecondUnitLabel,
      derivative: true
    });
  }

}

exports.BeatsByteRateMetric = BeatsByteRateMetric;

class BeatsCpuUtilizationMetric extends BeatsMetric {
  constructor(opts) {
    super({ ...opts,
      format: _formatting.SMALL_FLOAT,
      metricAgg: 'max',
      units: '%',
      derivative: true
    });
    /*
     * Convert a counter of milliseconds of utilization time into a percentage of the bucket size
     */

    this.calculation = ({
      metric_deriv: metricDeriv
    } = {}, _key, _metric, bucketSizeInSeconds) => {
      if (metricDeriv) {
        const {
          value
        } = metricDeriv;
        const bucketSizeInMillis = bucketSizeInSeconds * 1000;

        if (value >= 0 && value !== null) {
          return value / bucketSizeInMillis * 100;
        }
      }

      return null;
    };
  }

}

exports.BeatsCpuUtilizationMetric = BeatsCpuUtilizationMetric;