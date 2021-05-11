"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageOrUndefined = exports.page = exports.perPageOrUndefined = exports.per_page = exports.referencesOrUndefined = exports.references = exports.queryFilterOrUndefined = exports.queryFilter = exports.typeOrUndefined = exports.type = exports.toOrUndefined = exports.to = exports.conflicts = exports.job_status = exports.status = exports.severityMappingOrUndefined = exports.severity_mapping = exports.severity_mapping_item = exports.severity_mapping_value = exports.severity_mapping_field = exports.severityOrUndefined = exports.severity = exports.ruleNameOverrideOrUndefined = exports.rule_name_override = exports.riskScoreMappingOrUndefined = exports.risk_score_mapping = exports.risk_score_mapping_item = exports.risk_score_mapping_value = exports.risk_score_mapping_field = exports.riskScoreOrUndefined = exports.risk_score = exports.OperatorEnum = exports.operator = exports.nameOrUndefined = exports.name = exports.maxSignalsOrUndefined = exports.max_signals = exports.metaOrUndefined = exports.meta = exports.machineLearningJobIdOrUndefined = exports.machine_learning_job_id = exports.anomalyThresholdOrUndefined = exports.anomaly_threshold = exports.throttleOrNullOrUndefined = exports.throttleOrNull = exports.throttle = exports.timestampOverrideOrUndefined = exports.timestamp_override = exports.timelineTitleOrUndefined = exports.timeline_title = exports.timelineIdOrUndefined = exports.timeline_id = exports.savedIdOrUndefined = exports.saved_id = exports.outputIndexOrUndefined = exports.output_index = exports.objects = exports.licenseOrUndefined = exports.license = exports.languageOrUndefined = exports.language = exports.queryOrUndefined = exports.query = exports.intervalOrUndefined = exports.interval = exports.indexOrUndefined = exports.index = exports.idOrUndefined = exports.id = exports.ruleIdOrUndefined = exports.rule_id = exports.immutable = exports.fromOrUndefined = exports.from = exports.actionsCamel = exports.actions = exports.action = exports.action_params = exports.action_action_type_id = exports.action_id = exports.action_group = exports.saved_object_attributes = exports.saved_object_attribute = exports.saved_object_attribute_single = exports.filtersOrUndefined = exports.filters = exports.exclude_export_details = exports.file_name = exports.falsePositivesOrUndefined = exports.false_positives = exports.eventCategoryOverrideOrUndefined = exports.event_category_override = exports.enabledOrUndefined = exports.enabled = exports.descriptionOrUndefined = exports.description = exports.buildingBlockTypeOrUndefined = exports.building_block_type = exports.authorOrUndefined = exports.author = void 0;
exports.privilege = exports.indexType = exports.indexRecord = exports.noteOrUndefined = exports.note = exports.timelines_not_updated = exports.timelines_not_installed = exports.timelines_updated = exports.timelines_installed = exports.rules_not_updated = exports.rules_not_installed = exports.rules_custom_installed = exports.success_count = exports.success = exports.total = exports.perPage = exports.message = exports.status_code = exports.rules_updated = exports.rules_installed = exports.status_date = exports.last_failure_message = exports.last_failure_at = exports.last_success_message = exports.last_success_at = exports.versionOrUndefined = exports.version = exports.createdByOrNull = exports.updatedByOrNull = exports.created_by = exports.updated_by = exports.updated_at = exports.created_at = exports.thresholdNormalizedOrUndefined = exports.thresholdNormalized = exports.thresholdOrUndefined = exports.threshold = exports.thresholdCardinalityField = exports.thresholdFieldNormalized = exports.thresholdField = exports.threatsOrUndefined = exports.threats = exports.threat = exports.threat_techniques = exports.threat_technique = exports.threat_technique_reference = exports.threat_technique_name = exports.threat_technique_id = exports.threat_subtechniques = exports.threat_subtechnique = exports.threat_subtechnique_reference = exports.threat_subtechnique_name = exports.threat_subtechnique_id = exports.threat_tactic = exports.threat_tactic_reference = exports.threat_tactic_name = exports.threat_tactic_id = exports.threat_framework = exports.fieldsOrUndefined = exports.fields = exports.tagsOrUndefined = exports.tags = exports.sortOrderOrUndefined = exports.sort_order = exports.sortFieldOrUndefined = exports.sort_field = exports.signal_status_query = exports.signal_ids = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _risk_score = require("../types/risk_score");

