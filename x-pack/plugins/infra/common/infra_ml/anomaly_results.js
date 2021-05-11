"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareDatasetsByMaximumAnomalyScore = exports.getFriendlyNameForPartitionId = exports.formatOneDecimalPlace = exports.formatAnomalyScore = exports.getSeverityCategoryForScore = exports.SEVERITY_COLORS = exports.ANOMALY_THRESHOLD = exports.ANOMALY_SEVERITY = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let ANOMALY_SEVERITY;
exports.ANOMALY_SEVERITY = ANOMALY_SEVERITY;

(function (ANOMALY_SEVERITY) {
  ANOMALY_SEVERITY["CRITICAL"] = "critical";
  ANOMALY_SEVERITY["MAJOR"] = "major";
  ANOMALY_SEVERITY["MINOR"] = "minor";
  ANOMALY_SEVERITY["WARNING"] = "warning";
  ANOMALY_SEVERITY["LOW"] = "low";
  ANOMALY_SEVERITY["UNKNOWN"] = "unknown";
})(ANOMALY_SEVERITY || (exports.ANOMALY_SEVERITY = ANOMALY_SEVERITY = {}));

let ANOMALY_THRESHOLD;
exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD;

(function (ANOMALY_THRESHOLD) {
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["CRITICAL"] = 75] = "CRITICAL";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MAJOR"] = 50] = "MAJOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MINOR"] = 25] = "MINOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["WARNING"] = 3] = "WARNING";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["LOW"] = 0] = "LOW";
})(ANOMALY_THRESHOLD || (exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD = {}));

const SEVERITY_COLORS = {
  CRITICAL: '#fe5050',
  MAJOR: '#fba740',
  MINOR: '#fdec25',
  WARNING: '#8bc8fb',
  LOW: '#d2e9f7',
  BLANK: '#ffffff'
};
exports.SEVERITY_COLORS = SEVERITY_COLORS;

const getSeverityCategoryForScore = score => {
  if (score >= ANOMALY_THRESHOLD.CRITICAL) {
    return ANOMALY_SEVERITY.CRITICAL;
  } else if (score >= ANOMALY_THRESHOLD.MAJOR) {
    return ANOMALY_SEVERITY.MAJOR;
  } else if (score >= ANOMALY_THRESHOLD.MINOR) {
    return ANOMALY_SEVERITY.MINOR;
  } else if (score >= ANOMALY_THRESHOLD.WARNING) {
    return ANOMALY_SEVERITY.WARNING;
  } else {
    // Category is too low to include
    return ANOMALY_SEVERITY.LOW;
  }
};

exports.getSeverityCategoryForScore = getSeverityCategoryForScore;

const formatAnomalyScore = score => {
  return Math.round(score);
};

exports.formatAnomalyScore = formatAnomalyScore;

const formatOneDecimalPlace = number => {
  return Math.round(number * 10) / 10;
};

exports.formatOneDecimalPlace = formatOneDecimalPlace;

const getFriendlyNameForPartitionId = partitionId => {
  return partitionId !== '' ? partitionId : 'unknown';
};

exports.getFriendlyNameForPartitionId = getFriendlyNameForPartitionId;

const compareDatasetsByMaximumAnomalyScore = (firstDataset, secondDataset) => firstDataset.maximumAnomalyScore - secondDataset.maximumAnomalyScore;

exports.compareDatasetsByMaximumAnomalyScore = compareDatasetsByMaximumAnomalyScore;