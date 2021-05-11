"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDetectionsMetrics = exports.fetchDetectionsUsage = exports.defaultDetectionsUsage = void 0;

var _detections_helpers = require("./detections_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultDetectionsUsage = {
  detection_rules: _detections_helpers.initialRulesUsage,
  ml_jobs: _detections_helpers.initialMlJobsUsage
};
exports.defaultDetectionsUsage = defaultDetectionsUsage;

const fetchDetectionsUsage = async (kibanaIndex, esClient, ml, savedObjectClient) => {
  const [rulesUsage, mlJobsUsage] = await Promise.allSettled([(0, _detections_helpers.getRulesUsage)(kibanaIndex, esClient), (0, _detections_helpers.getMlJobsUsage)(ml, savedObjectClient)]);
  return {
    detection_rules: rulesUsage.status === 'fulfilled' ? rulesUsage.value : _detections_helpers.initialRulesUsage,
    ml_jobs: mlJobsUsage.status === 'fulfilled' ? mlJobsUsage.value : _detections_helpers.initialMlJobsUsage
  };
};

exports.fetchDetectionsUsage = fetchDetectionsUsage;

const fetchDetectionsMetrics = async (ml, savedObjectClient) => {
  const [mlJobMetrics] = await Promise.allSettled([(0, _detections_helpers.getMlJobMetrics)(ml, savedObjectClient)]);
  return {
    ml_jobs: mlJobMetrics.status === 'fulfilled' ? mlJobMetrics.value : []
  };
};

exports.fetchDetectionsMetrics = fetchDetectionsMetrics;