var _uuid = require("../types/uuid");

var _iso_date_string = require("../types/iso_date_string");

var _positive_integer_greater_than_zero = require("../types/positive_integer_greater_than_zero");

var _positive_integer = require("../types/positive_integer");

var _non_empty_string = require("../types/non_empty_string");

var _parse_schedule_dates = require("../../parse_schedule_dates");

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

/* eslint-disable @typescript-eslint/naming-convention */


const author = t.array(t.string);
exports.author = author;
const authorOrUndefined = t.union([author, t.undefined]);
exports.authorOrUndefined = authorOrUndefined;
const building_block_type = t.string;
exports.building_block_type = building_block_type;
const buildingBlockTypeOrUndefined = t.union([building_block_type, t.undefined]);
exports.buildingBlockTypeOrUndefined = buildingBlockTypeOrUndefined;
const description = _non_empty_string.NonEmptyString;
exports.description = description;
const descriptionOrUndefined = t.union([description, t.undefined]);
exports.descriptionOrUndefined = descriptionOrUndefined;
const enabled = t.boolean;
exports.enabled = enabled;
const enabledOrUndefined = t.union([enabled, t.undefined]);
exports.enabledOrUndefined = enabledOrUndefined;
const event_category_override = t.string;
exports.event_category_override = event_category_override;
const eventCategoryOverrideOrUndefined = t.union([event_category_override, t.undefined]);
exports.eventCategoryOverrideOrUndefined = eventCategoryOverrideOrUndefined;
const false_positives = t.array(t.string);
exports.false_positives = false_positives;
const falsePositivesOrUndefined = t.union([false_positives, t.undefined]);
exports.falsePositivesOrUndefined = falsePositivesOrUndefined;
const file_name = t.string;
exports.file_name = file_name;
const exclude_export_details = t.boolean;
exports.exclude_export_details = exclude_export_details;
/**
 * TODO: Right now the filters is an "unknown", when it could more than likely
 * become the actual ESFilter as a type.
 */

const filters = t.array(t.unknown); // Filters are not easily type-able yet

exports.filters = filters; // Filters are not easily type-able yet

const filtersOrUndefined = t.union([filters, t.undefined]);
exports.filtersOrUndefined = filtersOrUndefined;
const saved_object_attribute_single = t.recursion('saved_object_attribute_single', () => t.union([t.string, t.number, t.boolean, t.null, t.undefined, saved_object_attributes]));
exports.saved_object_attribute_single = saved_object_attribute_single;
const saved_object_attribute = t.recursion('saved_object_attribute', () => t.union([saved_object_attribute_single, t.array(saved_object_attribute_single)]));
exports.saved_object_attribute = saved_object_attribute;
const saved_object_attributes = t.recursion('saved_object_attributes', () => t.record(t.string, saved_object_attribute));
/**
 * Params is an "object", since it is a type of AlertActionParams which is action templates.
 * @see x-pack/plugins/alerts/common/alert.ts
 */

exports.saved_object_attributes = saved_object_attributes;
const action_group = t.string;
exports.action_group = action_group;
const action_id = t.string;
exports.action_id = action_id;
const action_action_type_id = t.string;
exports.action_action_type_id = action_action_type_id;
const action_params = saved_object_attributes;
exports.action_params = action_params;
const action = t.exact(t.type({
  group: action_group,
  id: action_id,
  action_type_id: action_action_type_id,
  params: action_params
}));
exports.action = action;
const actions = t.array(action);
exports.actions = actions;
const actionsCamel = t.array(t.exact(t.type({
  group: action_group,
  id: action_id,
  actionTypeId: action_action_type_id,
  params: action_params
})));
exports.actionsCamel = actionsCamel;

const stringValidator = input => typeof input === 'string';

const from = new t.Type('From', t.string.is, (input, context) => {
  if (stringValidator(input) && (0, _parse_schedule_dates.parseScheduleDates)(input) == null) {
    return t.failure(input, context, 'Failed to parse "from" on rule param');
  }

  return t.string.validate(input, context);
}, t.identity);
exports.from = from;
const fromOrUndefined = t.union([from, t.undefined]);
exports.fromOrUndefined = fromOrUndefined;
const immutable = t.boolean;
exports.immutable = immutable; // Note: Never make this a strict uuid, we allow the rule_id to be any string at the moment
// in case we encounter 3rd party rule systems which might be using auto incrementing numbers
// or other different things.

