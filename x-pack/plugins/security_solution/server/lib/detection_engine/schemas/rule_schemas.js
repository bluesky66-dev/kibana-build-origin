"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internalRuleResponse = exports.internalRuleUpdate = exports.internalRuleCreate = exports.ruleParams = exports.typeSpecificRuleParams = exports.baseRuleParams = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _lists = require("../../../../common/detection_engine/schemas/types/lists");

var _threat_mapping = require("../../../../common/detection_engine/schemas/types/threat_mapping");

var _schemas = require("../../../../common/detection_engine/schemas/common/schemas");

var _constants = require("../../../../common/constants");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const nonEqlLanguages = t.keyof({
  kuery: null,
  lucene: null
});
const baseRuleParams = t.exact(t.type({
  author: _schemas.authorOrUndefined,
  buildingBlockType: _schemas.buildingBlockTypeOrUndefined,
  description: _schemas.description,
  note: _schemas.noteOrUndefined,
  falsePositives: _schemas.false_positives,
  from: _schemas.from,
  ruleId: _schemas.rule_id,
  immutable: _schemas.immutable,
  license: _schemas.licenseOrUndefined,
  outputIndex: _schemas.output_index,
  timelineId: _schemas.timelineIdOrUndefined,
  timelineTitle: _schemas.timelineTitleOrUndefined,
  meta: _schemas.metaOrUndefined,
  // maxSignals not used in ML rules but probably should be used
  maxSignals: _schemas.max_signals,
  riskScore: _schemas.risk_score,
  riskScoreMapping: _schemas.riskScoreMappingOrUndefined,
  ruleNameOverride: _schemas.ruleNameOverrideOrUndefined,
  severity: _schemas.severity,
  severityMapping: _schemas.severityMappingOrUndefined,
  timestampOverride: _schemas.timestampOverrideOrUndefined,
  threat: _schemas.threats,
  to: _schemas.to,
  references: _schemas.references,
  version: _schemas.version,
  exceptionsList: _lists.listArrayOrUndefined
}));
exports.baseRuleParams = baseRuleParams;
const eqlSpecificRuleParams = t.type({
  type: t.literal('eql'),
  language: t.literal('eql'),
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  eventCategoryOverride: _schemas.eventCategoryOverrideOrUndefined
});
const threatSpecificRuleParams = t.type({
  type: t.literal('threat_match'),
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.savedIdOrUndefined,
  threatFilters: _schemas.filtersOrUndefined,
  threatQuery: _threat_mapping.threat_query,
  threatMapping: _threat_mapping.threat_mapping,
  threatLanguage: t.union([nonEqlLanguages, t.undefined]),
  threatIndex: _threat_mapping.threat_index,
  threatIndicatorPath: _threat_mapping.threatIndicatorPathOrUndefined,
  concurrentSearches: _threat_mapping.concurrentSearchesOrUndefined,
  itemsPerSearch: _threat_mapping.itemsPerSearchOrUndefined
});
const querySpecificRuleParams = t.exact(t.type({
  type: t.literal('query'),
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.savedIdOrUndefined
}));
const savedQuerySpecificRuleParams = t.type({
  type: t.literal('saved_query'),
  // Having language, query, and filters possibly defined adds more code confusion and probably user confusion
  // if the saved object gets deleted for some reason
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.queryOrUndefined,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.saved_id
});
const thresholdSpecificRuleParams = t.type({
  type: t.literal('threshold'),
  language: nonEqlLanguages,
  index: _schemas.indexOrUndefined,
  query: _schemas.query,
  filters: _schemas.filtersOrUndefined,
  savedId: _schemas.savedIdOrUndefined,
  threshold: _schemas.threshold
});
const machineLearningSpecificRuleParams = t.type({
  type: t.literal('machine_learning'),
  anomalyThreshold: _schemas.anomaly_threshold,
  machineLearningJobId: _schemas.machine_learning_job_id
});
const typeSpecificRuleParams = t.union([eqlSpecificRuleParams, threatSpecificRuleParams, querySpecificRuleParams, savedQuerySpecificRuleParams, thresholdSpecificRuleParams, machineLearningSpecificRuleParams]);
exports.typeSpecificRuleParams = typeSpecificRuleParams;
const ruleParams = t.intersection([baseRuleParams, typeSpecificRuleParams]);
exports.ruleParams = ruleParams;
const internalRuleCreate = t.type({
  name: _schemas.name,
  tags: _schemas.tags,
  alertTypeId: t.literal(_constants.SIGNALS_ID),
  consumer: t.literal(_constants.SERVER_APP_ID),
  schedule: t.type({
    interval: t.string
  }),
  enabled: _schemas.enabled,
  actions: _schemas.actionsCamel,
  params: ruleParams,
  throttle: _schemas.throttleOrNull,
  notifyWhen: t.null
});
exports.internalRuleCreate = internalRuleCreate;
const internalRuleUpdate = t.type({
  name: _schemas.name,
  tags: _schemas.tags,
  schedule: t.type({
    interval: t.string
  }),
  actions: _schemas.actionsCamel,
  params: ruleParams,
  throttle: _schemas.throttleOrNull,
  notifyWhen: t.null
});
exports.internalRuleUpdate = internalRuleUpdate;
const internalRuleResponse = t.intersection([internalRuleCreate, t.type({
  id: t.string,
  createdBy: _schemas.createdByOrNull,
  updatedBy: _schemas.updatedByOrNull,
  createdAt: _schemas.created_at,
  updatedAt: _schemas.updated_at
})]);
exports.internalRuleResponse = internalRuleResponse;