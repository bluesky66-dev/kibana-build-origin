"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForTheRuleToBeExecuted = exports.waitForAlertsToPopulate = exports.selectThresholdRuleType = exports.selectMachineLearningRuleType = exports.selectIndicatorMatchType = exports.selectEqlRuleType = exports.goToActionsStepTab = exports.goToScheduleStepTab = exports.goToAboutStepTab = exports.goToDefineStepTab = exports.fillDefineMachineLearningRuleAndContinue = exports.fillDefineIndicatorMatchRuleAndContinue = exports.getCustomQueryInvalidationText = exports.getCustomIndicatorQueryInput = exports.getCustomQueryInput = exports.getIndexPatternClearButton = exports.getIndicatorIndicatorIndex = exports.getIndicatorIndex = exports.getDefineContinueButton = exports.getAboutContinueButton = exports.getIndexPatternInvalidationText = exports.getIndicatorAtLeastOneInvalidationText = exports.getIndicatorInvalidationText = exports.getIndicatorOrButton = exports.getIndicatorAndButton = exports.getIndicatorDeleteButton = exports.getIndicatorMappingComboField = exports.getIndicatorIndexComboField = exports.fillIndexAndIndicatorIndexPattern = exports.fillIndicatorMatchRow = exports.fillDefineEqlRuleAndContinue = exports.fillDefineThresholdRuleAndContinue = exports.fillScheduleRuleAndContinue = exports.fillDefineCustomRuleWithImportedQueryAndContinue = exports.fillAboutRuleWithOverrideAndContinue = exports.fillAboutRuleAndContinue = exports.fillAboutRule = exports.createAndActivateRule = void 0;

var _rule = require("../objects/rule");

var _create_new_rule = require("../screens/create_new_rule");

var _shared = require("../screens/shared");

var _timeline = require("../screens/timeline");

var _timelines = require("../screens/timelines");

var _security_header = require("./security_header");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createAndActivateRule = () => {
  cy.get(_create_new_rule.SCHEDULE_CONTINUE_BUTTON).click({
    force: true
  });
  cy.get(_create_new_rule.CREATE_AND_ACTIVATE_BTN).click({
    force: true
  });
  cy.get(_create_new_rule.CREATE_AND_ACTIVATE_BTN).should('not.exist');
};

exports.createAndActivateRule = createAndActivateRule;

const fillAboutRule = rule => {
  cy.get(_create_new_rule.RULE_NAME_INPUT).clear({
    force: true
  }).type(rule.name, {
    force: true
  });
  cy.get(_create_new_rule.RULE_DESCRIPTION_INPUT).clear({
    force: true
  }).type(rule.description, {
    force: true
  });
  cy.get(_create_new_rule.SEVERITY_DROPDOWN).click({
    force: true
  });
  cy.get(`#${rule.severity.toLowerCase()}`).click();
  cy.get(_create_new_rule.DEFAULT_RISK_SCORE_INPUT).type(`{selectall}${rule.riskScore}`, {
    force: true
  });
  rule.tags.forEach(tag => {
    cy.get(_create_new_rule.TAGS_INPUT).type(`${tag}{enter}`, {
      force: true
    });
  });
  cy.get(_create_new_rule.ADVANCED_SETTINGS_BTN).click({
    force: true
  });
  rule.referenceUrls.forEach((url, index) => {
    cy.get(_create_new_rule.REFERENCE_URLS_INPUT).eq(index).clear({
      force: true
    }).type(url, {
      force: true
    });
    cy.get(_create_new_rule.ADD_REFERENCE_URL_BTN).click({
      force: true
    });
  });
  rule.falsePositivesExamples.forEach((falsePositive, index) => {
    cy.get(_create_new_rule.FALSE_POSITIVES_INPUT).eq(index).clear({
      force: true
    }).type(falsePositive, {
      force: true
    });
    cy.get(_create_new_rule.ADD_FALSE_POSITIVE_BTN).click({
      force: true
    });
  });
  let techniqueIndex = 0;
  let subtechniqueInputIndex = 0;
  rule.mitre.forEach((mitre, tacticIndex) => {
    cy.get(_create_new_rule.MITRE_ATTACK_TACTIC_DROPDOWN).eq(tacticIndex).click({
      force: true
    });
    cy.contains(_create_new_rule.MITRE_TACTIC, mitre.tactic).click();
    mitre.techniques.forEach(technique => {
      cy.get(_create_new_rule.MITRE_ATTACK_ADD_TECHNIQUE_BUTTON).eq(tacticIndex).click({
        force: true
      });
      cy.get(_create_new_rule.MITRE_ATTACK_TECHNIQUE_DROPDOWN).eq(techniqueIndex).click({
        force: true
      });
      cy.contains(_create_new_rule.MITRE_TACTIC, technique.name).click();
      technique.subtechniques.forEach(subtechnique => {
        cy.get(_create_new_rule.MITRE_ATTACK_ADD_SUBTECHNIQUE_BUTTON).eq(techniqueIndex).click({
          force: true
        });
        cy.get(_create_new_rule.MITRE_ATTACK_SUBTECHNIQUE_DROPDOWN).eq(subtechniqueInputIndex).click({
          force: true
        });
        cy.contains(_create_new_rule.MITRE_TACTIC, subtechnique).click();
        subtechniqueInputIndex++;
      });
      techniqueIndex++;
    });
    cy.get(_create_new_rule.MITRE_ATTACK_ADD_TACTIC_BUTTON).click({
      force: true
    });
  });
  cy.get(_create_new_rule.INVESTIGATION_NOTES_TEXTAREA).clear({
    force: true
  }).type(rule.note, {
    force: true
  });
};

