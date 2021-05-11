"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BACK_TO_RULES = exports.removeExternalLinkText = exports.getDetails = exports.TIMESTAMP_OVERRIDE_DETAILS = exports.TIMELINE_TEMPLATE_DETAILS = exports.THRESHOLD_DETAILS = exports.TAGS_DETAILS = exports.SEVERITY_DETAILS = exports.SCHEDULE_STEP = exports.SCHEDULE_DETAILS = exports.RUNS_EVERY_DETAILS = exports.RULE_TYPE_DETAILS = exports.RULE_SWITCH_LOADER = exports.RULE_SWITCH = exports.REMOVE_EXCEPTION_BTN = exports.REFERENCE_URLS_DETAILS = exports.RISK_SCORE_OVERRIDE_DETAILS = exports.RISK_SCORE_DETAILS = exports.RULE_NAME_OVERRIDE_DETAILS = exports.RULE_NAME_HEADER = exports.RULE_ABOUT_DETAILS_HEADER_TOGGLE = exports.REFRESH_BUTTON = exports.MITRE_ATTACK_DETAILS = exports.MACHINE_LEARNING_JOB_STATUS = exports.MACHINE_LEARNING_JOB_ID = exports.INVESTIGATION_NOTES_TOGGLE = exports.INVESTIGATION_NOTES_MARKDOWN = exports.INDICATOR_MAPPING = exports.INDICATOR_INDEX_QUERY = exports.INDICATOR_INDEX_PATTERNS = exports.INDEX_PATTERNS_DETAILS = exports.FALSE_POSITIVES_DETAILS = exports.EXCEPTIONS_TAB = exports.DETAILS_TITLE = exports.DETAILS_DESCRIPTION = exports.DELETE_RULE = exports.DEFINITION_DETAILS = exports.CUSTOM_QUERY_DETAILS = exports.ANOMALY_SCORE_DETAILS = exports.ALERTS_TAB = exports.ADDITIONAL_LOOK_BACK_DETAILS = exports.ABOUT_DETAILS = exports.ABOUT_RULE_DESCRIPTION = exports.ABOUT_INVESTIGATION_NOTES = exports.ALL_ACTIONS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ALL_ACTIONS = '[data-test-subj="rules-details-popover-button-icon"]';
exports.ALL_ACTIONS = ALL_ACTIONS;
const ABOUT_INVESTIGATION_NOTES = '[data-test-subj="stepAboutDetailsNoteContent"]';
exports.ABOUT_INVESTIGATION_NOTES = ABOUT_INVESTIGATION_NOTES;
const ABOUT_RULE_DESCRIPTION = '[data-test-subj=stepAboutRuleDetailsToggleDescriptionText]';
exports.ABOUT_RULE_DESCRIPTION = ABOUT_RULE_DESCRIPTION;
const ABOUT_DETAILS = '[data-test-subj="aboutRule"] [data-test-subj="listItemColumnStepRuleDescription"]';
exports.ABOUT_DETAILS = ABOUT_DETAILS;
const ADDITIONAL_LOOK_BACK_DETAILS = 'Additional look-back time';
exports.ADDITIONAL_LOOK_BACK_DETAILS = ADDITIONAL_LOOK_BACK_DETAILS;
const ALERTS_TAB = '[data-test-subj="alertsTab"]';
exports.ALERTS_TAB = ALERTS_TAB;
const ANOMALY_SCORE_DETAILS = 'Anomaly score';
exports.ANOMALY_SCORE_DETAILS = ANOMALY_SCORE_DETAILS;
const CUSTOM_QUERY_DETAILS = 'Custom query';
exports.CUSTOM_QUERY_DETAILS = CUSTOM_QUERY_DETAILS;
const DEFINITION_DETAILS = '[data-test-subj=definitionRule] [data-test-subj="listItemColumnStepRuleDescription"]';
exports.DEFINITION_DETAILS = DEFINITION_DETAILS;
const DELETE_RULE = '[data-test-subj=rules-details-delete-rule]';
exports.DELETE_RULE = DELETE_RULE;
const DETAILS_DESCRIPTION = '.euiDescriptionList__description';
exports.DETAILS_DESCRIPTION = DETAILS_DESCRIPTION;
const DETAILS_TITLE = '.euiDescriptionList__title';
exports.DETAILS_TITLE = DETAILS_TITLE;
const EXCEPTIONS_TAB = '[data-test-subj="exceptionsTab"]';
exports.EXCEPTIONS_TAB = EXCEPTIONS_TAB;
const FALSE_POSITIVES_DETAILS = 'False positive examples';
exports.FALSE_POSITIVES_DETAILS = FALSE_POSITIVES_DETAILS;
const INDEX_PATTERNS_DETAILS = 'Index patterns';
exports.INDEX_PATTERNS_DETAILS = INDEX_PATTERNS_DETAILS;
const INDICATOR_INDEX_PATTERNS = 'Indicator index patterns';
exports.INDICATOR_INDEX_PATTERNS = INDICATOR_INDEX_PATTERNS;
const INDICATOR_INDEX_QUERY = 'Indicator index query';
exports.INDICATOR_INDEX_QUERY = INDICATOR_INDEX_QUERY;
const INDICATOR_MAPPING = 'Indicator mapping';
exports.INDICATOR_MAPPING = INDICATOR_MAPPING;
const INVESTIGATION_NOTES_MARKDOWN = 'test markdown';
exports.INVESTIGATION_NOTES_MARKDOWN = INVESTIGATION_NOTES_MARKDOWN;
const INVESTIGATION_NOTES_TOGGLE = '[data-test-subj="stepAboutDetailsToggle-notes"]';
exports.INVESTIGATION_NOTES_TOGGLE = INVESTIGATION_NOTES_TOGGLE;
const MACHINE_LEARNING_JOB_ID = '[data-test-subj="machineLearningJobId"]';
exports.MACHINE_LEARNING_JOB_ID = MACHINE_LEARNING_JOB_ID;
const MACHINE_LEARNING_JOB_STATUS = '[data-test-subj="machineLearningJobStatus"]';
exports.MACHINE_LEARNING_JOB_STATUS = MACHINE_LEARNING_JOB_STATUS;
const MITRE_ATTACK_DETAILS = 'MITRE ATT&CK';
exports.MITRE_ATTACK_DETAILS = MITRE_ATTACK_DETAILS;
const REFRESH_BUTTON = '[data-test-subj="refreshButton"]';
exports.REFRESH_BUTTON = REFRESH_BUTTON;
const RULE_ABOUT_DETAILS_HEADER_TOGGLE = '[data-test-subj="stepAboutDetailsToggle"]';
exports.RULE_ABOUT_DETAILS_HEADER_TOGGLE = RULE_ABOUT_DETAILS_HEADER_TOGGLE;
const RULE_NAME_HEADER = '[data-test-subj="header-page-title"]';
exports.RULE_NAME_HEADER = RULE_NAME_HEADER;
const RULE_NAME_OVERRIDE_DETAILS = 'Rule name override';
exports.RULE_NAME_OVERRIDE_DETAILS = RULE_NAME_OVERRIDE_DETAILS;
const RISK_SCORE_DETAILS = 'Risk score';
exports.RISK_SCORE_DETAILS = RISK_SCORE_DETAILS;
const RISK_SCORE_OVERRIDE_DETAILS = 'Risk score override';
exports.RISK_SCORE_OVERRIDE_DETAILS = RISK_SCORE_OVERRIDE_DETAILS;
const REFERENCE_URLS_DETAILS = 'Reference URLs';
exports.REFERENCE_URLS_DETAILS = REFERENCE_URLS_DETAILS;
const REMOVE_EXCEPTION_BTN = '[data-test-subj="exceptionsViewerDeleteBtn"]';
exports.REMOVE_EXCEPTION_BTN = REMOVE_EXCEPTION_BTN;
const RULE_SWITCH = '[data-test-subj="ruleSwitch"]';
exports.RULE_SWITCH = RULE_SWITCH;
const RULE_SWITCH_LOADER = '[data-test-subj="rule-switch-loader"]';
exports.RULE_SWITCH_LOADER = RULE_SWITCH_LOADER;
const RULE_TYPE_DETAILS = 'Rule type';
exports.RULE_TYPE_DETAILS = RULE_TYPE_DETAILS;
const RUNS_EVERY_DETAILS = 'Runs every';
exports.RUNS_EVERY_DETAILS = RUNS_EVERY_DETAILS;
const SCHEDULE_DETAILS = '[data-test-subj=schedule] [data-test-subj="listItemColumnStepRuleDescription"]';
exports.SCHEDULE_DETAILS = SCHEDULE_DETAILS;
const SCHEDULE_STEP = '[data-test-subj="schedule"]  .euiDescriptionList__description';
exports.SCHEDULE_STEP = SCHEDULE_STEP;
const SEVERITY_DETAILS = 'Severity';
exports.SEVERITY_DETAILS = SEVERITY_DETAILS;
const TAGS_DETAILS = 'Tags';
exports.TAGS_DETAILS = TAGS_DETAILS;
const THRESHOLD_DETAILS = 'Threshold';
exports.THRESHOLD_DETAILS = THRESHOLD_DETAILS;
const TIMELINE_TEMPLATE_DETAILS = 'Timeline template';
exports.TIMELINE_TEMPLATE_DETAILS = TIMELINE_TEMPLATE_DETAILS;
const TIMESTAMP_OVERRIDE_DETAILS = 'Timestamp override';
exports.TIMESTAMP_OVERRIDE_DETAILS = TIMESTAMP_OVERRIDE_DETAILS;

const getDetails = title => cy.get(DETAILS_TITLE).contains(title).next(DETAILS_DESCRIPTION);

exports.getDetails = getDetails;

const removeExternalLinkText = str => str.replace(/\(opens in a new tab or window\)/g, '');

exports.removeExternalLinkText = removeExternalLinkText;
const BACK_TO_RULES = '[data-test-subj="ruleDetailsBackToAllRules"]';
exports.BACK_TO_RULES = BACK_TO_RULES;