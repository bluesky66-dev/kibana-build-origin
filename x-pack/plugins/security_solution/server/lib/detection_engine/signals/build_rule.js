"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyRuleOverrides = exports.buildRuleWithOverrides = exports.removeInternalTagsFromRule = exports.buildRuleWithoutOverrides = exports.buildRule = void 0;

var _build_risk_score_from_mapping = require("./mappings/build_risk_score_from_mapping");

var _build_severity_from_mapping = require("./mappings/build_severity_from_mapping");

var _build_rule_name_from_mapping = require("./mappings/build_rule_name_from_mapping");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildRule = ({
  ruleParams,
  name,
  id,
  actions,
  enabled,
  createdAt,
  createdBy,
  doc,
  updatedAt,
  updatedBy,
  interval,
  tags,
  throttle
}) => {
  var _ruleParams$ruleId, _ruleParams$author, _ruleParams$riskScore, _ruleParams$severityM, _ruleParams$threat, _ruleParams$exception;

  const {
    riskScore,
    riskScoreMeta
  } = (0, _build_risk_score_from_mapping.buildRiskScoreFromMapping)({
    eventSource: doc._source,
    riskScore: ruleParams.riskScore,
    riskScoreMapping: ruleParams.riskScoreMapping
  });
  const {
    severity,
    severityMeta
  } = (0, _build_severity_from_mapping.buildSeverityFromMapping)({
    eventSource: doc._source,
    severity: ruleParams.severity,
    severityMapping: ruleParams.severityMapping
  });
  const {
    ruleName,
    ruleNameMeta
  } = (0, _build_rule_name_from_mapping.buildRuleNameFromMapping)({
    eventSource: doc._source,
    ruleName: name,
    ruleNameMapping: ruleParams.ruleNameOverride
  });
  const meta = { ...ruleParams.meta,
    ...riskScoreMeta,
    ...severityMeta,
    ...ruleNameMeta
  };
  const rule = {
    id,
    rule_id: (_ruleParams$ruleId = ruleParams.ruleId) !== null && _ruleParams$ruleId !== void 0 ? _ruleParams$ruleId : '(unknown rule_id)',
    actions,
    author: (_ruleParams$author = ruleParams.author) !== null && _ruleParams$author !== void 0 ? _ruleParams$author : [],
    building_block_type: ruleParams.buildingBlockType,
    false_positives: ruleParams.falsePositives,
    saved_id: ruleParams.savedId,
    timeline_id: ruleParams.timelineId,
    timeline_title: ruleParams.timelineTitle,
    meta: Object.keys(meta).length > 0 ? meta : undefined,
    max_signals: ruleParams.maxSignals,
    risk_score: riskScore,
    risk_score_mapping: (_ruleParams$riskScore = ruleParams.riskScoreMapping) !== null && _ruleParams$riskScore !== void 0 ? _ruleParams$riskScore : [],
    output_index: ruleParams.outputIndex,
    description: ruleParams.description,
    note: ruleParams.note,
    from: ruleParams.from,
    immutable: ruleParams.immutable,
    index: ruleParams.index,
    interval,
    language: ruleParams.language,
    license: ruleParams.license,
    name: ruleName,
    query: ruleParams.query,
    references: ruleParams.references,
    rule_name_override: ruleParams.ruleNameOverride,
    severity,
    severity_mapping: (_ruleParams$severityM = ruleParams.severityMapping) !== null && _ruleParams$severityM !== void 0 ? _ruleParams$severityM : [],
    tags,
    type: ruleParams.type,
    to: ruleParams.to,
    enabled,
    filters: ruleParams.filters,
    created_by: createdBy,
    updated_by: updatedBy,
    threat: (_ruleParams$threat = ruleParams.threat) !== null && _ruleParams$threat !== void 0 ? _ruleParams$threat : [],
    threat_mapping: ruleParams.threatMapping,
    threat_filters: ruleParams.threatFilters,
    threat_indicator_path: ruleParams.threatIndicatorPath,
    threat_query: ruleParams.threatQuery,
    threat_index: ruleParams.threatIndex,
    threat_language: ruleParams.threatLanguage,
    timestamp_override: ruleParams.timestampOverride,
    throttle,
    version: ruleParams.version,
    created_at: createdAt,
    updated_at: updatedAt,
    exceptions_list: (_ruleParams$exception = ruleParams.exceptionsList) !== null && _ruleParams$exception !== void 0 ? _ruleParams$exception : [],
    machine_learning_job_id: ruleParams.machineLearningJobId,
    anomaly_threshold: ruleParams.anomalyThreshold,
    threshold: ruleParams.threshold
  };
  return removeInternalTagsFromRule(rule);
};

exports.buildRule = buildRule;

