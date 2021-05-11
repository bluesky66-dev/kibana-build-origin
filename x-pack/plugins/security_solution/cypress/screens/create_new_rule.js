"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THRESHOLD_TYPE = exports.THRESHOLD_INPUT_AREA = exports.THRESHOLD_FIELD_SELECTION = exports.TAGS_CLEAR_BUTTON = exports.TAGS_INPUT = exports.TAGS_FIELD = exports.SEVERITY_OVERRIDE_ROW = exports.SEVERITY_MAPPING_OVERRIDE_OPTION = exports.SEVERITY_DROPDOWN = exports.SCHEDULE_LOOKBACK_UNITS_INPUT = exports.SCHEDULE_LOOKBACK_AMOUNT_INPUT = exports.SCHEDULE_INTERVAL_UNITS_INPUT = exports.SCHEDULE_INTERVAL_AMOUNT_INPUT = exports.SCHEDULE_EDIT_TAB = exports.SCHEDULE_CONTINUE_BUTTON = exports.RUNS_EVERY_TIME_TYPE = exports.RUNS_EVERY_INTERVAL = exports.RULE_TIMESTAMP_OVERRIDE = exports.RULE_STATUS = exports.RULE_NAME_OVERRIDE = exports.RULE_NAME_INPUT = exports.RULE_DESCRIPTION_INPUT = exports.RULES_CREATION_PREVIEW = exports.RULES_CREATION_FORM = exports.RISK_OVERRIDE = exports.RISK_MAPPING_OVERRIDE_OPTION = exports.DEFAULT_RISK_SCORE_SLIDER = exports.DEFAULT_RISK_SCORE_INPUT = exports.REFRESH_BUTTON = exports.REFERENCE_URLS_INPUT = exports.QUERY_PREVIEW_BUTTON = exports.MITRE_ATTACK_ADD_SUBTECHNIQUE_BUTTON = exports.MITRE_ATTACK_ADD_TECHNIQUE_BUTTON = exports.MITRE_ATTACK_ADD_TACTIC_BUTTON = exports.MITRE_ATTACK_SUBTECHNIQUE_DROPDOWN = exports.MITRE_ATTACK_TECHNIQUE_DROPDOWN = exports.MITRE_ATTACK_TACTIC_DROPDOWN = exports.MITRE_TACTIC = exports.MACHINE_LEARNING_TYPE = exports.MACHINE_LEARNING_LIST = exports.MACHINE_LEARNING_DROPDOWN = exports.LOOK_BACK_TIME_TYPE = exports.LOOK_BACK_INTERVAL = exports.FALSE_POSITIVES_INPUT = exports.INVESTIGATION_NOTES_TEXTAREA = exports.INPUT = exports.INDICATOR_MATCH_TYPE = exports.IMPORT_QUERY_FROM_SAVED_TIMELINE_LINK = exports.EQL_QUERY_VALIDATION_SPINNER = exports.EQL_QUERY_PREVIEW_HISTOGRAM = exports.EQL_QUERY_INPUT = exports.EQL_TYPE = exports.DEFINE_INDEX_INPUT = exports.DEFINE_EDIT_TAB = exports.DEFINE_EDIT_BUTTON = exports.DEFINE_CONTINUE_BUTTON = exports.CUSTOM_QUERY_REQUIRED = exports.AT_LEAST_ONE_INDEX_PATTERN = exports.AT_LEAST_ONE_VALID_MATCH = exports.INVALID_MATCH_CONTENT = exports.THREAT_COMBO_BOX_INPUT = exports.THREAT_MATCH_OR_BUTTON = exports.THREAT_ITEM_ENTRY_DELETE_BUTTON = exports.THREAT_MATCH_AND_BUTTON = exports.THREAT_MATCH_INDICATOR_INDICATOR_INDEX = exports.THREAT_MATCH_INDICATOR_INDEX = exports.THREAT_MATCH_QUERY_INPUT = exports.THREAT_MATCH_INDICATOR_QUERY_INPUT = exports.THREAT_MATCH_CUSTOM_QUERY_INPUT = exports.THREAT_MAPPING_COMBO_BOX_INPUT = exports.CUSTOM_QUERY_INPUT = exports.CREATE_AND_ACTIVATE_BTN = exports.COMBO_BOX_RESULT = exports.COMBO_BOX_INPUT = exports.COMBO_BOX_CLEAR_BTN = exports.ADVANCED_SETTINGS_BTN = exports.ANOMALY_THRESHOLD_INPUT = exports.ADD_REFERENCE_URL_BTN = exports.ADD_FALSE_POSITIVE_BTN = exports.ACTIONS_THROTTLE_INPUT = exports.ACTIONS_EDIT_TAB = exports.ABOUT_EDIT_TAB = exports.ABOUT_EDIT_BUTTON = exports.ABOUT_CONTINUE_BTN = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ABOUT_CONTINUE_BTN = '[data-test-subj="about-continue"]';
exports.ABOUT_CONTINUE_BTN = ABOUT_CONTINUE_BTN;
const ABOUT_EDIT_BUTTON = '[data-test-subj="edit-about-rule"]';
exports.ABOUT_EDIT_BUTTON = ABOUT_EDIT_BUTTON;
const ABOUT_EDIT_TAB = '[data-test-subj="edit-rule-about-tab"]';
exports.ABOUT_EDIT_TAB = ABOUT_EDIT_TAB;
const ACTIONS_EDIT_TAB = '[data-test-subj="edit-rule-actions-tab"]';
exports.ACTIONS_EDIT_TAB = ACTIONS_EDIT_TAB;
const ACTIONS_THROTTLE_INPUT = '[data-test-subj="stepRuleActions"] [data-test-subj="select"]';
exports.ACTIONS_THROTTLE_INPUT = ACTIONS_THROTTLE_INPUT;
const ADD_FALSE_POSITIVE_BTN = '[data-test-subj="detectionEngineStepAboutRuleFalsePositives"] .euiButtonEmpty__text';
exports.ADD_FALSE_POSITIVE_BTN = ADD_FALSE_POSITIVE_BTN;
const ADD_REFERENCE_URL_BTN = '[data-test-subj="detectionEngineStepAboutRuleReferenceUrls"] .euiButtonEmpty__text';
exports.ADD_REFERENCE_URL_BTN = ADD_REFERENCE_URL_BTN;
const ANOMALY_THRESHOLD_INPUT = '[data-test-subj="anomalyThresholdSlider"] .euiFieldNumber';
exports.ANOMALY_THRESHOLD_INPUT = ANOMALY_THRESHOLD_INPUT;
const ADVANCED_SETTINGS_BTN = '[data-test-subj="advancedSettings"] .euiAccordion__button';
exports.ADVANCED_SETTINGS_BTN = ADVANCED_SETTINGS_BTN;
const COMBO_BOX_CLEAR_BTN = '[data-test-subj="comboBoxClearButton"]';
exports.COMBO_BOX_CLEAR_BTN = COMBO_BOX_CLEAR_BTN;
const COMBO_BOX_INPUT = '[data-test-subj="comboBoxInput"]';
exports.COMBO_BOX_INPUT = COMBO_BOX_INPUT;
const COMBO_BOX_RESULT = '.euiFilterSelectItem';
exports.COMBO_BOX_RESULT = COMBO_BOX_RESULT;
const CREATE_AND_ACTIVATE_BTN = '[data-test-subj="create-activate"]';
exports.CREATE_AND_ACTIVATE_BTN = CREATE_AND_ACTIVATE_BTN;
const CUSTOM_QUERY_INPUT = '[data-test-subj="queryInput"]';
exports.CUSTOM_QUERY_INPUT = CUSTOM_QUERY_INPUT;
const THREAT_MAPPING_COMBO_BOX_INPUT = '[data-test-subj="threatMatchInput"] [data-test-subj="fieldAutocompleteComboBox"]';
exports.THREAT_MAPPING_COMBO_BOX_INPUT = THREAT_MAPPING_COMBO_BOX_INPUT;
const THREAT_MATCH_CUSTOM_QUERY_INPUT = '[data-test-subj="detectionEngineStepDefineRuleQueryBar"] [data-test-subj="queryInput"]';
exports.THREAT_MATCH_CUSTOM_QUERY_INPUT = THREAT_MATCH_CUSTOM_QUERY_INPUT;
const THREAT_MATCH_INDICATOR_QUERY_INPUT = '[data-test-subj="detectionEngineStepDefineRuleThreatMatchIndices"] [data-test-subj="queryInput"]';
exports.THREAT_MATCH_INDICATOR_QUERY_INPUT = THREAT_MATCH_INDICATOR_QUERY_INPUT;
const THREAT_MATCH_QUERY_INPUT = '[data-test-subj="detectionEngineStepDefineThreatRuleQueryBar"] [data-test-subj="queryInput"]';
exports.THREAT_MATCH_QUERY_INPUT = THREAT_MATCH_QUERY_INPUT;
const THREAT_MATCH_INDICATOR_INDEX = '[data-test-subj="detectionEngineStepDefineRuleIndices"] [data-test-subj="comboBoxInput"]';
exports.THREAT_MATCH_INDICATOR_INDEX = THREAT_MATCH_INDICATOR_INDEX;
const THREAT_MATCH_INDICATOR_INDICATOR_INDEX = '[data-test-subj="detectionEngineStepDefineRuleThreatMatchIndices"] [data-test-subj="comboBoxInput"]';
exports.THREAT_MATCH_INDICATOR_INDICATOR_INDEX = THREAT_MATCH_INDICATOR_INDICATOR_INDEX;
const THREAT_MATCH_AND_BUTTON = '[data-test-subj="andButton"]';
exports.THREAT_MATCH_AND_BUTTON = THREAT_MATCH_AND_BUTTON;
const THREAT_ITEM_ENTRY_DELETE_BUTTON = '[data-test-subj="itemEntryDeleteButton"]';
exports.THREAT_ITEM_ENTRY_DELETE_BUTTON = THREAT_ITEM_ENTRY_DELETE_BUTTON;
const THREAT_MATCH_OR_BUTTON = '[data-test-subj="orButton"]';
exports.THREAT_MATCH_OR_BUTTON = THREAT_MATCH_OR_BUTTON;
const THREAT_COMBO_BOX_INPUT = '[data-test-subj="fieldAutocompleteComboBox"]';
exports.THREAT_COMBO_BOX_INPUT = THREAT_COMBO_BOX_INPUT;
const INVALID_MATCH_CONTENT = 'All matches require both a field and threat index field.';
exports.INVALID_MATCH_CONTENT = INVALID_MATCH_CONTENT;
const AT_LEAST_ONE_VALID_MATCH = 'At least one indicator match is required.';
exports.AT_LEAST_ONE_VALID_MATCH = AT_LEAST_ONE_VALID_MATCH;
const AT_LEAST_ONE_INDEX_PATTERN = 'A minimum of one index pattern is required.';
exports.AT_LEAST_ONE_INDEX_PATTERN = AT_LEAST_ONE_INDEX_PATTERN;
const CUSTOM_QUERY_REQUIRED = 'A custom query is required.';
exports.CUSTOM_QUERY_REQUIRED = CUSTOM_QUERY_REQUIRED;
const DEFINE_CONTINUE_BUTTON = '[data-test-subj="define-continue"]';
exports.DEFINE_CONTINUE_BUTTON = DEFINE_CONTINUE_BUTTON;
const DEFINE_EDIT_BUTTON = '[data-test-subj="edit-define-rule"]';
exports.DEFINE_EDIT_BUTTON = DEFINE_EDIT_BUTTON;
const DEFINE_EDIT_TAB = '[data-test-subj="edit-rule-define-tab"]';
exports.DEFINE_EDIT_TAB = DEFINE_EDIT_TAB;
const DEFINE_INDEX_INPUT = '[data-test-subj="detectionEngineStepDefineRuleIndices"] [data-test-subj="input"]';
exports.DEFINE_INDEX_INPUT = DEFINE_INDEX_INPUT;
const EQL_TYPE = '[data-test-subj="eqlRuleType"]';
exports.EQL_TYPE = EQL_TYPE;
const EQL_QUERY_INPUT = '[data-test-subj="eqlQueryBarTextInput"]';
exports.EQL_QUERY_INPUT = EQL_QUERY_INPUT;
const EQL_QUERY_PREVIEW_HISTOGRAM = '[data-test-subj="queryPreviewEqlHistogram"]';
exports.EQL_QUERY_PREVIEW_HISTOGRAM = EQL_QUERY_PREVIEW_HISTOGRAM;
const EQL_QUERY_VALIDATION_SPINNER = '[data-test-subj="eql-validation-loading"]';
exports.EQL_QUERY_VALIDATION_SPINNER = EQL_QUERY_VALIDATION_SPINNER;
const IMPORT_QUERY_FROM_SAVED_TIMELINE_LINK = '[data-test-subj="importQueryFromSavedTimeline"]';
exports.IMPORT_QUERY_FROM_SAVED_TIMELINE_LINK = IMPORT_QUERY_FROM_SAVED_TIMELINE_LINK;
const INDICATOR_MATCH_TYPE = '[data-test-subj="threatMatchRuleType"]';
exports.INDICATOR_MATCH_TYPE = INDICATOR_MATCH_TYPE;
const INPUT = '[data-test-subj="input"]';
exports.INPUT = INPUT;
const INVESTIGATION_NOTES_TEXTAREA = '[data-test-subj="detectionEngineStepAboutRuleNote"] textarea';
exports.INVESTIGATION_NOTES_TEXTAREA = INVESTIGATION_NOTES_TEXTAREA;
const FALSE_POSITIVES_INPUT = '[data-test-subj="detectionEngineStepAboutRuleFalsePositives"] input';
exports.FALSE_POSITIVES_INPUT = FALSE_POSITIVES_INPUT;
const LOOK_BACK_INTERVAL = '[data-test-subj="detectionEngineStepScheduleRuleFrom"] [data-test-subj="interval"]';
exports.LOOK_BACK_INTERVAL = LOOK_BACK_INTERVAL;
const LOOK_BACK_TIME_TYPE = '[data-test-subj="detectionEngineStepScheduleRuleFrom"] [data-test-subj="timeType"]';
exports.LOOK_BACK_TIME_TYPE = LOOK_BACK_TIME_TYPE;
const MACHINE_LEARNING_DROPDOWN = '[data-test-subj="mlJobSelect"] button';
exports.MACHINE_LEARNING_DROPDOWN = MACHINE_LEARNING_DROPDOWN;
const MACHINE_LEARNING_LIST = '.euiContextMenuItem__text';
exports.MACHINE_LEARNING_LIST = MACHINE_LEARNING_LIST;
const MACHINE_LEARNING_TYPE = '[data-test-subj="machineLearningRuleType"]';
exports.MACHINE_LEARNING_TYPE = MACHINE_LEARNING_TYPE;
const MITRE_TACTIC = '.euiContextMenuItem__text';
exports.MITRE_TACTIC = MITRE_TACTIC;
const MITRE_ATTACK_TACTIC_DROPDOWN = '[data-test-subj="mitreAttackTactic"]';
exports.MITRE_ATTACK_TACTIC_DROPDOWN = MITRE_ATTACK_TACTIC_DROPDOWN;
const MITRE_ATTACK_TECHNIQUE_DROPDOWN = '[data-test-subj="mitreAttackTechnique"]';
exports.MITRE_ATTACK_TECHNIQUE_DROPDOWN = MITRE_ATTACK_TECHNIQUE_DROPDOWN;
const MITRE_ATTACK_SUBTECHNIQUE_DROPDOWN = '[data-test-subj="mitreAttackSubtechnique"]';
exports.MITRE_ATTACK_SUBTECHNIQUE_DROPDOWN = MITRE_ATTACK_SUBTECHNIQUE_DROPDOWN;
const MITRE_ATTACK_ADD_TACTIC_BUTTON = '[data-test-subj="addMitreAttackTactic"]';
exports.MITRE_ATTACK_ADD_TACTIC_BUTTON = MITRE_ATTACK_ADD_TACTIC_BUTTON;
const MITRE_ATTACK_ADD_TECHNIQUE_BUTTON = '[data-test-subj="addMitreAttackTechnique"]';
exports.MITRE_ATTACK_ADD_TECHNIQUE_BUTTON = MITRE_ATTACK_ADD_TECHNIQUE_BUTTON;
const MITRE_ATTACK_ADD_SUBTECHNIQUE_BUTTON = '[data-test-subj="addMitreAttackSubtechnique"]';
exports.MITRE_ATTACK_ADD_SUBTECHNIQUE_BUTTON = MITRE_ATTACK_ADD_SUBTECHNIQUE_BUTTON;
const QUERY_PREVIEW_BUTTON = '[data-test-subj="queryPreviewButton"]';
exports.QUERY_PREVIEW_BUTTON = QUERY_PREVIEW_BUTTON;
const REFERENCE_URLS_INPUT = '[data-test-subj="detectionEngineStepAboutRuleReferenceUrls"] input';
exports.REFERENCE_URLS_INPUT = REFERENCE_URLS_INPUT;
const REFRESH_BUTTON = '[data-test-subj="refreshButton"]';
exports.REFRESH_BUTTON = REFRESH_BUTTON;
const DEFAULT_RISK_SCORE_INPUT = '[data-test-subj="detectionEngineStepAboutRuleRiskScore-defaultRiskRange"].euiRangeInput';
exports.DEFAULT_RISK_SCORE_INPUT = DEFAULT_RISK_SCORE_INPUT;
const DEFAULT_RISK_SCORE_SLIDER = '[data-test-subj="detectionEngineStepAboutRuleRiskScore-defaultRiskRange"].euiRangeSlider';
exports.DEFAULT_RISK_SCORE_SLIDER = DEFAULT_RISK_SCORE_SLIDER;
const RISK_MAPPING_OVERRIDE_OPTION = '#risk_score-mapping-override';
exports.RISK_MAPPING_OVERRIDE_OPTION = RISK_MAPPING_OVERRIDE_OPTION;
const RISK_OVERRIDE = '[data-test-subj="detectionEngineStepAboutRuleRiskScore-riskOverride"]';
exports.RISK_OVERRIDE = RISK_OVERRIDE;
const RULES_CREATION_FORM = '[data-test-subj="stepDefineRule"]';
exports.RULES_CREATION_FORM = RULES_CREATION_FORM;
const RULES_CREATION_PREVIEW = '[data-test-subj="ruleCreationQueryPreview"]';
exports.RULES_CREATION_PREVIEW = RULES_CREATION_PREVIEW;
const RULE_DESCRIPTION_INPUT = '[data-test-subj="detectionEngineStepAboutRuleDescription"] [data-test-subj="input"]';
exports.RULE_DESCRIPTION_INPUT = RULE_DESCRIPTION_INPUT;
const RULE_NAME_INPUT = '[data-test-subj="detectionEngineStepAboutRuleName"] [data-test-subj="input"]';
exports.RULE_NAME_INPUT = RULE_NAME_INPUT;
const RULE_NAME_OVERRIDE = '[data-test-subj="detectionEngineStepAboutRuleRuleNameOverride"]';
exports.RULE_NAME_OVERRIDE = RULE_NAME_OVERRIDE;
const RULE_STATUS = '[data-test-subj="ruleStatus"]';
exports.RULE_STATUS = RULE_STATUS;
const RULE_TIMESTAMP_OVERRIDE = '[data-test-subj="detectionEngineStepAboutRuleTimestampOverride"]';
exports.RULE_TIMESTAMP_OVERRIDE = RULE_TIMESTAMP_OVERRIDE;
const RUNS_EVERY_INTERVAL = '[data-test-subj="detectionEngineStepScheduleRuleInterval"] [data-test-subj="interval"]';
exports.RUNS_EVERY_INTERVAL = RUNS_EVERY_INTERVAL;
const RUNS_EVERY_TIME_TYPE = '[data-test-subj="detectionEngineStepScheduleRuleInterval"] [data-test-subj="timeType"]';
exports.RUNS_EVERY_TIME_TYPE = RUNS_EVERY_TIME_TYPE;
const SCHEDULE_CONTINUE_BUTTON = '[data-test-subj="schedule-continue"]';
exports.SCHEDULE_CONTINUE_BUTTON = SCHEDULE_CONTINUE_BUTTON;
const SCHEDULE_EDIT_TAB = '[data-test-subj="edit-rule-schedule-tab"]';
exports.SCHEDULE_EDIT_TAB = SCHEDULE_EDIT_TAB;
const SCHEDULE_INTERVAL_AMOUNT_INPUT = '[data-test-subj="detectionEngineStepScheduleRuleInterval"] [data-test-subj="interval"]';
exports.SCHEDULE_INTERVAL_AMOUNT_INPUT = SCHEDULE_INTERVAL_AMOUNT_INPUT;
const SCHEDULE_INTERVAL_UNITS_INPUT = '[data-test-subj="detectionEngineStepScheduleRuleInterval"] [data-test-subj="timeType"]';
exports.SCHEDULE_INTERVAL_UNITS_INPUT = SCHEDULE_INTERVAL_UNITS_INPUT;
const SCHEDULE_LOOKBACK_AMOUNT_INPUT = '[data-test-subj="detectionEngineStepScheduleRuleFrom"] [data-test-subj="timeType"]';
exports.SCHEDULE_LOOKBACK_AMOUNT_INPUT = SCHEDULE_LOOKBACK_AMOUNT_INPUT;
const SCHEDULE_LOOKBACK_UNITS_INPUT = '[data-test-subj="detectionEngineStepScheduleRuleFrom"] [data-test-subj="schedule-units-input"]';
exports.SCHEDULE_LOOKBACK_UNITS_INPUT = SCHEDULE_LOOKBACK_UNITS_INPUT;
const SEVERITY_DROPDOWN = '[data-test-subj="detectionEngineStepAboutRuleSeverity"] [data-test-subj="select"]';
exports.SEVERITY_DROPDOWN = SEVERITY_DROPDOWN;
const SEVERITY_MAPPING_OVERRIDE_OPTION = '#severity-mapping-override';
exports.SEVERITY_MAPPING_OVERRIDE_OPTION = SEVERITY_MAPPING_OVERRIDE_OPTION;
const SEVERITY_OVERRIDE_ROW = '[data-test-subj="severityOverrideRow"]';
exports.SEVERITY_OVERRIDE_ROW = SEVERITY_OVERRIDE_ROW;
const TAGS_FIELD = '[data-test-subj="detectionEngineStepAboutRuleTags"] [data-test-subj="comboBoxInput"]';
exports.TAGS_FIELD = TAGS_FIELD;
const TAGS_INPUT = '[data-test-subj="detectionEngineStepAboutRuleTags"] [data-test-subj="comboBoxSearchInput"]';
exports.TAGS_INPUT = TAGS_INPUT;
const TAGS_CLEAR_BUTTON = '[data-test-subj="detectionEngineStepAboutRuleTags"] [data-test-subj="comboBoxClearButton"]';
exports.TAGS_CLEAR_BUTTON = TAGS_CLEAR_BUTTON;
const THRESHOLD_FIELD_SELECTION = '.euiFilterSelectItem';
exports.THRESHOLD_FIELD_SELECTION = THRESHOLD_FIELD_SELECTION;
const THRESHOLD_INPUT_AREA = '[data-test-subj="thresholdInput"]';
exports.THRESHOLD_INPUT_AREA = THRESHOLD_INPUT_AREA;
const THRESHOLD_TYPE = '[data-test-subj="thresholdRuleType"]';
exports.THRESHOLD_TYPE = THRESHOLD_TYPE;