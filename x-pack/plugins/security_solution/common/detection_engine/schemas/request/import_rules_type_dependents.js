"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importRuleValidateTypeDependents = exports.validateThreshold = exports.validateTimelineTitle = exports.validateTimelineId = exports.validateMachineLearningJobId = exports.validateSavedId = exports.validateLanguage = exports.validateQuery = exports.validateAnomalyThreshold = void 0;

var _helpers = require("../../../machine_learning/helpers");

var _utils = require("../../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const validateAnomalyThreshold = rule => {
  if ((0, _helpers.isMlRule)(rule.type)) {
    if (rule.anomaly_threshold == null) {
      return ['when "type" is "machine_learning" anomaly_threshold is required'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

exports.validateAnomalyThreshold = validateAnomalyThreshold;

const validateQuery = rule => {
  if ((0, _helpers.isMlRule)(rule.type)) {
    if (rule.query != null) {
      return ['when "type" is "machine_learning", "query" cannot be set'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

exports.validateQuery = validateQuery;

const validateLanguage = rule => {
  if ((0, _helpers.isMlRule)(rule.type)) {
    if (rule.language != null) {
      return ['when "type" is "machine_learning", "language" cannot be set'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

exports.validateLanguage = validateLanguage;

const validateSavedId = rule => {
  if (rule.type === 'saved_query') {
    if (rule.saved_id == null) {
      return ['when "type" is "saved_query", "saved_id" is required'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

exports.validateSavedId = validateSavedId;

const validateMachineLearningJobId = rule => {
  if ((0, _helpers.isMlRule)(rule.type)) {
    if (rule.machine_learning_job_id == null) {
      return ['when "type" is "machine_learning", "machine_learning_job_id" is required'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

exports.validateMachineLearningJobId = validateMachineLearningJobId;

const validateTimelineId = rule => {
  if (rule.timeline_id != null) {
    if (rule.timeline_title == null) {
      return ['when "timeline_id" exists, "timeline_title" must also exist'];
    } else if (rule.timeline_id === '') {
      return ['"timeline_id" cannot be an empty string'];
    } else {
      return [];
    }
  }

  return [];
};

exports.validateTimelineId = validateTimelineId;

const validateTimelineTitle = rule => {
  if (rule.timeline_title != null) {
    if (rule.timeline_id == null) {
      return ['when "timeline_title" exists, "timeline_id" must also exist'];
    } else if (rule.timeline_title === '') {
      return ['"timeline_title" cannot be an empty string'];
    } else {
      return [];
    }
  }

  return [];
};

exports.validateTimelineTitle = validateTimelineTitle;

const validateThreshold = rule => {
  if ((0, _utils.isThresholdRule)(rule.type)) {
    if (!rule.threshold) {
      return ['when "type" is "threshold", "threshold" is required'];
    } else if (rule.threshold.value <= 0) {
      return ['"threshold.value" has to be bigger than 0'];
    } else {
      return [];
    }
  }

  return [];
};

exports.validateThreshold = validateThreshold;

const importRuleValidateTypeDependents = schema => {
  return [...validateAnomalyThreshold(schema), ...validateQuery(schema), ...validateLanguage(schema), ...validateSavedId(schema), ...validateMachineLearningJobId(schema), ...validateTimelineId(schema), ...validateTimelineTitle(schema), ...validateThreshold(schema)];
};

exports.importRuleValidateTypeDependents = importRuleValidateTypeDependents;