exports.fillAboutRule = fillAboutRule;

const fillAboutRuleAndContinue = rule => {
  fillAboutRule(rule);
  getAboutContinueButton().should('exist').click({
    force: true
  });
};

exports.fillAboutRuleAndContinue = fillAboutRuleAndContinue;

const fillAboutRuleWithOverrideAndContinue = rule => {
  cy.get(_create_new_rule.RULE_NAME_INPUT).type(rule.name, {
    force: true
  });
  cy.get(_create_new_rule.RULE_DESCRIPTION_INPUT).type(rule.description, {
    force: true
  });
  cy.get(_create_new_rule.SEVERITY_MAPPING_OVERRIDE_OPTION).click();
  rule.severityOverride.forEach((severity, i) => {
    cy.get(_create_new_rule.SEVERITY_OVERRIDE_ROW).eq(i).within(() => {
      cy.get(_create_new_rule.COMBO_BOX_INPUT).eq(0).type(`${severity.sourceField}{enter}`);
      cy.get(_create_new_rule.COMBO_BOX_INPUT).eq(1).type(`${severity.sourceValue}{enter}`);
    });
  });
  cy.get(_create_new_rule.SEVERITY_DROPDOWN).click({
    force: true
  });
  cy.get(`#${rule.severity.toLowerCase()}`).click();
  cy.get(_create_new_rule.RISK_MAPPING_OVERRIDE_OPTION).click();
  cy.get(_create_new_rule.RISK_OVERRIDE).within(() => {
    cy.get(_create_new_rule.COMBO_BOX_INPUT).type(`${rule.riskOverride}{enter}`);
  });
  cy.get(_create_new_rule.DEFAULT_RISK_SCORE_INPUT).type(`{selectall}${rule.riskScore}`, {
    force: true
  });
  rule.tags.forEach(tag => {
    cy.get(_create_new_rule.TAGS_INPUT).type(`${tag}{enter}`, {
      force: true
    });
  });
  cy.get(_create_new_rule.ADVANCED_SETTINGS_BTN).click({
    force: true
  });
  rule.referenceUrls.forEach((url, index) => {
    cy.get(_create_new_rule.REFERENCE_URLS_INPUT).eq(index).type(url, {
      force: true
    });
    cy.get(_create_new_rule.ADD_REFERENCE_URL_BTN).click({
      force: true
    });
  });
  rule.falsePositivesExamples.forEach((falsePositive, index) => {
    cy.get(_create_new_rule.FALSE_POSITIVES_INPUT).eq(index).type(falsePositive, {
      force: true
    });
    cy.get(_create_new_rule.ADD_FALSE_POSITIVE_BTN).click({
      force: true
    });
  });
  let techniqueIndex = 0;
  let subtechniqueInputIndex = 0;
  rule.mitre.forEach((mitre, tacticIndex) => {
    cy.get(_create_new_rule.MITRE_ATTACK_TACTIC_DROPDOWN).eq(tacticIndex).click({
      force: true
    });
    cy.contains(_create_new_rule.MITRE_TACTIC, mitre.tactic).click();
    mitre.techniques.forEach(technique => {
      cy.get(_create_new_rule.MITRE_ATTACK_ADD_TECHNIQUE_BUTTON).eq(tacticIndex).click({
        force: true
      });
      cy.get(_create_new_rule.MITRE_ATTACK_TECHNIQUE_DROPDOWN).eq(techniqueIndex).click({
        force: true
      });
      cy.contains(_create_new_rule.MITRE_TACTIC, technique.name).click();
      technique.subtechniques.forEach(subtechnique => {
        cy.get(_create_new_rule.MITRE_ATTACK_ADD_SUBTECHNIQUE_BUTTON).eq(techniqueIndex).click({
          force: true
        });
        cy.get(_create_new_rule.MITRE_ATTACK_SUBTECHNIQUE_DROPDOWN).eq(subtechniqueInputIndex).click({
          force: true
        });
        cy.contains(_create_new_rule.MITRE_TACTIC, subtechnique).click();
        subtechniqueInputIndex++;
      });
      techniqueIndex++;
    });
    cy.get(_create_new_rule.MITRE_ATTACK_ADD_TACTIC_BUTTON).click({
      force: true
    });
  });
  cy.get(_create_new_rule.INVESTIGATION_NOTES_TEXTAREA).type(rule.note, {
    force: true
  });
  cy.get(_create_new_rule.RULE_NAME_OVERRIDE).within(() => {
    cy.get(_create_new_rule.COMBO_BOX_INPUT).type(`${rule.nameOverride}{enter}`);
  });
  cy.get(_create_new_rule.RULE_TIMESTAMP_OVERRIDE).within(() => {
    cy.get(_create_new_rule.COMBO_BOX_INPUT).type(`${rule.timestampOverride}{enter}`);
  });
  getAboutContinueButton().should('exist').click({
    force: true
  });
};

