"use strict";

var _rules = require("../../helpers/rules");

var _rule = require("../../objects/rule");

var _alerts = require("../../screens/alerts");

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");

var _rule_details = require("../../screens/rule_details");

var _alerts2 = require("../../tasks/alerts");

var _alerts_detection_rules2 = require("../../tasks/alerts_detection_rules");

var _rules2 = require("../../tasks/api_calls/rules");

var _common = require("../../tasks/common");

var _create_new_rule = require("../../tasks/create_new_rule");

var _edit_rule = require("../../tasks/edit_rule");

var _es_archiver = require("../../tasks/es_archiver");

var _login = require("../../tasks/login");

var _rule_details2 = require("../../tasks/rule_details");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('indicator match', () => {
  describe('Detection rules, Indicator Match', () => {
    const expectedUrls = _rule.newThreatIndicatorRule.referenceUrls.join('');

    const expectedFalsePositives = _rule.newThreatIndicatorRule.falsePositivesExamples.join('');

    const expectedTags = _rule.newThreatIndicatorRule.tags.join('');

    const expectedMitre = (0, _rules.formatMitreAttackDescription)(_rule.newThreatIndicatorRule.mitre);
    const expectedNumberOfRules = 1;
    const expectedNumberOfAlerts = 1;
    before(() => {
      (0, _common.cleanKibana)();
      (0, _es_archiver.esArchiverLoad)('threat_indicator');
      (0, _es_archiver.esArchiverLoad)('threat_data');
    });
    after(() => {
      (0, _es_archiver.esArchiverUnload)('threat_indicator');
      (0, _es_archiver.esArchiverUnload)('threat_data');
    });
    describe('Creating new indicator match rules', () => {
      beforeEach(() => {
        (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.RULE_CREATION);
        (0, _create_new_rule.selectIndicatorMatchType)();
      });
      describe('Index patterns', () => {
        it('Contains a predefined index pattern', () => {
          (0, _create_new_rule.getIndicatorIndex)().should('have.text', _rule.indexPatterns.join(''));
        });
        it('Does NOT show invalidation text on initial page load if indicator index pattern is filled out', () => {
          (0, _create_new_rule.getIndicatorIndicatorIndex)().type(`${_rule.newThreatIndicatorRule.indicatorIndexPattern}{enter}`);
          (0, _create_new_rule.getDefineContinueButton)().click();
          (0, _create_new_rule.getIndexPatternInvalidationText)().should('not.exist');
        });
        it('Shows invalidation text when you try to continue without filling it out', () => {
          (0, _create_new_rule.getIndexPatternClearButton)().click();
          (0, _create_new_rule.getIndicatorIndicatorIndex)().type(`${_rule.newThreatIndicatorRule.indicatorIndexPattern}{enter}`);
          (0, _create_new_rule.getDefineContinueButton)().click();
          (0, _create_new_rule.getIndexPatternInvalidationText)().should('exist');
        });
      });
      describe('Indicator index patterns', () => {
        it('Contains empty index pattern', () => {
          (0, _create_new_rule.getIndicatorIndicatorIndex)().should('have.text', '');
        });
        it('Does NOT show invalidation text on initial page load', () => {
          (0, _create_new_rule.getIndexPatternInvalidationText)().should('not.exist');
        });
        it('Shows invalidation text if you try to continue without filling it out', () => {
          (0, _create_new_rule.getDefineContinueButton)().click();
          (0, _create_new_rule.getIndexPatternInvalidationText)().should('exist');
        });
      });
      describe('custom query input', () => {
        it('Has a default set of *:*', () => {
          (0, _create_new_rule.getCustomQueryInput)().should('have.text', '*:*');
        });
        it('Shows invalidation text if text is removed', () => {
          (0, _create_new_rule.getCustomQueryInput)().type('{selectall}{del}');
          (0, _create_new_rule.getCustomQueryInvalidationText)().should('exist');
        });
      });
      describe('custom indicator query input', () => {
        it('Has a default set of *:*', () => {
          (0, _create_new_rule.getCustomIndicatorQueryInput)().should('have.text', '*:*');
        });
        it('Shows invalidation text if text is removed', () => {
          (0, _create_new_rule.getCustomIndicatorQueryInput)().type('{selectall}{del}');
          (0, _create_new_rule.getCustomQueryInvalidationText)().should('exist');
        });
      });
      describe('Indicator mapping', () => {
        beforeEach(() => {
          (0, _create_new_rule.fillIndexAndIndicatorIndexPattern)(_rule.newThreatIndicatorRule.index, _rule.newThreatIndicatorRule.indicatorIndexPattern);
        });
        it('Does NOT show invalidation text on initial page load', () => {
          (0, _create_new_rule.getIndicatorInvalidationText)().should('not.exist');
        });
        it('Shows invalidation text when you try to press continue without filling anything out', () => {
          (0, _create_new_rule.getDefineContinueButton)().click();
          (0, _create_new_rule.getIndicatorAtLeastOneInvalidationText)().should('exist');
        });
        it('Shows invalidation text when the "AND" button is pressed and both the mappings are blank', () => {
          (0, _create_new_rule.getIndicatorAndButton)().click();
          (0, _create_new_rule.getIndicatorInvalidationText)().should('exist');
        });
        it('Shows invalidation text when the "OR" button is pressed and both the mappings are blank', () => {
          (0, _create_new_rule.getIndicatorOrButton)().click();
          (0, _create_new_rule.getIndicatorInvalidationText)().should('exist');
        });
        it('Does NOT show invalidation text when there is a valid "index field" and a valid "indicator index field"', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField
          });
          (0, _create_new_rule.getDefineContinueButton)().click();
          (0, _create_new_rule.getIndicatorInvalidationText)().should('not.exist');
        });
        it('Shows invalidation text when there is an invalid "index field" and a valid "indicator index field"', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: 'non-existent-value',
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField,
            validColumns: 'indicatorField'
          });
          (0, _create_new_rule.getDefineContinueButton)().click();
          (0, _create_new_rule.getIndicatorInvalidationText)().should('exist');
        });
        it('Shows invalidation text when there is a valid "index field" and an invalid "indicator index field"', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: 'non-existent-value',
            validColumns: 'indexField'
          });
          (0, _create_new_rule.getDefineContinueButton)().click();
          (0, _create_new_rule.getIndicatorInvalidationText)().should('exist');
        });
        it('Deletes the first row when you have two rows. Both rows valid rows of "index fields" and valid "indicator index fields". The second row should become the first row', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField
          });
          (0, _create_new_rule.getIndicatorAndButton)().click();
          (0, _create_new_rule.fillIndicatorMatchRow)({
            rowNumber: 2,
            indexField: 'agent.name',
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField,
            validColumns: 'indicatorField'
          });
          (0, _create_new_rule.getIndicatorDeleteButton)().click();
          (0, _create_new_rule.getIndicatorIndexComboField)().should('have.text', 'agent.name');
          (0, _create_new_rule.getIndicatorMappingComboField)().should('have.text', _rule.newThreatIndicatorRule.indicatorIndexField);
          (0, _create_new_rule.getIndicatorIndexComboField)(2).should('not.exist');
          (0, _create_new_rule.getIndicatorMappingComboField)(2).should('not.exist');
        });
        it('Deletes the first row when you have two rows. Both rows have valid "index fields" and invalid "indicator index fields". The second row should become the first row', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: 'non-existent-value',
            validColumns: 'indexField'
          });
          (0, _create_new_rule.getIndicatorAndButton)().click();
          (0, _create_new_rule.fillIndicatorMatchRow)({
            rowNumber: 2,
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: 'second-non-existent-value',
            validColumns: 'indexField'
          });
          (0, _create_new_rule.getIndicatorDeleteButton)().click();
          (0, _create_new_rule.getIndicatorMappingComboField)().should('have.text', 'second-non-existent-value');
          (0, _create_new_rule.getIndicatorIndexComboField)(2).should('not.exist');
          (0, _create_new_rule.getIndicatorMappingComboField)(2).should('not.exist');
        });
        it('Deletes the first row when you have two rows. Both rows have valid "indicator index fields" and invalid "index fields". The second row should become the first row', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: 'non-existent-value',
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField,
            validColumns: 'indicatorField'
          });
          (0, _create_new_rule.getIndicatorAndButton)().click();
          (0, _create_new_rule.fillIndicatorMatchRow)({
            rowNumber: 2,
            indexField: 'second-non-existent-value',
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField,
            validColumns: 'indicatorField'
          });
          (0, _create_new_rule.getIndicatorDeleteButton)().click();
          (0, _create_new_rule.getIndicatorIndexComboField)().should('have.text', 'second-non-existent-value');
          (0, _create_new_rule.getIndicatorIndexComboField)(2).should('not.exist');
          (0, _create_new_rule.getIndicatorMappingComboField)(2).should('not.exist');
        });
        it('Deletes the first row of data but not the UI elements and the text defaults back to the placeholder of Search', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField
          });
          (0, _create_new_rule.getIndicatorDeleteButton)().click();
          (0, _create_new_rule.getIndicatorIndexComboField)().should('text', 'Search');
          (0, _create_new_rule.getIndicatorMappingComboField)().should('text', 'Search');
          (0, _create_new_rule.getIndicatorIndexComboField)(2).should('not.exist');
          (0, _create_new_rule.getIndicatorMappingComboField)(2).should('not.exist');
        });
        it('Deletes the second row when you have three rows. The first row is valid data, the second row is invalid data, and the third row is valid data. Third row should shift up correctly', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField
          });
          (0, _create_new_rule.getIndicatorAndButton)().click();
          (0, _create_new_rule.fillIndicatorMatchRow)({
            rowNumber: 2,
            indexField: 'non-existent-value',
            indicatorIndexField: 'non-existent-value',
            validColumns: 'none'
          });
          (0, _create_new_rule.getIndicatorAndButton)().click();
          (0, _create_new_rule.fillIndicatorMatchRow)({
            rowNumber: 3,
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField
          });
          (0, _create_new_rule.getIndicatorDeleteButton)(2).click();
          (0, _create_new_rule.getIndicatorIndexComboField)(1).should('text', _rule.newThreatIndicatorRule.indicatorMapping);
          (0, _create_new_rule.getIndicatorMappingComboField)(1).should('text', _rule.newThreatIndicatorRule.indicatorIndexField);
          (0, _create_new_rule.getIndicatorIndexComboField)(2).should('text', _rule.newThreatIndicatorRule.indicatorMapping);
          (0, _create_new_rule.getIndicatorMappingComboField)(2).should('text', _rule.newThreatIndicatorRule.indicatorIndexField);
          (0, _create_new_rule.getIndicatorIndexComboField)(3).should('not.exist');
          (0, _create_new_rule.getIndicatorMappingComboField)(3).should('not.exist');
        });
        it('Can add two OR rows and delete the second row. The first row has invalid data and the second row has valid data. The first row is deleted and the second row shifts up correctly.', () => {
          (0, _create_new_rule.fillIndicatorMatchRow)({
            indexField: 'non-existent-value-one',
            indicatorIndexField: 'non-existent-value-two',
            validColumns: 'none'
          });
          (0, _create_new_rule.getIndicatorOrButton)().click();
          (0, _create_new_rule.fillIndicatorMatchRow)({
            rowNumber: 2,
            indexField: _rule.newThreatIndicatorRule.indicatorMapping,
            indicatorIndexField: _rule.newThreatIndicatorRule.indicatorIndexField
          });
          (0, _create_new_rule.getIndicatorDeleteButton)().click();
          (0, _create_new_rule.getIndicatorIndexComboField)().should('text', _rule.newThreatIndicatorRule.indicatorMapping);
          (0, _create_new_rule.getIndicatorMappingComboField)().should('text', _rule.newThreatIndicatorRule.indicatorIndexField);
          (0, _create_new_rule.getIndicatorIndexComboField)(2).should('not.exist');
          (0, _create_new_rule.getIndicatorMappingComboField)(2).should('not.exist');
        });
      });
    });
    describe('Generating signals', () => {
      beforeEach(() => {
        (0, _common.cleanKibana)();
        (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
        (0, _alerts2.waitForAlertsPanelToBeLoaded)();
        (0, _alerts2.waitForAlertsIndexToBeCreated)();
        (0, _alerts2.goToManageAlertsDetectionRules)();
        (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
        (0, _alerts_detection_rules2.goToCreateNewRule)();
        (0, _create_new_rule.selectIndicatorMatchType)();
      });
      it('Creates and activates a new Indicator Match rule', () => {
        (0, _create_new_rule.fillDefineIndicatorMatchRuleAndContinue)(_rule.newThreatIndicatorRule);
        (0, _create_new_rule.fillAboutRuleAndContinue)(_rule.newThreatIndicatorRule);
        (0, _create_new_rule.fillScheduleRuleAndContinue)(_rule.newThreatIndicatorRule);
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
        cy.get(_alerts_detection_rules.RULE_NAME).should('have.text', _rule.newThreatIndicatorRule.name);
        cy.get(_alerts_detection_rules.RISK_SCORE).should('have.text', _rule.newThreatIndicatorRule.riskScore);
        cy.get(_alerts_detection_rules.SEVERITY).should('have.text', _rule.newThreatIndicatorRule.severity);
        cy.get(_alerts_detection_rules.RULE_SWITCH).should('have.attr', 'aria-checked', 'true');
        (0, _alerts_detection_rules2.goToRuleDetails)();
        cy.get(_rule_details.RULE_NAME_HEADER).should('have.text', `${_rule.newThreatIndicatorRule.name}`);
        cy.get(_rule_details.ABOUT_RULE_DESCRIPTION).should('have.text', _rule.newThreatIndicatorRule.description);
        cy.get(_rule_details.ABOUT_DETAILS).within(() => {
          (0, _rule_details.getDetails)(_rule_details.SEVERITY_DETAILS).should('have.text', _rule.newThreatIndicatorRule.severity);
          (0, _rule_details.getDetails)(_rule_details.RISK_SCORE_DETAILS).should('have.text', _rule.newThreatIndicatorRule.riskScore);
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
          (0, _rule_details.getDetails)(_rule_details.INDEX_PATTERNS_DETAILS).should('have.text', _rule.newThreatIndicatorRule.index.join(''));
          (0, _rule_details.getDetails)(_rule_details.CUSTOM_QUERY_DETAILS).should('have.text', '*:*');
          (0, _rule_details.getDetails)(_rule_details.RULE_TYPE_DETAILS).should('have.text', 'Indicator Match');
          (0, _rule_details.getDetails)(_rule_details.TIMELINE_TEMPLATE_DETAILS).should('have.text', 'None');
          (0, _rule_details.getDetails)(_rule_details.INDICATOR_INDEX_PATTERNS).should('have.text', _rule.newThreatIndicatorRule.indicatorIndexPattern.join(''));
          (0, _rule_details.getDetails)(_rule_details.INDICATOR_MAPPING).should('have.text', `${_rule.newThreatIndicatorRule.indicatorMapping} MATCHES ${_rule.newThreatIndicatorRule.indicatorIndexField}`);
          (0, _rule_details.getDetails)(_rule_details.INDICATOR_INDEX_QUERY).should('have.text', '*:*');
        });
        cy.get(_rule_details.SCHEDULE_DETAILS).within(() => {
          (0, _rule_details.getDetails)(_rule_details.RUNS_EVERY_DETAILS).should('have.text', `${_rule.newThreatIndicatorRule.runsEvery.interval}${_rule.newThreatIndicatorRule.runsEvery.type}`);
          (0, _rule_details.getDetails)(_rule_details.ADDITIONAL_LOOK_BACK_DETAILS).should('have.text', `${_rule.newThreatIndicatorRule.lookBack.interval}${_rule.newThreatIndicatorRule.lookBack.type}`);
        });
        (0, _create_new_rule.waitForTheRuleToBeExecuted)();
        (0, _create_new_rule.waitForAlertsToPopulate)();
        cy.get(_alerts.NUMBER_OF_ALERTS).should('have.text', expectedNumberOfAlerts);
        cy.get(_alerts.ALERT_RULE_NAME).first().should('have.text', _rule.newThreatIndicatorRule.name);
        cy.get(_alerts.ALERT_RULE_VERSION).first().should('have.text', '1');
        cy.get(_alerts.ALERT_RULE_METHOD).first().should('have.text', 'threat_match');
        cy.get(_alerts.ALERT_RULE_SEVERITY).first().should('have.text', _rule.newThreatIndicatorRule.severity.toLowerCase());
        cy.get(_alerts.ALERT_RULE_RISK_SCORE).first().should('have.text', _rule.newThreatIndicatorRule.riskScore);
      });
    });
    describe('Duplicates the indicator rule', () => {
      beforeEach(() => {
        (0, _common.cleanKibana)();
        (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
        (0, _alerts2.goToManageAlertsDetectionRules)();
        (0, _rules2.createCustomIndicatorRule)(_rule.newThreatIndicatorRule);
        (0, _common.reload)();
      });
      it('Allows the rule to be duplicated from the table', () => {
        (0, _edit_rule.waitForKibana)();
        (0, _alerts_detection_rules2.duplicateFirstRule)();
        cy.contains(_alerts_detection_rules.RULE_NAME, `${_rule.newThreatIndicatorRule.name} [Duplicate]`);
      });
      it('Allows the rule to be duplicated from the edit screen', () => {
        (0, _edit_rule.waitForKibana)();
        (0, _alerts_detection_rules2.goToRuleDetails)();
        (0, _alerts_detection_rules2.duplicateRuleFromMenu)();
        (0, _rule_details2.goBackToAllRulesTable)();
        (0, _common.reload)();
        cy.contains(_alerts_detection_rules.RULE_NAME, `${_rule.newThreatIndicatorRule.name} [Duplicate]`);
      });
    });
  });
});