"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectedExportedRule = exports.editedRule = exports.severitiesOverride = exports.newThreatIndicatorRule = exports.eqlSequenceRule = exports.eqlRule = exports.machineLearningRule = exports.newThresholdRule = exports.newOverrideRule = exports.existingRule = exports.newRule = exports.indexPatterns = exports.totalNumberOfPrebuiltRulesInEsArchiveCustomRule = exports.totalNumberOfPrebuiltRulesInEsArchive = exports.totalNumberOfPrebuiltRules = void 0;

var _index = require("../../server/lib/detection_engine/rules/prepackaged_rules/index");

var _mitre_tactics_techniques = require("../../public/detections/mitre/mitre_tactics_techniques");

var _timeline = require("./timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @kbn/eslint/no-restricted-paths */


const totalNumberOfPrebuiltRules = _index.rawRules.length;
exports.totalNumberOfPrebuiltRules = totalNumberOfPrebuiltRules;
const totalNumberOfPrebuiltRulesInEsArchive = 127;
exports.totalNumberOfPrebuiltRulesInEsArchive = totalNumberOfPrebuiltRulesInEsArchive;
const totalNumberOfPrebuiltRulesInEsArchiveCustomRule = 145;
exports.totalNumberOfPrebuiltRulesInEsArchiveCustomRule = totalNumberOfPrebuiltRulesInEsArchiveCustomRule;
const indexPatterns = ['apm-*-transaction*', 'auditbeat-*', 'endgame-*', 'filebeat-*', 'logs-*', 'packetbeat-*', 'winlogbeat-*'];
exports.indexPatterns = indexPatterns;
const {
  tactic,
  technique,
  subtechnique
} = _mitre_tactics_techniques.mockThreatData;
const mitre1 = {
  tactic: `${tactic.name} (${tactic.id})`,
  techniques: [{
    name: `${technique.name} (${technique.id})`,
    subtechniques: [`${subtechnique.name} (${subtechnique.id})`]
  }, {
    name: `${technique.name} (${technique.id})`,
    subtechniques: []
  }]
};
const mitre2 = {
  tactic: `${tactic.name} (${tactic.id})`,
  techniques: [{
    name: `${technique.name} (${technique.id})`,
    subtechniques: [`${subtechnique.name} (${subtechnique.id})`]
  }]
};
const severityOverride1 = {
  sourceField: 'host.name',
  sourceValue: 'host'
};
const severityOverride2 = {
  sourceField: '@timestamp',
  sourceValue: '10/02/2020'
};
const severityOverride3 = {
  sourceField: 'host.geo.name',
  sourceValue: 'atack'
};
const severityOverride4 = {
  sourceField: 'agent.type',
  sourceValue: 'auditbeat'
};
const runsEvery = {
  interval: '1',
  timeType: 'Seconds',
  type: 's'
};
const lookBack = {
  interval: '17520',
  timeType: 'Hours',
  type: 'h'
};
const newRule = {
  customQuery: 'host.name: *',
  index: indexPatterns,
  name: 'New Rule Test',
  description: 'The new rule description.',
  severity: 'High',
  riskScore: '17',
  tags: ['test', 'newRule'],
  referenceUrls: ['https://www.google.com/', 'https://elastic.co/'],
  falsePositivesExamples: ['False1', 'False2'],
  mitre: [mitre1, mitre2],
  note: '# test markdown',
  runsEvery,
  lookBack,
  timeline: _timeline.timeline,
  maxSignals: 100
};
exports.newRule = newRule;
const existingRule = {
  customQuery: 'host.name: *',
  name: 'Rule 1',
  description: 'Description for Rule 1',
  index: ['auditbeat-*'],
  interval: '10s',
  severity: 'High',
  riskScore: '19',
  tags: ['rule1'],
  referenceUrls: [],
  falsePositivesExamples: [],
  mitre: [],
  note: 'This is my note',
  runsEvery,
  lookBack,
  timeline: _timeline.timeline,
  // Please do not change, or if you do, needs
  // to be any number other than default value
  maxSignals: 500
};
exports.existingRule = existingRule;
const newOverrideRule = {
  customQuery: 'host.name: *',
  index: indexPatterns,
  name: 'Override Rule',
  description: 'The new rule description.',
  severity: 'High',
  riskScore: '17',
  tags: ['test', 'newRule'],
  referenceUrls: ['https://www.google.com/', 'https://elastic.co/'],
  falsePositivesExamples: ['False1', 'False2'],
  mitre: [mitre1, mitre2],
  note: '# test markdown',
  severityOverride: [severityOverride1, severityOverride2, severityOverride3, severityOverride4],
  riskOverride: 'destination.port',
  nameOverride: 'agent.type',
  timestampOverride: '@timestamp',
  runsEvery,
  lookBack,
  timeline: _timeline.timeline,
  maxSignals: 100
};
exports.newOverrideRule = newOverrideRule;
const newThresholdRule = {
  customQuery: 'host.name: *',
  index: indexPatterns,
  name: 'Threshold Rule',
  description: 'The new rule description.',
  severity: 'High',
  riskScore: '17',
  tags: ['test', 'newRule'],
  referenceUrls: ['https://www.google.com/', 'https://elastic.co/'],
  falsePositivesExamples: ['False1', 'False2'],
  mitre: [mitre1, mitre2],
  note: '# test markdown',
  thresholdField: 'host.name',
  threshold: '10',
  runsEvery,
  lookBack,
  timeline: _timeline.timeline,
  maxSignals: 100
};
exports.newThresholdRule = newThresholdRule;
const machineLearningRule = {
  machineLearningJob: 'linux_anomalous_network_service',
  anomalyScoreThreshold: '20',
  name: 'New ML Rule Test',
  description: 'The new ML rule description.',
  severity: 'Critical',
  riskScore: '70',
  tags: ['ML'],
  referenceUrls: ['https://elastic.co/'],
  falsePositivesExamples: ['False1'],
  mitre: [mitre1],
  note: '# test markdown',
  runsEvery,
  lookBack
};
exports.machineLearningRule = machineLearningRule;
const eqlRule = {
  customQuery: 'any where process.name == "which"',
  name: 'New EQL Rule',
  index: indexPatterns,
  description: 'New EQL rule description.',
  severity: 'High',
  riskScore: '17',
  tags: ['test', 'newRule'],
  referenceUrls: ['https://www.google.com/', 'https://elastic.co/'],
  falsePositivesExamples: ['False1', 'False2'],
  mitre: [mitre1, mitre2],
  note: '# test markdown',
  runsEvery,
  lookBack,
  timeline: _timeline.timeline,
  maxSignals: 100
};
exports.eqlRule = eqlRule;
const eqlSequenceRule = {
  customQuery: 'sequence with maxspan=30s\
     [any where process.name == "which"]\
     [any where process.name == "xargs"]',
  name: 'New EQL Sequence Rule',
  index: indexPatterns,
  description: 'New EQL rule description.',
  severity: 'High',
  riskScore: '17',
  tags: ['test', 'newRule'],
  referenceUrls: ['https://www.google.com/', 'https://elastic.co/'],
  falsePositivesExamples: ['False1', 'False2'],
  mitre: [mitre1, mitre2],
  note: '# test markdown',
  runsEvery,
  lookBack,
  timeline: _timeline.timeline,
  maxSignals: 100
};
exports.eqlSequenceRule = eqlSequenceRule;
const newThreatIndicatorRule = {
  name: 'Threat Indicator Rule Test',
  description: 'The threat indicator rule description.',
  index: ['threat-data-*'],
  severity: 'Critical',
  riskScore: '20',
  tags: ['test', 'threat'],
  referenceUrls: ['https://www.google.com/', 'https://elastic.co/'],
  falsePositivesExamples: ['False1', 'False2'],
  mitre: [mitre1, mitre2],
  note: '# test markdown',
  runsEvery,
  lookBack,
  indicatorIndexPattern: ['threat-indicator-*'],
  indicatorMapping: 'agent.id',
  indicatorIndexField: 'agent.threat',
  timeline: _timeline.timeline,
  maxSignals: 100
};
exports.newThreatIndicatorRule = newThreatIndicatorRule;
const severitiesOverride = ['Low', 'Medium', 'High', 'Critical'];
exports.severitiesOverride = severitiesOverride;
const editedRule = { ...existingRule,
  severity: 'Medium',
  description: 'Edited Rule description',
  tags: [...existingRule.tags, 'edited']
};
exports.editedRule = editedRule;

const expectedExportedRule = ruleResponse => {
  const jsonrule = ruleResponse.body;
  return `{"author":[],"actions":[],"created_at":"${jsonrule.created_at}","updated_at":"${jsonrule.updated_at}","created_by":"elastic","description":"${jsonrule.description}","enabled":false,"false_positives":[],"from":"now-17520h","id":"${jsonrule.id}","immutable":false,"index":["exceptions-*"],"interval":"10s","rule_id":"rule_testing","language":"kuery","output_index":".siem-signals-default","max_signals":100,"risk_score":${jsonrule.risk_score},"risk_score_mapping":[],"name":"${jsonrule.name}","query":"${jsonrule.query}","references":[],"severity":"${jsonrule.severity}","severity_mapping":[],"updated_by":"elastic","tags":[],"to":"now","type":"query","threat":[],"throttle":"no_actions","version":1,"exceptions_list":[]}\n{"exported_count":1,"missing_rules":[],"missing_rules_count":0}\n`;
};

exports.expectedExportedRule = expectedExportedRule;