exports.fillAboutRuleWithOverrideAndContinue = fillAboutRuleWithOverrideAndContinue;

const fillDefineCustomRuleWithImportedQueryAndContinue = rule => {
  cy.get(_create_new_rule.IMPORT_QUERY_FROM_SAVED_TIMELINE_LINK).click();
  cy.get((0, _timelines.TIMELINE)(rule.timeline.id)).click();
  cy.get(_create_new_rule.CUSTOM_QUERY_INPUT).should('have.value', rule.customQuery);
  cy.get(_create_new_rule.DEFINE_CONTINUE_BUTTON).should('exist').click({
    force: true
  });
  cy.get(_create_new_rule.CUSTOM_QUERY_INPUT).should('not.exist');
};

exports.fillDefineCustomRuleWithImportedQueryAndContinue = fillDefineCustomRuleWithImportedQueryAndContinue;

const fillScheduleRuleAndContinue = rule => {
  cy.get(_create_new_rule.RUNS_EVERY_INTERVAL).type('{selectall}').type(rule.runsEvery.interval);
  cy.get(_create_new_rule.RUNS_EVERY_TIME_TYPE).select(rule.runsEvery.timeType);
  cy.get(_create_new_rule.LOOK_BACK_INTERVAL).type('{selectAll}').type(rule.lookBack.interval);
  cy.get(_create_new_rule.LOOK_BACK_TIME_TYPE).select(rule.lookBack.timeType);
};

exports.fillScheduleRuleAndContinue = fillScheduleRuleAndContinue;

const fillDefineThresholdRuleAndContinue = rule => {
  const thresholdField = 0;
  const threshold = 1;
  cy.get(_create_new_rule.IMPORT_QUERY_FROM_SAVED_TIMELINE_LINK).click();
  cy.get((0, _timelines.TIMELINE)(rule.timeline.id)).click();
  cy.get(_create_new_rule.CUSTOM_QUERY_INPUT).should('have.value', rule.customQuery);
  cy.get(_create_new_rule.THRESHOLD_INPUT_AREA).find(_create_new_rule.INPUT).then(inputs => {
    cy.wrap(inputs[thresholdField]).type(rule.thresholdField);
    cy.get(_create_new_rule.THRESHOLD_FIELD_SELECTION).click({
      force: true
    });
    cy.wrap(inputs[threshold]).clear().type(rule.threshold);
  });
  cy.get(_create_new_rule.DEFINE_CONTINUE_BUTTON).should('exist').click({
    force: true
  });
  cy.get(_create_new_rule.CUSTOM_QUERY_INPUT).should('not.exist');
};

