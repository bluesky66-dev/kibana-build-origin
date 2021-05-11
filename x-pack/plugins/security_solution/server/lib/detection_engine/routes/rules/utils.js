"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTupleDuplicateErrorsAndUniqueRules = exports.getDuplicates = exports.transformOrImportError = exports.transformOrBulkError = exports.transform = exports.transformFindAlerts = exports.transformAlertsToRules = exports.transformAlertToRule = exports.transformTags = exports.getIdBulkError = exports.getIdError = void 0;

var _fp = require("lodash/fp");

var _uuid = _interopRequireDefault(require("uuid"));

var _constants = require("../../../../../common/constants");

var _types = require("../../rules/types");

var _utils = require("../utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getIdError = ({
  id,
  ruleId
}) => {
  if (id != null) {
    return {
      message: `id: "${id}" not found`,
      statusCode: 404
    };
  } else if (ruleId != null) {
    return {
      message: `rule_id: "${ruleId}" not found`,
      statusCode: 404
    };
  } else {
    return {
      message: 'id or rule_id should have been defined',
      statusCode: 404
    };
  }
};

exports.getIdError = getIdError;

const getIdBulkError = ({
  id,
  ruleId
}) => {
  if (id != null && ruleId != null) {
    return (0, _utils.createBulkErrorObject)({
      id,
      ruleId,
      statusCode: 404,
      message: `id: "${id}" and rule_id: "${ruleId}" not found`
    });
  } else if (id != null) {
    return (0, _utils.createBulkErrorObject)({
      id,
      statusCode: 404,
      message: `id: "${id}" not found`
    });
  } else if (ruleId != null) {
    return (0, _utils.createBulkErrorObject)({
      ruleId,
      statusCode: 404,
      message: `rule_id: "${ruleId}" not found`
    });
  } else {
    return (0, _utils.createBulkErrorObject)({
      statusCode: 404,
      message: `id or rule_id should have been defined`
    });
  }
};

exports.getIdBulkError = getIdBulkError;

const transformTags = tags => {
  return tags.filter(tag => !tag.startsWith(_constants.INTERNAL_IDENTIFIER));
}; // Transforms the data but will remove any null or undefined it encounters and not include
// those on the export


exports.transformTags = transformTags;

const transformAlertToRule = (alert, ruleActions, ruleStatus) => {
  var _alert$params$author, _ruleActions$actions, _alert$createdBy, _alert$params$riskSco, _alert$params$severit, _alert$updatedBy, _alert$params$threat, _ruleStatus$attribute, _ruleStatus$attribute2, _ruleStatus$attribute3, _ruleStatus$attribute4, _ruleStatus$attribute5, _alert$params$excepti;

  return (0, _fp.pickBy)(value => value != null, {
    author: (_alert$params$author = alert.params.author) !== null && _alert$params$author !== void 0 ? _alert$params$author : [],
    actions: (_ruleActions$actions = ruleActions === null || ruleActions === void 0 ? void 0 : ruleActions.actions) !== null && _ruleActions$actions !== void 0 ? _ruleActions$actions : [],
    building_block_type: alert.params.buildingBlockType,
    created_at: alert.createdAt.toISOString(),
    updated_at: alert.updatedAt.toISOString(),
    created_by: (_alert$createdBy = alert.createdBy) !== null && _alert$createdBy !== void 0 ? _alert$createdBy : 'elastic',
    description: alert.params.description,
    enabled: alert.enabled,
    anomaly_threshold: alert.params.anomalyThreshold,
    event_category_override: alert.params.eventCategoryOverride,
    false_positives: alert.params.falsePositives,
    filters: alert.params.filters,
    from: alert.params.from,
    id: alert.id,
    immutable: alert.params.immutable,
    index: alert.params.index,
    interval: alert.schedule.interval,
    rule_id: alert.params.ruleId,
    language: alert.params.language,
    license: alert.params.license,
    output_index: alert.params.outputIndex,
    max_signals: alert.params.maxSignals,
    machine_learning_job_id: alert.params.machineLearningJobId,
    risk_score: alert.params.riskScore,
    risk_score_mapping: (_alert$params$riskSco = alert.params.riskScoreMapping) !== null && _alert$params$riskSco !== void 0 ? _alert$params$riskSco : [],
    rule_name_override: alert.params.ruleNameOverride,
    name: alert.name,
    query: alert.params.query,
    references: alert.params.references,
    saved_id: alert.params.savedId,
    timeline_id: alert.params.timelineId,
    timeline_title: alert.params.timelineTitle,
    meta: alert.params.meta,
    severity: alert.params.severity,
    severity_mapping: (_alert$params$severit = alert.params.severityMapping) !== null && _alert$params$severit !== void 0 ? _alert$params$severit : [],
    updated_by: (_alert$updatedBy = alert.updatedBy) !== null && _alert$updatedBy !== void 0 ? _alert$updatedBy : 'elastic',
    tags: transformTags(alert.tags),
    to: alert.params.to,
    type: alert.params.type,
    threat: (_alert$params$threat = alert.params.threat) !== null && _alert$params$threat !== void 0 ? _alert$params$threat : [],
    threshold: alert.params.threshold,
    threat_filters: alert.params.threatFilters,
    threat_index: alert.params.threatIndex,
    threat_indicator_path: alert.params.threatIndicatorPath,
    threat_query: alert.params.threatQuery,
    threat_mapping: alert.params.threatMapping,
    threat_language: alert.params.threatLanguage,
    concurrent_searches: alert.params.concurrentSearches,
    items_per_search: alert.params.itemsPerSearch,
    throttle: (ruleActions === null || ruleActions === void 0 ? void 0 : ruleActions.ruleThrottle) || 'no_actions',
    timestamp_override: alert.params.timestampOverride,
    note: alert.params.note,
    version: alert.params.version,
    status: (_ruleStatus$attribute = ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.attributes.status) !== null && _ruleStatus$attribute !== void 0 ? _ruleStatus$attribute : undefined,
    status_date: ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.attributes.statusDate,
    last_failure_at: (_ruleStatus$attribute2 = ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.attributes.lastFailureAt) !== null && _ruleStatus$attribute2 !== void 0 ? _ruleStatus$attribute2 : undefined,
    last_success_at: (_ruleStatus$attribute3 = ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.attributes.lastSuccessAt) !== null && _ruleStatus$attribute3 !== void 0 ? _ruleStatus$attribute3 : undefined,
    last_failure_message: (_ruleStatus$attribute4 = ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.attributes.lastFailureMessage) !== null && _ruleStatus$attribute4 !== void 0 ? _ruleStatus$attribute4 : undefined,
    last_success_message: (_ruleStatus$attribute5 = ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.attributes.lastSuccessMessage) !== null && _ruleStatus$attribute5 !== void 0 ? _ruleStatus$attribute5 : undefined,
    exceptions_list: (_alert$params$excepti = alert.params.exceptionsList) !== null && _alert$params$excepti !== void 0 ? _alert$params$excepti : []
  });
};

