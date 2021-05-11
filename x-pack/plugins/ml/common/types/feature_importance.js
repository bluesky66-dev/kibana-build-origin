"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClassificationTotalFeatureImportance = isClassificationTotalFeatureImportance;
exports.isRegressionTotalFeatureImportance = isRegressionTotalFeatureImportance;
exports.isClassificationFeatureImportanceBaseline = isClassificationFeatureImportanceBaseline;
exports.isRegressionFeatureImportanceBaseline = isRegressionFeatureImportanceBaseline;

var _object_utils = require("../util/object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isClassificationTotalFeatureImportance(summary) {
  return summary.classes !== undefined;
}

function isRegressionTotalFeatureImportance(summary) {
  return summary.importance !== undefined;
}

function isClassificationFeatureImportanceBaseline(baselineData) {
  return (0, _object_utils.isPopulatedObject)(baselineData) && baselineData.hasOwnProperty('classes') && Array.isArray(baselineData.classes);
}

function isRegressionFeatureImportanceBaseline(baselineData) {
  return (0, _object_utils.isPopulatedObject)(baselineData) && baselineData.hasOwnProperty('baseline');
}