const buildRuleWithoutOverrides = ruleSO => {
  var _ruleParams$author2, _ruleParams$threat2, _ruleSO$updated_at, _ruleParams$exception2;

  const ruleParams = ruleSO.attributes.params;
  const rule = {
    id: ruleSO.id,
    rule_id: ruleParams.ruleId,
    actions: ruleSO.attributes.actions,
    author: (_ruleParams$author2 = ruleParams.author) !== null && _ruleParams$author2 !== void 0 ? _ruleParams$author2 : [],
    building_block_type: ruleParams.buildingBlockType,
    false_positives: ruleParams.falsePositives,
    saved_id: ruleParams.savedId,
    timeline_id: ruleParams.timelineId,
    timeline_title: ruleParams.timelineTitle,
    meta: ruleParams.meta,
    max_signals: ruleParams.maxSignals,
    risk_score: ruleParams.riskScore,
    risk_score_mapping: [],
    output_index: ruleParams.outputIndex,
    description: ruleParams.description,
    note: ruleParams.note,
    from: ruleParams.from,
    immutable: ruleParams.immutable,
    index: ruleParams.index,
    interval: ruleSO.attributes.schedule.interval,
    language: ruleParams.language,
    license: ruleParams.license,
    name: ruleSO.attributes.name,
    query: ruleParams.query,
    references: ruleParams.references,
    severity: ruleParams.severity,
    severity_mapping: [],
    tags: ruleSO.attributes.tags,
    type: ruleParams.type,
    to: ruleParams.to,
    enabled: ruleSO.attributes.enabled,
    filters: ruleParams.filters,
    created_by: ruleSO.attributes.createdBy,
    updated_by: ruleSO.attributes.updatedBy,
    threat: (_ruleParams$threat2 = ruleParams.threat) !== null && _ruleParams$threat2 !== void 0 ? _ruleParams$threat2 : [],
    timestamp_override: ruleParams.timestampOverride,
    throttle: ruleSO.attributes.throttle,
    version: ruleParams.version,
    created_at: ruleSO.attributes.createdAt,
    updated_at: (_ruleSO$updated_at = ruleSO.updated_at) !== null && _ruleSO$updated_at !== void 0 ? _ruleSO$updated_at : '',
    exceptions_list: (_ruleParams$exception2 = ruleParams.exceptionsList) !== null && _ruleParams$exception2 !== void 0 ? _ruleParams$exception2 : [],
    machine_learning_job_id: ruleParams.machineLearningJobId,
    anomaly_threshold: ruleParams.anomalyThreshold,
    threshold: ruleParams.threshold,
    threat_filters: ruleParams.threatFilters,
    threat_index: ruleParams.threatIndex,
    threat_query: ruleParams.threatQuery,
    threat_mapping: ruleParams.threatMapping,
    threat_language: ruleParams.threatLanguage,
    threat_indicator_path: ruleParams.threatIndicatorPath
  };
  return removeInternalTagsFromRule(rule);
};

exports.buildRuleWithoutOverrides = buildRuleWithoutOverrides;

const removeInternalTagsFromRule = rule => {
  if (rule.tags == null) {
    return rule;
  } else {
    const ruleWithoutInternalTags = { ...rule,
      tags: rule.tags.filter(tag => !tag.startsWith(_constants.INTERNAL_IDENTIFIER))
    };
    return ruleWithoutInternalTags;
  }
};

exports.removeInternalTagsFromRule = removeInternalTagsFromRule;

const buildRuleWithOverrides = (ruleSO, eventSource) => {
  const ruleWithoutOverrides = buildRuleWithoutOverrides(ruleSO);
  return applyRuleOverrides(ruleWithoutOverrides, eventSource, ruleSO.attributes.params);
};

exports.buildRuleWithOverrides = buildRuleWithOverrides;

const applyRuleOverrides = (rule, eventSource, ruleParams) => {
  var _ruleParams$riskScore2, _ruleParams$severityM2;

  const {
    riskScore,
    riskScoreMeta
  } = (0, _build_risk_score_from_mapping.buildRiskScoreFromMapping)({
    eventSource,
    riskScore: ruleParams.riskScore,
    riskScoreMapping: ruleParams.riskScoreMapping
  });
  const {
    severity,
    severityMeta
  } = (0, _build_severity_from_mapping.buildSeverityFromMapping)({
    eventSource,
    severity: ruleParams.severity,
    severityMapping: ruleParams.severityMapping
  });
  const {
    ruleName,
    ruleNameMeta
  } = (0, _build_rule_name_from_mapping.buildRuleNameFromMapping)({
    eventSource,
    ruleName: rule.name,
    ruleNameMapping: ruleParams.ruleNameOverride
  });
  const meta = { ...ruleParams.meta,
    ...riskScoreMeta,
    ...severityMeta,
    ...ruleNameMeta
  };
  return { ...rule,
    risk_score: riskScore,
    risk_score_mapping: (_ruleParams$riskScore2 = ruleParams.riskScoreMapping) !== null && _ruleParams$riskScore2 !== void 0 ? _ruleParams$riskScore2 : [],
    severity,
    severity_mapping: (_ruleParams$severityM2 = ruleParams.severityMapping) !== null && _ruleParams$severityM2 !== void 0 ? _ruleParams$severityM2 : [],
    name: ruleName,
    rule_name_override: ruleParams.ruleNameOverride,
    meta: Object.keys(meta).length > 0 ? meta : undefined
  };
};

exports.applyRuleOverrides = applyRuleOverrides;