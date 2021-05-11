"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRulesSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _schemas = require("../common/schemas");

var _threat_mapping = require("../types/threat_mapping");

var _lists = require("../types/lists");

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

/**
 * All of the patch elements should default to undefined if not set
 */


const patchRulesSchema = t.exact(t.partial({
  author: _schemas.author,
  building_block_type: _schemas.building_block_type,
  description: _schemas.description,
  risk_score: _schemas.risk_score,
  name: _schemas.name,
  severity: _schemas.severity,
  type: _schemas.type,
  id: _schemas.id,
  actions: _schemas.actions,
  anomaly_threshold: _schemas.anomaly_threshold,
  enabled: _schemas.enabled,
  event_category_override: _schemas.event_category_override,
  false_positives: _schemas.false_positives,
  filters: _schemas.filters,
  from: _schemas.from,
  rule_id: _schemas.rule_id,
  index: _schemas.index,
  interval: _schemas.interval,
  query: _schemas.query,
  language: _schemas.language,
  license: _schemas.license,
  // TODO: output_index: This should be removed eventually
  output_index: _schemas.output_index,
  saved_id: _schemas.saved_id,
  timeline_id: _schemas.timeline_id,
  timeline_title: _schemas.timeline_title,
  meta: _schemas.meta,
  machine_learning_job_id: _schemas.machine_learning_job_id,
  max_signals: _schemas.max_signals,
  risk_score_mapping: _schemas.risk_score_mapping,
  rule_name_override: _schemas.rule_name_override,
  severity_mapping: _schemas.severity_mapping,
  tags: _schemas.tags,
  to: _schemas.to,
  threat: _schemas.threats,
  threshold: _schemas.threshold,
  throttle: _schemas.throttle,
  timestamp_override: _schemas.timestamp_override,
  references: _schemas.references,
  note: _schemas.note,
  version: _schemas.version,
  exceptions_list: _lists.listArrayOrUndefined,
  threat_index: _threat_mapping.threat_index,
  threat_query: _threat_mapping.threat_query,
  threat_filters: _threat_mapping.threat_filters,
  threat_mapping: _threat_mapping.threat_mapping,
  threat_language: _threat_mapping.threat_language,
  threat_indicator_path: _threat_mapping.threat_indicator_path,
  concurrent_searches: _threat_mapping.concurrent_searches,
  items_per_search: _threat_mapping.items_per_search
}));
exports.patchRulesSchema = patchRulesSchema;