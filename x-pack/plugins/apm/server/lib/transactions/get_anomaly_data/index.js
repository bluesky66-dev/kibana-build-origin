"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalySeries = getAnomalySeries;

var _lodash = require("lodash");

var _is_finite_number = require("../../../../common/utils/is_finite_number");

var _maybe2 = require("../../../../common/utils/maybe");

var _environment_filter_values = require("../../../../common/environment_filter_values");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _fetcher = require("./fetcher");

var _get_service_anomalies = require("../../service_map/get_service_anomalies");

var _common = require("../../../../../ml/common");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getAnomalySeries({
  environment,
  serviceName,
  transactionType,
  transactionName,
  setup,
  logger
}) {
  const {
    start,
    end,
    ml
  } = setup; // don't fetch anomalies if the ML plugin is not setup

  if (!ml) {
    return undefined;
  } // don't fetch anomalies if requested for a specific transaction name
  // as ML results are not partitioned by transaction name


  if (!!transactionName) {
    return undefined;
  } // don't fetch anomalies when no specific environment is selected


  if (!environment || environment === _environment_filter_values.ENVIRONMENT_ALL.value) {
    return undefined;
  } // Don't fetch anomalies if uiFilters are applied. This filters out anything
  // with empty values so `kuery: ''` returns false but `kuery: 'x:y'` returns true.


  const hasUiFiltersApplied = Object.entries(setup.uiFilters).filter(([_key, value]) => !!value).length > 0;

  if (hasUiFiltersApplied) {
    return undefined;
  }

  return (0, _with_apm_span.withApmSpan)('get_latency_anomaly_series', async () => {
    var _anomaliesResponse$ag, _scoreSeriesCollectio;

    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)({
      start,
      end
    }); // move the start back with one bucket size, to ensure to get anomaly data in the beginning
    // this is required because ML has a minimum bucket size (default is 900s) so if our buckets
    // are smaller, we might have several null buckets in the beginning

    const mlStart = start - 900 * 1000;
    const [anomaliesResponse, jobIds] = await Promise.all([(0, _fetcher.anomalySeriesFetcher)({
      serviceName,
      transactionType,
      intervalString,
      ml,
      start: mlStart,
      end
    }), (0, _get_service_anomalies.getMLJobIds)(ml.anomalyDetectors, environment)]);
    const scoreSeriesCollection = anomaliesResponse === null || anomaliesResponse === void 0 ? void 0 : (_anomaliesResponse$ag = anomaliesResponse.aggregations) === null || _anomaliesResponse$ag === void 0 ? void 0 : _anomaliesResponse$ag.job_id.buckets.filter(bucket => jobIds.includes(bucket.key)).map(bucket => {
      const dateBuckets = bucket.ml_avg_response_times.buckets;
      return {
        jobId: bucket.key,
        anomalyScore: (0, _lodash.compact)(dateBuckets.map(dateBucket => {
          var _maybe;

          const metrics = (_maybe = (0, _maybe2.maybe)(dateBucket.anomaly_score.top[0])) === null || _maybe === void 0 ? void 0 : _maybe.metrics;
          const score = metrics === null || metrics === void 0 ? void 0 : metrics.record_score;

          if (!metrics || !(0, _is_finite_number.isFiniteNumber)(score) || score < _common.ANOMALY_THRESHOLD.CRITICAL) {
            return null;
          }

          const anomalyStart = Date.parse(metrics.timestamp);
          const anomalyEnd = anomalyStart + metrics.bucket_span * 1000;
          return {
            x0: anomalyStart,
            x: anomalyEnd,
            y: score
          };
        })),
        anomalyBoundaries: dateBuckets.filter(dateBucket => dateBucket.lower.value !== null && dateBucket.upper.value !== null).map(dateBucket => ({
          x: dateBucket.key,
          y0: dateBucket.lower.value,
          y: dateBucket.upper.value
        }))
      };
    });

    if (((_scoreSeriesCollectio = scoreSeriesCollection === null || scoreSeriesCollection === void 0 ? void 0 : scoreSeriesCollection.length) !== null && _scoreSeriesCollectio !== void 0 ? _scoreSeriesCollectio : 0) > 1) {
      logger.warn(`More than one ML job was found for ${serviceName} for environment ${environment}. Only showing results from ${scoreSeriesCollection === null || scoreSeriesCollection === void 0 ? void 0 : scoreSeriesCollection[0].jobId}`);
    }

    return scoreSeriesCollection === null || scoreSeriesCollection === void 0 ? void 0 : scoreSeriesCollection[0];
  });
}