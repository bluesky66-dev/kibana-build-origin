"use strict";

var _rules = require("../../helpers/rules");

var _rule = require("../../objects/rule");

var _alerts = require("../../screens/alerts");

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");

var _create_new_rule = require("../../screens/create_new_rule");

var _rule_details = require("../../screens/rule_details");

var _alerts2 = require("../../tasks/alerts");

var _alerts_detection_rules2 = require("../../tasks/alerts_detection_rules");

var _rules2 = require("../../tasks/api_calls/rules");

var _timelines = require("../../tasks/api_calls/timelines");

var _common = require("../../tasks/common");

var _create_new_rule2 = require("../../tasks/create_new_rule");

var _edit_rule = require("../../tasks/edit_rule");

var _login = require("../../tasks/login");

var _rule_details2 = require("../../tasks/rule_details");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Custom detection rules creation', () => {
  const expectedUrls = _rule.newRule.referenceUrls.join('');

  const expectedFalsePositives = _rule.newRule.falsePositivesExamples.join('');

  const expectedTags = _rule.newRule.tags.join('');

  const expectedMitre = (0, _rules.formatMitreAttackDescription)(_rule.newRule.mitre);
  const expectedNumberOfRules = 1;
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _timelines.createTimeline)(_rule.newRule.timeline).then(response => {
      cy.wrap({ ..._rule.newRule,
        timeline: { ..._rule.newRule.timeline,
          id: response.body.data.persistTimeline.timeline.savedObjectId
        }
      }).as('rule');
    });
  });
  it('Creates and activates a new rule', function () {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts2.waitForAlertsPanelToBeLoaded)();
    (0, _alerts2.waitForAlertsIndexToBeCreated)();
    (0, _alerts2.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
    (0, _alerts_detection_rules2.goToCreateNewRule)();
    (0, _create_new_rule2.fillDefineCustomRuleWithImportedQueryAndContinue)(this.rule);
    (0, _create_new_rule2.fillAboutRuleAndContinue)(this.rule);
    (0, _create_new_rule2.fillScheduleRuleAndContinue)(this.rule); // expect define step to repopulate

    cy.get(_create_new_rule.DEFINE_EDIT_BUTTON).click();
    cy.get(_create_new_rule.CUSTOM_QUERY_INPUT).should('have.value', this.rule.customQuery);
    cy.get(_create_new_rule.DEFINE_CONTINUE_BUTTON).should('exist').click({
      force: true
    });
    cy.get(_create_new_rule.DEFINE_CONTINUE_BUTTON).should('not.exist'); // expect about step to populate

    cy.get(_create_new_rule.ABOUT_EDIT_BUTTON).click();
    cy.get(_create_new_rule.RULE_NAME_INPUT).invoke('val').should('eql', this.rule.name);
    cy.get(_create_new_rule.ABOUT_CONTINUE_BTN).should('exist').click({
      force: true
    });
    cy.get(_create_new_rule.ABOUT_CONTINUE_BTN).should('not.exist');
    (0, _create_new_rule2.createAndActivateRule)();
    cy.get(_alerts_detection_rules.CUSTOM_RULES_BTN).should('have.text', 'Custom rules (1)');
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    cy.get(_alerts_detection_rules.RULES_TABLE).then($table => {
      cy.wrap($table.find(_alerts_detection_rules.RULES_ROW).length).should('eql', expectedNumberOfRules);
    });
    (0, _alerts_detection_rules2.filterByCustomRules)();
    cy.get(_alerts_detection_rules.RULES_TABLE).then($table => {
      cy.wrap($table.find(_alerts_detection_rules.RULES_ROW).length).should('eql', 1);
    });
    cy.get(_alerts_detection_rules.RULE_NAME).should('have.text', this.rule.name);
    cy.get(_alerts_detection_rules.RISK_SCORE).should('have.text', this.rule.riskScore);
    cy.get(_alerts_detection_rules.SEVERITY).should('have.text', this.rule.severity);
    cy.get(_alerts_detection_rules.RULE_SWITCH).should('have.attr', 'aria-checked', 'true');
    (0, _alerts_detection_rules2.goToRuleDetails)();
    cy.get(_rule_details.RULE_NAME_HEADER).should('have.text', `${this.rule.name}`);
    cy.get(_rule_details.ABOUT_RULE_DESCRIPTION).should('have.text', this.rule.description);
    cy.get(_rule_details.ABOUT_DETAILS).within(() => {
      (0, _rule_details.getDetails)(_rule_details.SEVERITY_DETAILS).should('have.text', this.rule.severity);
      (0, _rule_details.getDetails)(_rule_details.RISK_SCORE_DETAILS).should('have.text', this.rule.riskScore);
      (0, _rule_details.getDetails)(_rule_details.REFERENCE_URLS_DETAILS).should(details => {
        expect((0, _rule_details.removeExternalLinkText)(details.text())).equal(expectedUrls);
      });
      (0, _rule_details.getDetails)(_rule_details.FALSE_POSITIVES_DETAILS).should('have.text', expectedFalsePositives);
      (0, _rule_details.getDetails)(_rule_details.MITRE_ATTACK_DETAILS).should(mitre => {
        expect((0, _rule_details.removeExternalLinkText)(mitre.text())).equal(expectedMitre);
      });
      (0, _rule_details.getDetails)(_rule_details.TAGS_DETAILS).should('have.text', expectedTags);
    });
    cy.get(_rule_details.INVESTIGATION_NOTES_TOGGLE).click({
      force: true
    });
    cy.get(_rule_details.ABOUT_INVESTIGATION_NOTES).should('have.text', _rule_details.INVESTIGATION_NOTES_MARKDOWN);
    cy.get(_rule_details.DEFINITION_DETAILS).within(() => {
      (0, _rule_details.getDetails)(_rule_details.INDEX_PATTERNS_DETAILS).should('have.text', _rule.indexPatterns.join(''));
      (0, _rule_details.getDetails)(_rule_details.CUSTOM_QUERY_DETAILS).should('have.text', this.rule.customQuery);
      (0, _rule_details.getDetails)(_rule_details.RULE_TYPE_DETAILS).should('have.text', 'Query');
      (0, _rule_details.getDetails)(_rule_details.TIMELINE_TEMPLATE_DETAILS).should('have.text', 'None');
    });
    cy.get(_rule_details.SCHEDULE_DETAILS).within(() => {
      (0, _rule_details.getDetails)(_rule_details.RUNS_EVERY_DETAILS).should('have.text', `${_rule.newRule.runsEvery.interval}${_rule.newRule.runsEvery.type}`);
      (0, _rule_details.getDetails)(_rule_details.ADDITIONAL_LOOK_BACK_DETAILS).should('have.text', `${_rule.newRule.lookBack.interval}${_rule.newRule.lookBack.type}`);
    });
    (0, _create_new_rule2.waitForTheRuleToBeExecuted)();
    (0, _create_new_rule2.waitForAlertsToPopulate)();
    cy.get(_alerts.NUMBER_OF_ALERTS).should($count => expect(+$count.text()).to.be.gte(1));
    cy.get(_alerts.ALERT_RULE_NAME).first().should('have.text', this.rule.name);
    cy.get(_alerts.ALERT_RULE_VERSION).first().should('have.text', '1');
    cy.get(_alerts.ALERT_RULE_METHOD).first().should('have.text', 'query');
    cy.get(_alerts.ALERT_RULE_SEVERITY).first().should('have.text', this.rule.severity.toLowerCase());
    cy.get(_alerts.ALERT_RULE_RISK_SCORE).first().should('have.text', this.rule.riskScore);
  });
});
describe('Custom detection rules deletion and edition', () => {
  context('Deletion', () => {
    beforeEach(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
      (0, _alerts2.goToManageAlertsDetectionRules)();
      (0, _alerts2.waitForAlertsIndexToBeCreated)();
      (0, _rules2.createCustomRuleActivated)(_rule.newRule, 'rule1');
      (0, _rules2.createCustomRuleActivated)(_rule.newOverrideRule, 'rule2');
      (0, _rules2.createCustomRuleActivated)(_rule.existingRule, 'rule3');
      (0, _common.reload)();
    });
    it('Deletes one rule', () => {
      cy.get(_alerts_detection_rules.RULES_TABLE).find(_alerts_detection_rules.RULES_ROW).then(rules => {
        const initialNumberOfRules = rules.length;
        const expectedNumberOfRulesAfterDeletion = initialNumberOfRules - 1;
        cy.get(_alerts_detection_rules.SHOWING_RULES_TEXT).should('have.text', `Showing ${initialNumberOfRules} rules`);
        (0, _alerts_detection_rules2.deleteFirstRule)();
        (0, _alerts_detection_rules2.waitForRulesTableToBeRefreshed)();
        cy.get(_alerts_detection_rules.RULES_TABLE).then($table => {
          cy.wrap($table.find(_alerts_detection_rules.RULES_ROW).length).should('eql', expectedNumberOfRulesAfterDeletion);
        });
        cy.get(_alerts_detection_rules.SHOWING_RULES_TEXT).should('have.text', `Showing ${expectedNumberOfRulesAfterDeletion} rules`);
        cy.get(_alerts_detection_rules.CUSTOM_RULES_BTN).should('have.text', `Custom rules (${expectedNumberOfRulesAfterDeletion})`);
      });
    });
    it('Deletes more than one rule', () => {
      cy.get(_alerts_detection_rules.RULES_TABLE).find(_alerts_detection_rules.RULES_ROW).then(rules => {
        const initialNumberOfRules = rules.length;
        const numberOfRulesToBeDeleted = 2;
        const expectedNumberOfRulesAfterDeletion = initialNumberOfRules - numberOfRulesToBeDeleted;
        (0, _alerts_detection_rules2.selectNumberOfRules)(numberOfRulesToBeDeleted);
        (0, _alerts_detection_rules2.deleteSelectedRules)();
        (0, _alerts_detection_rules2.waitForRulesTableToBeRefreshed)();
        cy.get(_alerts_detection_rules.RULES_TABLE).then($table => {
          cy.wrap($table.find(_alerts_detection_rules.RULES_ROW).length).should('eql', expectedNumberOfRulesAfterDeletion);
        });
        cy.get(_alerts_detection_rules.SHOWING_RULES_TEXT).should('have.text', `Showing ${expectedNumberOfRulesAfterDeletion} rule`);
        cy.get(_alerts_detection_rules.CUSTOM_RULES_BTN).should('have.text', `Custom rules (${expectedNumberOfRulesAfterDeletion})`);
      });
    });
  });
  context('Edition', () => {
    const expectedEditedtags = _rule.editedRule.tags.join('');

    const expectedEditedIndexPatterns = _rule.editedRule.index && _rule.editedRule.index.length ? _rule.editedRule.index : _rule.indexPatterns;
    beforeEach(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
      (0, _alerts2.goToManageAlertsDetectionRules)();
      (0, _alerts2.waitForAlertsIndexToBeCreated)();
      (0, _rules2.createCustomRuleActivated)(_rule.existingRule, 'rule1');
      (0, _common.reload)();
    });
    it('Only modifies rule active status on enable/disable', () => {
      (0, _rule_details2.activatesRule)();
      cy.intercept('GET', `/api/detection_engine/rules?id=`).as('fetchRuleDetails');
      (0, _alerts_detection_rules2.goToRuleDetails)();
      cy.wait('@fetchRuleDetails').then(({
        response
      }) => {
        cy.wrap(response.statusCode).should('eql', 200);
        cy.wrap(response.body.max_signals).should('eql', _rule.existingRule.maxSignals);
        cy.wrap(response.body.enabled).should('eql', false);
      });
    });
    it('Allows a rule to be edited', () => {
      (0, _alerts_detection_rules2.editFirstRule)();
      (0, _edit_rule.waitForKibana)(); // expect define step to populate

      cy.get(_create_new_rule.CUSTOM_QUERY_INPUT).should('have.value', _rule.existingRule.customQuery);

      if (_rule.existingRule.index && _rule.existingRule.index.length > 0) {
        cy.get(_create_new_rule.DEFINE_INDEX_INPUT).should('have.text', _rule.existingRule.index.join(''));
      }

      (0, _create_new_rule2.goToAboutStepTab)(); // expect about step to populate

      cy.get(_create_new_rule.RULE_NAME_INPUT).invoke('val').should('eql', _rule.existingRule.name);
      cy.get(_create_new_rule.RULE_DESCRIPTION_INPUT).should('have.text', _rule.existingRule.description);
      cy.get(_create_new_rule.TAGS_FIELD).should('have.text', _rule.existingRule.tags.join(''));
      cy.get(_create_new_rule.SEVERITY_DROPDOWN).should('have.text', _rule.existingRule.severity);
      cy.get(_create_new_rule.DEFAULT_RISK_SCORE_INPUT).invoke('val').should('eql', _rule.existingRule.riskScore);
      (0, _create_new_rule2.goToScheduleStepTab)(); // expect schedule step to populate

      const intervalParts = _rule.existingRule.interval && _rule.existingRule.interval.match(/[0-9]+|[a-zA-Z]+/g);

      if (intervalParts) {
        const [amount, unit] = intervalParts;
        cy.get(_create_new_rule.SCHEDULE_INTERVAL_AMOUNT_INPUT).invoke('val').should('eql', amount);
        cy.get(_create_new_rule.SCHEDULE_INTERVAL_UNITS_INPUT).invoke('val').should('eql', unit);
      } else {
        throw new Error('Cannot assert scheduling info on a rule without an interval');
      }

      (0, _create_new_rule2.goToActionsStepTab)();
      cy.get(_create_new_rule.ACTIONS_THROTTLE_INPUT).invoke('val').should('eql', 'no_actions');
      (0, _create_new_rule2.goToAboutStepTab)();
      cy.get(_create_new_rule.TAGS_CLEAR_BUTTON).click({
        force: true
      });
      (0, _create_new_rule2.fillAboutRule)(_rule.editedRule);
      cy.intercept('GET', '/api/detection_engine/rules?id').as('getRule');
      (0, _edit_rule.saveEditedRule)();
      cy.wait('@getRule').then(({
        response
      }) => {
        cy.wrap(response.statusCode).should('eql', 200); // ensure that editing rule does not modify max_signals

        cy.wrap(response.body.max_signals).should('eql', _rule.existingRule.maxSignals);
      });
      cy.get(_rule_details.RULE_NAME_HEADER).should('have.text', `${_rule.editedRule.name}`);
      cy.get(_rule_details.ABOUT_RULE_DESCRIPTION).should('have.text', _rule.editedRule.description);
      cy.get(_rule_details.ABOUT_DETAILS).within(() => {
        (0, _rule_details.getDetails)(_rule_details.SEVERITY_DETAILS).should('have.text', _rule.editedRule.severity);
        (0, _rule_details.getDetails)(_rule_details.RISK_SCORE_DETAILS).should('have.text', _rule.editedRule.riskScore);
        (0, _rule_details.getDetails)(_rule_details.TAGS_DETAILS).should('have.text', expectedEditedtags);
      });
      cy.get(_rule_details.INVESTIGATION_NOTES_TOGGLE).click({
        force: true
      });
      cy.get(_rule_details.ABOUT_INVESTIGATION_NOTES).should('have.text', _rule.editedRule.note);
      cy.get(_rule_details.DEFINITION_DETAILS).within(() => {
        (0, _rule_details.getDetails)(_rule_details.INDEX_PATTERNS_DETAILS).should('have.text', expectedEditedIndexPatterns.join(''));
        (0, _rule_details.getDetails)(_rule_details.CUSTOM_QUERY_DETAILS).should('have.text', _rule.editedRule.customQuery);
        (0, _rule_details.getDetails)(_rule_details.RULE_TYPE_DETAILS).should('have.text', 'Query');
        (0, _rule_details.getDetails)(_rule_details.TIMELINE_TEMPLATE_DETAILS).should('have.text', 'None');
      });

      if (_rule.editedRule.interval) {
        cy.get(_rule_details.SCHEDULE_DETAILS).within(() => {
          (0, _rule_details.getDetails)(_rule_details.RUNS_EVERY_DETAILS).should('have.text', _rule.editedRule.interval);
        });
      }
    });
  });
});