const rule_id = t.string;
exports.rule_id = rule_id;
const ruleIdOrUndefined = t.union([rule_id, t.undefined]);
exports.ruleIdOrUndefined = ruleIdOrUndefined;
const id = _uuid.UUID;
exports.id = id;
const idOrUndefined = t.union([id, t.undefined]);
exports.idOrUndefined = idOrUndefined;
const index = t.array(t.string);
exports.index = index;
const indexOrUndefined = t.union([index, t.undefined]);
exports.indexOrUndefined = indexOrUndefined;
const interval = t.string;
exports.interval = interval;
const intervalOrUndefined = t.union([interval, t.undefined]);
exports.intervalOrUndefined = intervalOrUndefined;
const query = t.string;
exports.query = query;
const queryOrUndefined = t.union([query, t.undefined]);
exports.queryOrUndefined = queryOrUndefined;
const language = t.keyof({
  eql: null,
  kuery: null,
  lucene: null
});
exports.language = language;
const languageOrUndefined = t.union([language, t.undefined]);
exports.languageOrUndefined = languageOrUndefined;
const license = t.string;
exports.license = license;
const licenseOrUndefined = t.union([license, t.undefined]);
exports.licenseOrUndefined = licenseOrUndefined;
const objects = t.array(t.type({
  rule_id
}));
exports.objects = objects;
const output_index = t.string;
exports.output_index = output_index;
const outputIndexOrUndefined = t.union([output_index, t.undefined]);
exports.outputIndexOrUndefined = outputIndexOrUndefined;
const saved_id = t.string;
exports.saved_id = saved_id;
const savedIdOrUndefined = t.union([saved_id, t.undefined]);
exports.savedIdOrUndefined = savedIdOrUndefined;
const timeline_id = t.string;
exports.timeline_id = timeline_id;
const timelineIdOrUndefined = t.union([timeline_id, t.undefined]);
exports.timelineIdOrUndefined = timelineIdOrUndefined;
const timeline_title = t.string;
exports.timeline_title = timeline_title;
const timelineTitleOrUndefined = t.union([timeline_title, t.undefined]);
exports.timelineTitleOrUndefined = timelineTitleOrUndefined;
const timestamp_override = t.string;
exports.timestamp_override = timestamp_override;
const timestampOverrideOrUndefined = t.union([timestamp_override, t.undefined]);
exports.timestampOverrideOrUndefined = timestampOverrideOrUndefined;
const throttle = t.string;
exports.throttle = throttle;
const throttleOrNull = t.union([throttle, t.null]);
exports.throttleOrNull = throttleOrNull;
const throttleOrNullOrUndefined = t.union([throttle, t.null, t.undefined]);
exports.throttleOrNullOrUndefined = throttleOrNullOrUndefined;
const anomaly_threshold = _positive_integer.PositiveInteger;
exports.anomaly_threshold = anomaly_threshold;
const anomalyThresholdOrUndefined = t.union([anomaly_threshold, t.undefined]);
exports.anomalyThresholdOrUndefined = anomalyThresholdOrUndefined;
const machine_learning_job_id = t.string;
exports.machine_learning_job_id = machine_learning_job_id;
const machineLearningJobIdOrUndefined = t.union([machine_learning_job_id, t.undefined]);
exports.machineLearningJobIdOrUndefined = machineLearningJobIdOrUndefined;
/**
 * Note that this is a non-exact io-ts type as we allow extra meta information
 * to be added to the meta object
 */

const meta = t.object;
exports.meta = meta;
const metaOrUndefined = t.union([meta, t.undefined]);
exports.metaOrUndefined = metaOrUndefined;
const max_signals = _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero;
exports.max_signals = max_signals;
const maxSignalsOrUndefined = t.union([max_signals, t.undefined]);
exports.maxSignalsOrUndefined = maxSignalsOrUndefined;
const name = _non_empty_string.NonEmptyString;
exports.name = name;
const nameOrUndefined = t.union([name, t.undefined]);
exports.nameOrUndefined = nameOrUndefined;
const operator = t.keyof({
  equals: null
});
exports.operator = operator;
let OperatorEnum;
exports.OperatorEnum = OperatorEnum;

