"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaMetric = exports.KibanaEventsRateClusterMetric = exports.KibanaClusterMetric = void 0;

var _classes = require("../classes");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class KibanaClusterMetric extends _classes.ClusterMetric {
  constructor(opts) {
    super({ ...opts,
      app: 'kibana',
      ...KibanaClusterMetric.getMetricFields()
    });
  }

  static getMetricFields() {
    return {
      uuidField: 'cluster_uuid',
      timestampField: 'kibana_stats.timestamp'
    };
  }

}

exports.KibanaClusterMetric = KibanaClusterMetric;

class KibanaEventsRateClusterMetric extends KibanaClusterMetric {
  constructor(opts) {
    super({ ...opts,
      metricAgg: 'max'
    });
    this.aggs = {
      kibana_uuids: {
        terms: {
          field: 'kibana_stats.kibana.uuid',
          size: 1000
        },
        aggs: {
          event_rate_per_instance: {
            max: {
              field: this.field
            }
          }
        }
      },
      event_rate: {
        sum_bucket: {
          buckets_path: 'kibana_uuids>event_rate_per_instance',
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

exports.KibanaEventsRateClusterMetric = KibanaEventsRateClusterMetric;

class KibanaMetric extends _classes.Metric {
  constructor(opts) {
    super({ ...opts,
      app: 'kibana',
      ...KibanaMetric.getMetricFields()
    });
  }

  static getMetricFields() {
    return {
      uuidField: 'kibana_stats.kibana.uuid',
      timestampField: 'kibana_stats.timestamp'
    };
  }

}

exports.KibanaMetric = KibanaMetric;