exports.fillDefineThresholdRuleAndContinue = fillDefineThresholdRuleAndContinue;

const fillDefineEqlRuleAndContinue = rule => {
  cy.get(_create_new_rule.RULES_CREATION_FORM).find(_create_new_rule.EQL_QUERY_INPUT).should('exist');
  cy.get(_create_new_rule.RULES_CREATION_FORM).find(_create_new_rule.EQL_QUERY_INPUT).should('be.visible');
  cy.get(_create_new_rule.RULES_CREATION_FORM).find(_create_new_rule.EQL_QUERY_INPUT).type(rule.customQuery);
  cy.get(_create_new_rule.RULES_CREATION_FORM).find(_create_new_rule.EQL_QUERY_VALIDATION_SPINNER).should('not.exist');
  cy.get(_create_new_rule.RULES_CREATION_PREVIEW).find(_create_new_rule.QUERY_PREVIEW_BUTTON).should('not.be.disabled').click({
    force: true
  });
  cy.get(_create_new_rule.EQL_QUERY_PREVIEW_HISTOGRAM).invoke('text').then(text => {
    if (text !== 'Hits') {
      cy.get(_create_new_rule.RULES_CREATION_PREVIEW).find(_create_new_rule.QUERY_PREVIEW_BUTTON).click({
        force: true
      });
      cy.get(_create_new_rule.EQL_QUERY_PREVIEW_HISTOGRAM).should('contain.text', 'Hits');
    }
  });
  cy.get(_shared.TOAST_ERROR).should('not.exist');
  cy.get(_create_new_rule.DEFINE_CONTINUE_BUTTON).should('exist').click({
    force: true
  });
  cy.get(`${_create_new_rule.RULES_CREATION_FORM} ${_create_new_rule.EQL_QUERY_INPUT}`).should('not.exist');
};
/**
 * Fills in the indicator match rows for tests by giving it an optional rowNumber,
 * a indexField, a indicatorIndexField, and an optional validRows which indicates
 * which row is valid or not.
 *
 * There are special tricks below with Eui combo box:
 * cy.get(`button[title="${indexField}"]`)
 * .should('be.visible')
 * .then(([e]) => e.click());
 *
 * To first ensure the button is there before clicking on the button. There are
 * race conditions where if the Eui drop down button from the combo box is not
 * visible then the click handler is not there either, and when we click on it
 * that will cause the item to _not_ be selected. Using a {enter} with the combo
 * box also does not select things from EuiCombo boxes either, so I have to click
 * the actual contents of the EuiCombo box to select things.
 */


exports.fillDefineEqlRuleAndContinue = fillDefineEqlRuleAndContinue;

const fillIndicatorMatchRow = ({
  rowNumber,
  indexField,
  indicatorIndexField,
  validColumns
}) => {
  const computedRowNumber = rowNumber == null ? 1 : rowNumber;
  const computedValueRows = validColumns == null ? 'both' : validColumns;
  cy.get(_create_new_rule.THREAT_MAPPING_COMBO_BOX_INPUT).eq(computedRowNumber * 2 - 2).eq(0).type(indexField);

  if (computedValueRows === 'indexField' || computedValueRows === 'both') {
    cy.get(`button[title="${indexField}"]`).should('be.visible').then(([e]) => e.click());
  }

  cy.get(_create_new_rule.THREAT_MAPPING_COMBO_BOX_INPUT).eq(computedRowNumber * 2 - 1).type(indicatorIndexField);

  if (computedValueRows === 'indicatorField' || computedValueRows === 'both') {
    cy.get(`button[title="${indicatorIndexField}"]`).should('be.visible').then(([e]) => e.click());
  }
};
/**
 * Fills in both the index pattern and the indicator match index pattern.
 * @param indexPattern  The index pattern.
 * @param indicatorIndex The indicator index pattern.
 */


exports.fillIndicatorMatchRow = fillIndicatorMatchRow;