(function (OperatorEnum) {
  OperatorEnum["EQUALS"] = "equals";
})(OperatorEnum || (exports.OperatorEnum = OperatorEnum = {}));

const risk_score = _risk_score.RiskScore;
exports.risk_score = risk_score;
const riskScoreOrUndefined = t.union([risk_score, t.undefined]);
exports.riskScoreOrUndefined = riskScoreOrUndefined;
const risk_score_mapping_field = t.string;
exports.risk_score_mapping_field = risk_score_mapping_field;
const risk_score_mapping_value = t.string;
exports.risk_score_mapping_value = risk_score_mapping_value;
const risk_score_mapping_item = t.exact(t.type({
  field: risk_score_mapping_field,
  value: risk_score_mapping_value,
  operator,
  risk_score: riskScoreOrUndefined
}));
exports.risk_score_mapping_item = risk_score_mapping_item;
const risk_score_mapping = t.array(risk_score_mapping_item);
exports.risk_score_mapping = risk_score_mapping;
const riskScoreMappingOrUndefined = t.union([risk_score_mapping, t.undefined]);
exports.riskScoreMappingOrUndefined = riskScoreMappingOrUndefined;
const rule_name_override = t.string;
exports.rule_name_override = rule_name_override;
const ruleNameOverrideOrUndefined = t.union([rule_name_override, t.undefined]);
exports.ruleNameOverrideOrUndefined = ruleNameOverrideOrUndefined;
const severity = t.keyof({
  low: null,
  medium: null,
  high: null,
  critical: null
});
exports.severity = severity;
const severityOrUndefined = t.union([severity, t.undefined]);
exports.severityOrUndefined = severityOrUndefined;
const severity_mapping_field = t.string;
exports.severity_mapping_field = severity_mapping_field;
const severity_mapping_value = t.string;
exports.severity_mapping_value = severity_mapping_value;
const severity_mapping_item = t.exact(t.type({
  field: severity_mapping_field,
  operator,
  value: severity_mapping_value,
  severity
}));
exports.severity_mapping_item = severity_mapping_item;
const severity_mapping = t.array(severity_mapping_item);
exports.severity_mapping = severity_mapping;
const severityMappingOrUndefined = t.union([severity_mapping, t.undefined]);
exports.severityMappingOrUndefined = severityMappingOrUndefined;
const status = t.keyof({
  open: null,
  closed: null,
  'in-progress': null
});
exports.status = status;
const job_status = t.keyof({
  succeeded: null,
  failed: null,
  'going to run': null,
  'partial failure': null,
  warning: null
});
exports.job_status = job_status;
const conflicts = t.keyof({
  abort: null,
  proceed: null
});
exports.conflicts = conflicts; // TODO: Create a regular expression type or custom date math part type here

const to = t.string;
exports.to = to;
const toOrUndefined = t.union([to, t.undefined]);
exports.toOrUndefined = toOrUndefined;
const type = t.keyof({
  eql: null,
  machine_learning: null,
  query: null,
  saved_query: null,
  threshold: null,
  threat_match: null
});
exports.type = type;
const typeOrUndefined = t.union([type, t.undefined]);
exports.typeOrUndefined = typeOrUndefined;
const queryFilter = t.string;
exports.queryFilter = queryFilter;
const queryFilterOrUndefined = t.union([queryFilter, t.undefined]);
exports.queryFilterOrUndefined = queryFilterOrUndefined;
const references = t.array(t.string);
exports.references = references;
const referencesOrUndefined = t.union([references, t.undefined]);
exports.referencesOrUndefined = referencesOrUndefined;
const per_page = _positive_integer.PositiveInteger;
exports.per_page = per_page;
const perPageOrUndefined = t.union([per_page, t.undefined]);
exports.perPageOrUndefined = perPageOrUndefined;
const page = _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero;
exports.page = page;
const pageOrUndefined = t.union([page, t.undefined]);
exports.pageOrUndefined = pageOrUndefined;
const signal_ids = t.array(t.string);
exports.signal_ids = signal_ids; // TODO: Can this be more strict or is this is the set of all Elastic Queries?

