"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertRequestToMetricsAPIOptions = void 0;

var _lodash = require("lodash");

var _http_api = require("../../../../common/http_api");

var _convert_metric_to_metrics_api_metric = require("./convert_metric_to_metrics_api_metric");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const convertRequestToMetricsAPIOptions = options => {
  const metrics = options.metrics.map(_convert_metric_to_metrics_api_metric.convertMetricToMetricsAPIMetric).filter(m => !!m);
  const {
    limit,
    timerange,
    indexPattern
  } = options;
  const metricsApiOptions = {
    timerange,
    indexPattern,
    limit,
    metrics,
    dropLastBucket: true
  };

  if (options.afterKey) {
    metricsApiOptions.afterKey = _http_api.afterKeyObjectRT.is(options.afterKey) ? options.afterKey : {
      groupBy0: options.afterKey
    };
  }

  if (options.groupBy) {
    metricsApiOptions.groupBy = (0, _lodash.isArray)(options.groupBy) ? options.groupBy : [options.groupBy];
  }

  if (options.filterQuery) {
    try {
      const filterObject = JSON.parse(options.filterQuery);

      if ((0, _lodash.isObject)(filterObject)) {
        metricsApiOptions.filters = [filterObject];
      }
    } catch (err) {
      metricsApiOptions.filters = [{
        query_string: {
          query: options.filterQuery,
          analyze_wildcard: true
        }
      }];
    }
  }

  return metricsApiOptions;
};

exports.convertRequestToMetricsAPIOptions = convertRequestToMetricsAPIOptions;