"use strict";

var _rules = require("../../helpers/rules");

var _rule = require("../../objects/rule");

var _alerts = require("../../screens/alerts");

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");

var _rule_details = require("../../screens/rule_details");

var _alerts2 = require("../../tasks/alerts");

var _alerts_detection_rules2 = require("../../tasks/alerts_detection_rules");

var _timelines = require("../../tasks/api_calls/timelines");

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


describe('Detection rules, override', () => {
  const expectedUrls = _rule.newOverrideRule.referenceUrls.join('');

  const expectedFalsePositives = _rule.newOverrideRule.falsePositivesExamples.join('');

  const expectedTags = _rule.newOverrideRule.tags.join('');

  const expectedMitre = (0, _rules.formatMitreAttackDescription)(_rule.newOverrideRule.mitre);
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _timelines.createTimeline)(_rule.newOverrideRule.timeline).then(response => {
      cy.wrap({ ..._rule.newOverrideRule,
        timeline: { ..._rule.newOverrideRule.timeline,
          id: response.body.data.persistTimeline.timeline.savedObjectId
        }
      }).as('rule');
    });
  });
  it('Creates and activates a new custom rule with override option', function () {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts2.waitForAlertsPanelToBeLoaded)();
    (0, _alerts2.waitForAlertsIndexToBeCreated)();
    (0, _alerts2.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
    (0, _alerts_detection_rules2.goToCreateNewRule)();
    (0, _create_new_rule.fillDefineCustomRuleWithImportedQueryAndContinue)(this.rule);
    (0, _create_new_rule.fillAboutRuleWithOverrideAndContinue)(this.rule);
    (0, _create_new_rule.fillScheduleRuleAndContinue)(this.rule);
    (0, _create_new_rule.createAndActivateRule)();
    cy.get(_alerts_detection_rules.CUSTOM_RULES_BTN).should('have.text', 'Custom rules (1)');
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    const expectedNumberOfRules = 1;
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
      (0, _rule_details.getDetails)(_rule_details.RISK_SCORE_OVERRIDE_DETAILS).should('have.text', `${this.rule.riskOverride}signal.rule.risk_score`);
      (0, _rule_details.getDetails)(_rule_details.RULE_NAME_OVERRIDE_DETAILS).should('have.text', this.rule.nameOverride);
      (0, _rule_details.getDetails)(_rule_details.REFERENCE_URLS_DETAILS).should(details => {
        expect((0, _rule_details.removeExternalLinkText)(details.text())).equal(expectedUrls);
      });
      (0, _rule_details.getDetails)(_rule_details.FALSE_POSITIVES_DETAILS).should('have.text', expectedFalsePositives);
      (0, _rule_details.getDetails)(_rule_details.MITRE_ATTACK_DETAILS).should(mitre => {
        expect((0, _rule_details.removeExternalLinkText)(mitre.text())).equal(expectedMitre);
      });
      (0, _rule_details.getDetails)(_rule_details.TAGS_DETAILS).should('have.text', expectedTags);
      (0, _rule_details.getDetails)(_rule_details.TIMESTAMP_OVERRIDE_DETAILS).should('have.text', this.rule.timestampOverride);
      cy.contains(_rule_details.DETAILS_TITLE, 'Severity override').invoke('index', _rule_details.DETAILS_TITLE) // get index relative to other titles, not all siblings
      .then(severityOverrideIndex => {
        this.rule.severityOverride.forEach((severity, i) => {
          cy.get(_rule_details.DETAILS_DESCRIPTION).eq(severityOverrideIndex + i).should('have.text', `${severity.sourceField}:${severity.sourceValue}${_rule.severitiesOverride[i]}`);
        });
      });
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
      (0, _rule_details.getDetails)(_rule_details.RUNS_EVERY_DETAILS).should('have.text', `${this.rule.runsEvery.interval}${this.rule.runsEvery.type}`);
      (0, _rule_details.getDetails)(_rule_details.ADDITIONAL_LOOK_BACK_DETAILS).should('have.text', `${this.rule.lookBack.interval}${this.rule.lookBack.type}`);
    });
    (0, _create_new_rule.waitForTheRuleToBeExecuted)();
    (0, _create_new_rule.waitForAlertsToPopulate)();
    cy.get(_alerts.NUMBER_OF_ALERTS).should($count => expect(+$count.text()).to.be.gte(1));
    cy.get(_alerts.ALERT_RULE_NAME).first().should('have.text', 'auditbeat');
    cy.get(_alerts.ALERT_RULE_VERSION).first().should('have.text', '1');
    cy.get(_alerts.ALERT_RULE_METHOD).first().should('have.text', 'query');
    cy.get(_alerts.ALERT_RULE_SEVERITY).first().should('have.text', 'critical');
    (0, _alerts2.sortRiskScore)();
    cy.get(_alerts.ALERT_RULE_RISK_SCORE).first().should('have.text', '80');
  });
});