exports.transformAlertToRule = transformAlertToRule;

const transformAlertsToRules = alerts => {
  return alerts.map(alert => transformAlertToRule(alert));
};

exports.transformAlertsToRules = transformAlertsToRules;

const transformFindAlerts = (findResults, ruleActions, ruleStatuses) => {
  if (!ruleStatuses && (0, _types.isAlertTypes)(findResults.data)) {
    return {
      page: findResults.page,
      perPage: findResults.perPage,
      total: findResults.total,
      data: findResults.data.map((alert, idx) => transformAlertToRule(alert, ruleActions[idx]))
    };
  } else if ((0, _types.isAlertTypes)(findResults.data) && (0, _types.isRuleStatusFindTypes)(ruleStatuses)) {
    return {
      page: findResults.page,
      perPage: findResults.perPage,
      total: findResults.total,
      data: findResults.data.map((alert, idx) => transformAlertToRule(alert, ruleActions[idx], ruleStatuses[idx].saved_objects[0]))
    };
  } else {
    return null;
  }
};

exports.transformFindAlerts = transformFindAlerts;

const transform = (alert, ruleActions, ruleStatus) => {
  if ((0, _types.isAlertType)(alert)) {
    return transformAlertToRule(alert, ruleActions, (0, _types.isRuleStatusSavedObjectType)(ruleStatus) ? ruleStatus : undefined);
  }

  return null;
};

exports.transform = transform;

const transformOrBulkError = (ruleId, alert, ruleActions, ruleStatus) => {
  if ((0, _types.isAlertType)(alert)) {
    if ((0, _types.isRuleStatusFindType)(ruleStatus) && (ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.saved_objects.length) > 0) {
      var _ruleStatus$saved_obj;

      return transformAlertToRule(alert, ruleActions, (_ruleStatus$saved_obj = ruleStatus === null || ruleStatus === void 0 ? void 0 : ruleStatus.saved_objects[0]) !== null && _ruleStatus$saved_obj !== void 0 ? _ruleStatus$saved_obj : ruleStatus);
    } else {
      return transformAlertToRule(alert, ruleActions);
    }
  } else {
    return (0, _utils.createBulkErrorObject)({
      ruleId,
      statusCode: 500,
      message: 'Internal error transforming'
    });
  }
};

exports.transformOrBulkError = transformOrBulkError;

const transformOrImportError = (ruleId, alert, existingImportSuccessError) => {
  if ((0, _types.isAlertType)(alert)) {
    return (0, _utils.createSuccessObject)(existingImportSuccessError);
  } else {
    return (0, _utils.createImportErrorObject)({
      ruleId,
      statusCode: 500,
      message: 'Internal error transforming',
      existingImportSuccessError
    });
  }
};

exports.transformOrImportError = transformOrImportError;

const getDuplicates = (ruleDefinitions, by) => {
  const mappedDuplicates = (0, _fp.countBy)(by, ruleDefinitions.filter(r => r[by] != null));
  const hasDuplicates = Object.values(mappedDuplicates).some(i => i > 1);

  if (hasDuplicates) {
    return Object.keys(mappedDuplicates).filter(key => mappedDuplicates[key] > 1);
  }

  return [];
};

exports.getDuplicates = getDuplicates;

const getTupleDuplicateErrorsAndUniqueRules = (rules, isOverwrite) => {
  const {
    errors,
    rulesAcc
  } = rules.reduce((acc, parsedRule) => {
    if (parsedRule instanceof Error) {
      acc.rulesAcc.set(_uuid.default.v4(), parsedRule);
    } else {
      const {
        rule_id: ruleId
      } = parsedRule;

      if (acc.rulesAcc.has(ruleId) && !isOverwrite) {
        acc.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
          ruleId,
          statusCode: 400,
          message: `More than one rule with rule-id: "${ruleId}" found`
        }));
      }

      acc.rulesAcc.set(ruleId, parsedRule);
    }

    return acc;
  }, // using map (preserves ordering)
  {
    errors: new Map(),
    rulesAcc: new Map()
  });
  return [Array.from(errors.values()), Array.from(rulesAcc.values())];
};

exports.getTupleDuplicateErrorsAndUniqueRules = getTupleDuplicateErrorsAndUniqueRules;