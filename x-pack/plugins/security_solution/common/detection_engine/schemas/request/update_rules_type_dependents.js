"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRuleValidateTypeDependents = exports.validateId = exports.validateTimelineTitle = exports.validateTimelineId = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

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

const validateId = rule => {
  if (rule.id != null && rule.rule_id != null) {
    return ['both "id" and "rule_id" cannot exist, choose one or the other'];
  } else if (rule.id == null && rule.rule_id == null) {
    return ['either "id" or "rule_id" must be set'];
  } else {
    return [];
  }
};

exports.validateId = validateId;

const updateRuleValidateTypeDependents = schema => {
  return [...validateId(schema), ...validateTimelineId(schema), ...validateTimelineTitle(schema)];
};

exports.updateRuleValidateTypeDependents = updateRuleValidateTypeDependents;