"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnalysisType = exports.getPredictedFieldName = exports.getDefaultPredictionFieldName = exports.getPredictionFieldName = exports.getDependentVar = exports.isClassificationAnalysis = exports.isRegressionAnalysis = exports.isOutlierAnalysis = void 0;

var _data_frame_analytics = require("../constants/data_frame_analytics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isOutlierAnalysis = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length === 1 && keys[0] === _data_frame_analytics.ANALYSIS_CONFIG_TYPE.OUTLIER_DETECTION;
};

exports.isOutlierAnalysis = isOutlierAnalysis;

const isRegressionAnalysis = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length === 1 && keys[0] === _data_frame_analytics.ANALYSIS_CONFIG_TYPE.REGRESSION;
};

exports.isRegressionAnalysis = isRegressionAnalysis;

const isClassificationAnalysis = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length === 1 && keys[0] === _data_frame_analytics.ANALYSIS_CONFIG_TYPE.CLASSIFICATION;
};

exports.isClassificationAnalysis = isClassificationAnalysis;

const getDependentVar = analysis => {
  let depVar = '';

  if (isRegressionAnalysis(analysis)) {
    depVar = analysis.regression.dependent_variable;
  }

  if (isClassificationAnalysis(analysis)) {
    depVar = analysis.classification.dependent_variable;
  }

  return depVar;
};

exports.getDependentVar = getDependentVar;

const getPredictionFieldName = analysis => {
  // If undefined will be defaulted to dependent_variable when config is created
  let predictionFieldName;

  if (isRegressionAnalysis(analysis) && analysis.regression.prediction_field_name !== undefined) {
    predictionFieldName = analysis.regression.prediction_field_name;
  } else if (isClassificationAnalysis(analysis) && analysis.classification.prediction_field_name !== undefined) {
    predictionFieldName = analysis.classification.prediction_field_name;
  }

  return predictionFieldName;
};

exports.getPredictionFieldName = getPredictionFieldName;

const getDefaultPredictionFieldName = analysis => {
  return `${getDependentVar(analysis)}_prediction`;
};

exports.getDefaultPredictionFieldName = getDefaultPredictionFieldName;

const getPredictedFieldName = (resultsField, analysis, forSort) => {
  // default is 'ml'
  const predictionFieldName = getPredictionFieldName(analysis);
  const predictedField = `${resultsField}.${predictionFieldName ? predictionFieldName : getDefaultPredictionFieldName(analysis)}`;
  return predictedField;
};

exports.getPredictedFieldName = getPredictedFieldName;

const getAnalysisType = analysis => {
  const keys = Object.keys(analysis || {});

  if (keys.length === 1) {
    return keys[0];
  }

  return 'unknown';
};

exports.getAnalysisType = getAnalysisType;