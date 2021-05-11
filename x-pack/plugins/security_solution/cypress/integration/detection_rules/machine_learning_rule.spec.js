"use strict";

var _rules = require("../../helpers/rules");

var _rule = require("../../objects/rule");

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");

var _rule_details = require("../../screens/rule_details");

var _alerts = require("../../tasks/alerts");

var _alerts_detection_rules2 = require("../../tasks/alerts_detection_rules");

var _common = require("../../tasks/common");

var _create_new_rule = require("../../tasks/create_new_rule");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Detection rules, machine learning', () => {
  const expectedUrls = _rule.machineLearningRule.referenceUrls.join('');

  const expectedFalsePositives = _rule.machineLearningRule.falsePositivesExamples.join('');

  const expectedTags = _rule.machineLearningRule.tags.join('');

  const expectedMitre = (0, _rules.formatMitreAttackDescription)(_rule.machineLearningRule.mitre);
  const expectedNumberOfRules = 1;
  beforeEach(() => {
    (0, _common.cleanKibana)();
  });
  it('Creates and activates a new ml rule', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsPanelToBeLoaded)();
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
    (0, _alerts_detection_rules2.goToCreateNewRule)();
    (0, _create_new_rule.selectMachineLearningRuleType)();
    (0, _create_new_rule.fillDefineMachineLearningRuleAndContinue)(_rule.machineLearningRule);
    (0, _create_new_rule.fillAboutRuleAndContinue)(_rule.machineLearningRule);
    (0, _create_new_rule.fillScheduleRuleAndContinue)(_rule.machineLearningRule);
    (0, _create_new_rule.createAndActivateRule)();
    cy.get(_alerts_detection_rules.CUSTOM_RULES_BTN).should('have.text', 'Custom rules (1)');
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    cy.get(_alerts_detection_rules.RULES_TABLE).then($table => {
      cy.wrap($table.find(_alerts_detection_rules.RULES_ROW).length).should('eql', expectedNumberOfRules);
    });
    (0, _alerts_detection_rules2.filterByCustomRules)();
    cy.get(_alerts_detection_rules.RULES_TABLE).then($table => {
      cy.wrap($table.find(_alerts_detection_rules.RULES_ROW).length).should('eql', 1);
    });
    cy.get(_alerts_detection_rules.RULE_NAME).should('have.text', _rule.machineLearningRule.name);
    cy.get(_alerts_detection_rules.RISK_SCORE).should('have.text', _rule.machineLearningRule.riskScore);
    cy.get(_alerts_detection_rules.SEVERITY).should('have.text', _rule.machineLearningRule.severity);
    cy.get(_alerts_detection_rules.RULE_SWITCH).should('have.attr', 'aria-checked', 'true');
    (0, _alerts_detection_rules2.goToRuleDetails)();
    cy.get(_rule_details.RULE_NAME_HEADER).should('have.text', `${_rule.machineLearningRule.name}`);
    cy.get(_rule_details.ABOUT_RULE_DESCRIPTION).should('have.text', _rule.machineLearningRule.description);
    cy.get(_rule_details.ABOUT_DETAILS).within(() => {
      (0, _rule_details.getDetails)(_rule_details.SEVERITY_DETAILS).should('have.text', _rule.machineLearningRule.severity);
      (0, _rule_details.getDetails)(_rule_details.RISK_SCORE_DETAILS).should('have.text', _rule.machineLearningRule.riskScore);
      (0, _rule_details.getDetails)(_rule_details.REFERENCE_URLS_DETAILS).should(details => {
        expect((0, _rule_details.removeExternalLinkText)(details.text())).equal(expectedUrls);
      });
      (0, _rule_details.getDetails)(_rule_details.FALSE_POSITIVES_DETAILS).should('have.text', expectedFalsePositives);
      (0, _rule_details.getDetails)(_rule_details.MITRE_ATTACK_DETAILS).should(mitre => {
        expect((0, _rule_details.removeExternalLinkText)(mitre.text())).equal(expectedMitre);
      });
      (0, _rule_details.getDetails)(_rule_details.TAGS_DETAILS).should('have.text', expectedTags);
    });
    cy.get(_rule_details.DEFINITION_DETAILS).within(() => {
      (0, _rule_details.getDetails)(_rule_details.ANOMALY_SCORE_DETAILS).should('have.text', _rule.machineLearningRule.anomalyScoreThreshold);
      (0, _rule_details.getDetails)(_rule_details.RULE_TYPE_DETAILS).should('have.text', 'Machine Learning');
      (0, _rule_details.getDetails)(_rule_details.TIMELINE_TEMPLATE_DETAILS).should('have.text', 'None');
      cy.get(_rule_details.MACHINE_LEARNING_JOB_STATUS).should('have.text', 'Stopped');
      cy.get(_rule_details.MACHINE_LEARNING_JOB_ID).should('have.text', _rule.machineLearningRule.machineLearningJob);
    });
    cy.get(_rule_details.SCHEDULE_DETAILS).within(() => {
      (0, _rule_details.getDetails)(_rule_details.RUNS_EVERY_DETAILS).should('have.text', `${_rule.machineLearningRule.runsEvery.interval}${_rule.machineLearningRule.runsEvery.type}`);
      (0, _rule_details.getDetails)(_rule_details.ADDITIONAL_LOOK_BACK_DETAILS).should('have.text', `${_rule.machineLearningRule.lookBack.interval}${_rule.machineLearningRule.lookBack.type}`);
    });
  });
});