const fillIndexAndIndicatorIndexPattern = (indexPattern, indicatorIndex) => {
  getIndexPatternClearButton().click();
  getIndicatorIndex().type(`${indexPattern}{enter}`);
  getIndicatorIndicatorIndex().type(`${indicatorIndex}{enter}`);
};
/** Returns the indicator index drop down field. Pass in row number, default is 1 */


exports.fillIndexAndIndicatorIndexPattern = fillIndexAndIndicatorIndexPattern;

const getIndicatorIndexComboField = (row = 1) => cy.get(_create_new_rule.THREAT_COMBO_BOX_INPUT).eq(row * 2 - 2);
/** Returns the indicator mapping drop down field. Pass in row number, default is 1 */


exports.getIndicatorIndexComboField = getIndicatorIndexComboField;

const getIndicatorMappingComboField = (row = 1) => cy.get(_create_new_rule.THREAT_COMBO_BOX_INPUT).eq(row * 2 - 1);
/** Returns the indicator matches DELETE button for the mapping. Pass in row number, default is 1  */


exports.getIndicatorMappingComboField = getIndicatorMappingComboField;

const getIndicatorDeleteButton = (row = 1) => cy.get(_create_new_rule.THREAT_ITEM_ENTRY_DELETE_BUTTON).eq(row - 1);
/** Returns the indicator matches AND button for the mapping */


exports.getIndicatorDeleteButton = getIndicatorDeleteButton;

const getIndicatorAndButton = () => cy.get(_create_new_rule.THREAT_MATCH_AND_BUTTON);
/** Returns the indicator matches OR button for the mapping */


exports.getIndicatorAndButton = getIndicatorAndButton;

const getIndicatorOrButton = () => cy.get(_create_new_rule.THREAT_MATCH_OR_BUTTON);
/** Returns the invalid match content. */


exports.getIndicatorOrButton = getIndicatorOrButton;

const getIndicatorInvalidationText = () => cy.contains(_create_new_rule.INVALID_MATCH_CONTENT);
/** Returns that at least one valid match is required content */


exports.getIndicatorInvalidationText = getIndicatorInvalidationText;

const getIndicatorAtLeastOneInvalidationText = () => cy.contains(_create_new_rule.AT_LEAST_ONE_VALID_MATCH);
/** Returns that at least one index pattern is required content */


exports.getIndicatorAtLeastOneInvalidationText = getIndicatorAtLeastOneInvalidationText;

const getIndexPatternInvalidationText = () => cy.contains(_create_new_rule.AT_LEAST_ONE_INDEX_PATTERN);
/** Returns the continue button on the step of about */


exports.getIndexPatternInvalidationText = getIndexPatternInvalidationText;

const getAboutContinueButton = () => cy.get(_create_new_rule.ABOUT_CONTINUE_BTN);
/** Returns the continue button on the step of define */


exports.getAboutContinueButton = getAboutContinueButton;

const getDefineContinueButton = () => cy.get(_create_new_rule.DEFINE_CONTINUE_BUTTON);
/** Returns the indicator index pattern */


exports.getDefineContinueButton = getDefineContinueButton;

const getIndicatorIndex = () => cy.get(_create_new_rule.THREAT_MATCH_INDICATOR_INDEX).eq(0);
/** Returns the indicator's indicator index */


exports.getIndicatorIndex = getIndicatorIndex;

const getIndicatorIndicatorIndex = () => cy.get(_create_new_rule.THREAT_MATCH_INDICATOR_INDICATOR_INDEX).eq(0);
/** Returns the index pattern's clear button  */


exports.getIndicatorIndicatorIndex = getIndicatorIndicatorIndex;

const getIndexPatternClearButton = () => cy.get(_create_new_rule.COMBO_BOX_CLEAR_BTN);
/** Returns the custom query input */


exports.getIndexPatternClearButton = getIndexPatternClearButton;

const getCustomQueryInput = () => cy.get(_create_new_rule.THREAT_MATCH_CUSTOM_QUERY_INPUT).eq(0);
/** Returns the custom query input */


exports.getCustomQueryInput = getCustomQueryInput;

const getCustomIndicatorQueryInput = () => cy.get(_create_new_rule.THREAT_MATCH_QUERY_INPUT).eq(0);
/** Returns custom query required content */


exports.getCustomIndicatorQueryInput = getCustomIndicatorQueryInput;

