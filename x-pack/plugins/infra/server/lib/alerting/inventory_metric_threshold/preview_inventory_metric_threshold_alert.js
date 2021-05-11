"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewInventoryMetricThresholdAlert = void 0;

var _lodash = require("lodash");

var _metrics = require("../../../../common/alerting/metrics");

var _get_interval_in_seconds = require("../../../utils/get_interval_in_seconds");

var _evaluate_condition = require("./evaluate_condition");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const previewInventoryMetricThresholdAlert = async ({
  callCluster,
  params,
  source,
  lookback,
  alertInterval,
  alertThrottle,
  alertOnNoData,
  alertNotifyWhen
}) => {
  const {
    criteria,
    filterQuery,
    nodeType
  } = params;
  if (criteria.length === 0) throw new Error('Cannot execute an alert with 0 conditions');
  const {
    timeSize,
    timeUnit
  } = criteria[0];
  const bucketInterval = `${timeSize}${timeUnit}`;
  const bucketIntervalInSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(bucketInterval);
  const lookbackInterval = `1${lookback}`;
  const lookbackIntervalInSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(lookbackInterval);
  const lookbackSize = Math.ceil(lookbackIntervalInSeconds / bucketIntervalInSeconds);
  const alertIntervalInSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(alertInterval);
  const alertResultsPerExecution = alertIntervalInSeconds / bucketIntervalInSeconds;
  const throttleIntervalInSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(alertThrottle);

  try {
    const results = await Promise.all(criteria.map(c => (0, _evaluate_condition.evaluateCondition)(c, nodeType, source, callCluster, filterQuery, lookbackSize)));
    const inventoryItems = Object.keys((0, _lodash.first)(results));
    const previewResults = inventoryItems.map(item => {
      const numberOfResultBuckets = lookbackSize;
      const numberOfExecutionBuckets = Math.floor(numberOfResultBuckets / alertResultsPerExecution);
      let numberOfTimesFired = 0;
      let numberOfTimesWarned = 0;
      let numberOfNoDataResults = 0;
      let numberOfErrors = 0;
      let numberOfNotifications = 0;
      let throttleTracker = 0;
      let previousActionGroup = null;

      const notifyWithThrottle = actionGroup => {
        if (alertNotifyWhen === 'onActionGroupChange') {
          if (previousActionGroup !== actionGroup) numberOfNotifications++;
        } else if (alertNotifyWhen === 'onThrottleInterval') {
          if (throttleTracker === 0) numberOfNotifications++;
          throttleTracker += alertIntervalInSeconds;
        } else {
          numberOfNotifications++;
        }

        previousActionGroup = actionGroup;
      };

      for (let i = 0; i < numberOfExecutionBuckets; i++) {
        const mappedBucketIndex = Math.floor(i * alertResultsPerExecution);
        const allConditionsFiredInMappedBucket = results.every(result => {
          const shouldFire = result[item].shouldFire;
          return shouldFire[mappedBucketIndex];
        });
        const allConditionsWarnInMappedBucket = !allConditionsFiredInMappedBucket && results.every(result => result[item].shouldWarn[mappedBucketIndex]);
        const someConditionsNoDataInMappedBucket = results.some(result => {
          const hasNoData = result[item].isNoData;
          return hasNoData[mappedBucketIndex];
        });
        const someConditionsErrorInMappedBucket = results.some(result => {
          return result[item].isError;
        });

        if (someConditionsErrorInMappedBucket) {
          numberOfErrors++;

          if (alertOnNoData) {
            notifyWithThrottle('fired'); // TODO: Update this when No Data alerts move to an action group
          }
        } else if (someConditionsNoDataInMappedBucket) {
          numberOfNoDataResults++;

          if (alertOnNoData) {
            notifyWithThrottle('fired'); // TODO: Update this when No Data alerts move to an action group
          }
        } else if (allConditionsFiredInMappedBucket) {
          numberOfTimesFired++;
          notifyWithThrottle('fired');
        } else if (allConditionsWarnInMappedBucket) {
          numberOfTimesWarned++;
          notifyWithThrottle('warning');
        } else {
          previousActionGroup = 'recovered';

          if (throttleTracker > 0) {
            throttleTracker += alertIntervalInSeconds;
          }
        }

        if (throttleTracker >= throttleIntervalInSeconds) {
          throttleTracker = 0;
        }
      }

      return {
        fired: numberOfTimesFired,
        warning: numberOfTimesWarned,
        noData: numberOfNoDataResults,
        error: numberOfErrors,
        notifications: numberOfNotifications
      };
    });
    return previewResults;
  } catch (e) {
    if (!(0, _metrics.isTooManyBucketsPreviewException)(e)) throw e;
    const {
      maxBuckets
    } = e;
    throw new Error(`${_metrics.TOO_MANY_BUCKETS_PREVIEW_EXCEPTION}:${maxBuckets}`);
  }
};

exports.previewInventoryMetricThresholdAlert = previewInventoryMetricThresholdAlert;