const signal_status_query = t.object;
exports.signal_status_query = signal_status_query;
const sort_field = t.string;
exports.sort_field = sort_field;
const sortFieldOrUndefined = t.union([sort_field, t.undefined]);
exports.sortFieldOrUndefined = sortFieldOrUndefined;
const sort_order = t.keyof({
  asc: null,
  desc: null
});
exports.sort_order = sort_order;
const sortOrderOrUndefined = t.union([sort_order, t.undefined]);
exports.sortOrderOrUndefined = sortOrderOrUndefined;
const tags = t.array(t.string);
exports.tags = tags;
const tagsOrUndefined = t.union([tags, t.undefined]);
exports.tagsOrUndefined = tagsOrUndefined;
const fields = t.array(t.string);
exports.fields = fields;
const fieldsOrUndefined = t.union([fields, t.undefined]);
exports.fieldsOrUndefined = fieldsOrUndefined;
const threat_framework = t.string;
exports.threat_framework = threat_framework;
const threat_tactic_id = t.string;
exports.threat_tactic_id = threat_tactic_id;
const threat_tactic_name = t.string;
exports.threat_tactic_name = threat_tactic_name;
const threat_tactic_reference = t.string;
exports.threat_tactic_reference = threat_tactic_reference;
const threat_tactic = t.type({
  id: threat_tactic_id,
  name: threat_tactic_name,
  reference: threat_tactic_reference
});
exports.threat_tactic = threat_tactic;
const threat_subtechnique_id = t.string;
exports.threat_subtechnique_id = threat_subtechnique_id;
const threat_subtechnique_name = t.string;
exports.threat_subtechnique_name = threat_subtechnique_name;
const threat_subtechnique_reference = t.string;
exports.threat_subtechnique_reference = threat_subtechnique_reference;
const threat_subtechnique = t.type({
  id: threat_subtechnique_id,
  name: threat_subtechnique_name,
  reference: threat_subtechnique_reference
});
exports.threat_subtechnique = threat_subtechnique;
const threat_subtechniques = t.array(threat_subtechnique);
exports.threat_subtechniques = threat_subtechniques;
const threat_technique_id = t.string;
exports.threat_technique_id = threat_technique_id;
const threat_technique_name = t.string;
exports.threat_technique_name = threat_technique_name;
const threat_technique_reference = t.string;
exports.threat_technique_reference = threat_technique_reference;
const threat_technique = t.intersection([t.exact(t.type({
  id: threat_technique_id,
  name: threat_technique_name,
  reference: threat_technique_reference
})), t.exact(t.partial({
  subtechnique: threat_subtechniques
}))]);
exports.threat_technique = threat_technique;
const threat_techniques = t.array(threat_technique);
exports.threat_techniques = threat_techniques;
const threat = t.intersection([t.exact(t.type({
  framework: threat_framework,
  tactic: threat_tactic
})), t.exact(t.partial({
  technique: threat_techniques
}))]);
exports.threat = threat;
const threats = t.array(threat);
exports.threats = threats;
const threatsOrUndefined = t.union([threats, t.undefined]);
exports.threatsOrUndefined = threatsOrUndefined;
const thresholdField = t.exact(t.type({
  field: t.union([t.string, t.array(t.string)]),
  // Covers pre- and post-7.12
  value: _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero
}));
exports.thresholdField = thresholdField;
const thresholdFieldNormalized = t.exact(t.type({
  field: t.array(t.string),
  value: _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero
}));
exports.thresholdFieldNormalized = thresholdFieldNormalized;
const thresholdCardinalityField = t.exact(t.type({
  field: t.string,
  value: _positive_integer.PositiveInteger
}));
exports.thresholdCardinalityField = thresholdCardinalityField;
const threshold = t.intersection([thresholdField, t.exact(t.partial({
  cardinality: t.union([t.array(thresholdCardinalityField), t.null])
}))]);
exports.threshold = threshold;
const thresholdOrUndefined = t.union([threshold, t.undefined]);
exports.thresholdOrUndefined = thresholdOrUndefined;
const thresholdNormalized = t.intersection([thresholdFieldNormalized, t.exact(t.partial({
  cardinality: t.union([t.array(thresholdCardinalityField), t.null])
}))]);
exports.thresholdNormalized = thresholdNormalized;
const thresholdNormalizedOrUndefined = t.union([thresholdNormalized, t.undefined]);
exports.thresholdNormalizedOrUndefined = thresholdNormalizedOrUndefined;
const created_at = _iso_date_string.IsoDateString;
exports.created_at = created_at;
const updated_at = _iso_date_string.IsoDateString;
exports.updated_at = updated_at;
const updated_by = t.string;
exports.updated_by = updated_by;
const created_by = t.string;
exports.created_by = created_by;
const updatedByOrNull = t.union([updated_by, t.null]);
exports.updatedByOrNull = updatedByOrNull;
const createdByOrNull = t.union([created_by, t.null]);
exports.createdByOrNull = createdByOrNull;
const version = _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero;
exports.version = version;
const versionOrUndefined = t.union([version, t.undefined]);
exports.versionOrUndefined = versionOrUndefined;
const last_success_at = _iso_date_string.IsoDateString;
exports.last_success_at = last_success_at;
const last_success_message = t.string;
exports.last_success_message = last_success_message;
const last_failure_at = _iso_date_string.IsoDateString;
exports.last_failure_at = last_failure_at;
const last_failure_message = t.string;
exports.last_failure_message = last_failure_message;
const status_date = _iso_date_string.IsoDateString;
exports.status_date = status_date;
const rules_installed = _positive_integer.PositiveInteger;
exports.rules_installed = rules_installed;
const rules_updated = _positive_integer.PositiveInteger;
exports.rules_updated = rules_updated;
const status_code = _positive_integer.PositiveInteger;
exports.status_code = status_code;
const message = t.string;
exports.message = message;
const perPage = _positive_integer.PositiveInteger;
exports.perPage = perPage;
const total = _positive_integer.PositiveInteger;
exports.total = total;
const success = t.boolean;
exports.success = success;
const success_count = _positive_integer.PositiveInteger;
exports.success_count = success_count;
const rules_custom_installed = _positive_integer.PositiveInteger;
exports.rules_custom_installed = rules_custom_installed;
const rules_not_installed = _positive_integer.PositiveInteger;
exports.rules_not_installed = rules_not_installed;
const rules_not_updated = _positive_integer.PositiveInteger;
exports.rules_not_updated = rules_not_updated;
const timelines_installed = _positive_integer.PositiveInteger;
exports.timelines_installed = timelines_installed;
const timelines_updated = _positive_integer.PositiveInteger;
exports.timelines_updated = timelines_updated;
const timelines_not_installed = _positive_integer.PositiveInteger;
exports.timelines_not_installed = timelines_not_installed;
const timelines_not_updated = _positive_integer.PositiveInteger;
exports.timelines_not_updated = timelines_not_updated;
const note = t.string;
exports.note = note;
const noteOrUndefined = t.union([note, t.undefined]);
exports.noteOrUndefined = noteOrUndefined;
const indexRecord = t.record(t.string, t.type({
  all: t.boolean,
  maintenance: t.boolean,
  manage_ilm: t.boolean,
  read: t.boolean,
  create_index: t.boolean,
  read_cross_cluster: t.boolean,
  index: t.boolean,
  monitor: t.boolean,
  delete: t.boolean,
  manage: t.boolean,
  delete_index: t.boolean,
  create_doc: t.boolean,
  view_index_metadata: t.boolean,
  create: t.boolean,
  manage_follow_index: t.boolean,
  manage_leader_index: t.boolean,
  write: t.boolean
}));
exports.indexRecord = indexRecord;
const indexType = t.type({
  index: indexRecord
});
exports.indexType = indexType;
const privilege = t.type({
  username: t.string,
  has_all_requested: t.boolean,
  cluster: t.type({
    monitor_ml: t.boolean,
    manage_ccr: t.boolean,
    manage_index_templates: t.boolean,
    monitor_watcher: t.boolean,
    monitor_transform: t.boolean,
    read_ilm: t.boolean,
    manage_security: t.boolean,
    manage_own_api_key: t.boolean,
    manage_saml: t.boolean,
    all: t.boolean,
    manage_ilm: t.boolean,
    manage_ingest_pipelines: t.boolean,
    read_ccr: t.boolean,
    manage_rollup: t.boolean,
    monitor: t.boolean,
    manage_watcher: t.boolean,
    manage: t.boolean,
    manage_transform: t.boolean,
    manage_token: t.boolean,
    manage_ml: t.boolean,
    manage_pipeline: t.boolean,
    monitor_rollup: t.boolean,
    transport_client: t.boolean,
    create_snapshot: t.boolean
  }),
  index: indexRecord,
  is_authenticated: t.boolean,
  has_encryption_key: t.boolean
});
exports.privilege = privilege;