const getCustomQueryInvalidationText = () => cy.contains(_create_new_rule.CUSTOM_QUERY_REQUIRED);
/**
 * Fills in the define indicator match rules and then presses the continue button
 * @param rule The rule to use to fill in everything
 */


exports.getCustomQueryInvalidationText = getCustomQueryInvalidationText;

const fillDefineIndicatorMatchRuleAndContinue = rule => {
  fillIndexAndIndicatorIndexPattern(rule.index, rule.indicatorIndexPattern);
  fillIndicatorMatchRow({
    indexField: rule.indicatorMapping,
    indicatorIndexField: rule.indicatorIndexField
  });
  getDefineContinueButton().should('exist').click({
    force: true
  });
  cy.get(_create_new_rule.CUSTOM_QUERY_INPUT).should('not.exist');
};

exports.fillDefineIndicatorMatchRuleAndContinue = fillDefineIndicatorMatchRuleAndContinue;

const fillDefineMachineLearningRuleAndContinue = rule => {
  cy.get(_create_new_rule.MACHINE_LEARNING_DROPDOWN).click({
    force: true
  });
  cy.contains(_create_new_rule.MACHINE_LEARNING_LIST, rule.machineLearningJob).click();
  cy.get(_create_new_rule.ANOMALY_THRESHOLD_INPUT).type(`{selectall}${_rule.machineLearningRule.anomalyScoreThreshold}`, {
    force: true
  });
  getDefineContinueButton().should('exist').click({
    force: true
  });
  cy.get(_create_new_rule.MACHINE_LEARNING_DROPDOWN).should('not.exist');
};

exports.fillDefineMachineLearningRuleAndContinue = fillDefineMachineLearningRuleAndContinue;

const goToDefineStepTab = () => {
  cy.get(_create_new_rule.DEFINE_EDIT_TAB).click({
    force: true
  });
};

exports.goToDefineStepTab = goToDefineStepTab;

const goToAboutStepTab = () => {
  cy.get(_create_new_rule.ABOUT_EDIT_TAB).click({
    force: true
  });
};

exports.goToAboutStepTab = goToAboutStepTab;

const goToScheduleStepTab = () => {
  cy.get(_create_new_rule.SCHEDULE_EDIT_TAB).click({
    force: true
  });
};

exports.goToScheduleStepTab = goToScheduleStepTab;

const goToActionsStepTab = () => {
  cy.get(_create_new_rule.ACTIONS_EDIT_TAB).click({
    force: true
  });
};

exports.goToActionsStepTab = goToActionsStepTab;

const selectEqlRuleType = () => {
  cy.get(_create_new_rule.EQL_TYPE).click({
    force: true
  });
};

exports.selectEqlRuleType = selectEqlRuleType;

const selectIndicatorMatchType = () => {
  cy.get(_create_new_rule.INDICATOR_MATCH_TYPE).click({
    force: true
  });
};

exports.selectIndicatorMatchType = selectIndicatorMatchType;

const selectMachineLearningRuleType = () => {
  cy.get(_create_new_rule.MACHINE_LEARNING_TYPE).click({
    force: true
  });
};

exports.selectMachineLearningRuleType = selectMachineLearningRuleType;

const selectThresholdRuleType = () => {
  cy.get(_create_new_rule.THRESHOLD_TYPE).click({
    force: true
  });
};

exports.selectThresholdRuleType = selectThresholdRuleType;

const waitForAlertsToPopulate = async () => {
  cy.waitUntil(() => {
    (0, _security_header.refreshPage)();
    return cy.get(_timeline.SERVER_SIDE_EVENT_COUNT).invoke('text').then(countText => {
      const alertCount = parseInt(countText, 10) || 0;
      return alertCount > 0;
    });
  }, {
    interval: 500,
    timeout: 12000
  });
};

exports.waitForAlertsToPopulate = waitForAlertsToPopulate;

const waitForTheRuleToBeExecuted = () => {
  cy.waitUntil(() => {
    cy.get(_create_new_rule.REFRESH_BUTTON).click({
      force: true
    });
    return cy.get(_create_new_rule.RULE_STATUS).invoke('text').then(ruleStatus => ruleStatus === 'succeeded');
  });
};

exports.waitForTheRuleToBeExecuted = waitForTheRuleToBeExecuted;