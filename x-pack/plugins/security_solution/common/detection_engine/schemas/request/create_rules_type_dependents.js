"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleValidateTypeDependents = exports.validateThreatMapping = exports.validateTimelineTitle = exports.validateTimelineId = void 0;
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

const validateThreatMapping = rule => {
  let errors = [];

  if (rule.type === 'threat_match') {
    if (rule.concurrent_searches == null && rule.items_per_search != null) {
      errors = ['when "items_per_search" exists, "concurrent_searches" must also exist', ...errors];
    }

    if (rule.concurrent_searches != null && rule.items_per_search == null) {
      errors = ['when "concurrent_searches" exists, "items_per_search" must also exist', ...errors];
    }
  }

  return errors;
};

exports.validateThreatMapping = validateThreatMapping;

const createRuleValidateTypeDependents = schema => {
  return [...validateTimelineId(schema), ...validateTimelineTitle(schema), ...validateThreatMapping(schema)];
};

exports.createRuleValidateTypeDependents = createRuleValidateTypeDependents;