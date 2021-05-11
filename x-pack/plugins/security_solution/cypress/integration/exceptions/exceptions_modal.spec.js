"use strict";

var _rule = require("../../objects/rule");

var _create_new_rule = require("../../screens/create_new_rule");

var _alerts = require("../../tasks/alerts");

var _rules = require("../../tasks/api_calls/rules");

var _alerts_detection_rules = require("../../tasks/alerts_detection_rules");

var _es_archiver = require("../../tasks/es_archiver");

var _login = require("../../tasks/login");

var _rule_details = require("../../tasks/rule_details");

var _exceptions = require("../../tasks/exceptions");

var _exceptions2 = require("../../screens/exceptions");

var _navigation = require("../../urls/navigation");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// NOTE: You might look at these tests and feel they're overkill,
// but the exceptions modal has a lot of logic making it difficult
// to test in enzyme and very small changes can inadvertently add
// bugs. As the complexity within the builder grows, these should
// ensure the most basic logic holds.


describe('Exceptions modal', () => {
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRule)(_rule.newRule);
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules.goToRuleDetails)();
    cy.get(_create_new_rule.RULE_STATUS).should('have.text', '—'); // this is a made-up index that has just the necessary
    // mappings to conduct tests, avoiding loading large
    // amounts of data like in auditbeat_exceptions

    (0, _es_archiver.esArchiverLoad)('exceptions');
    (0, _rule_details.goToExceptionsTab)();
  });
  after(() => {
    (0, _es_archiver.esArchiverUnload)('exceptions');
  });
  it('Does not overwrite values and-ed together', () => {
    cy.get(_exceptions2.ADD_EXCEPTIONS_BTN).click({
      force: true
    }); // add multiple entries with invalid field values

    (0, _exceptions.addExceptionEntryFieldValue)('agent.name', 0);
    cy.get(_exceptions2.ADD_AND_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValue)('@timestamp', 1);
    cy.get(_exceptions2.ADD_AND_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValue)('c', 2); // delete second item, invalid values 'a' and 'c' should remain

    cy.get(_exceptions2.ENTRY_DELETE_BTN).eq(1).click();
    cy.get(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'agent.name');
    cy.get(_exceptions2.FIELD_INPUT).eq(1).should('have.text', 'c');
    (0, _exceptions.closeExceptionBuilderModal)();
  });
  it('Does not overwrite values or-ed together', () => {
    cy.get(_exceptions2.ADD_EXCEPTIONS_BTN).click({
      force: true
    }); // exception item 1

    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('agent.name', 0, 0);
    cy.get(_exceptions2.ADD_AND_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('user.id.keyword', 0, 1); // exception item 2

    cy.get(_exceptions2.ADD_OR_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('user.first', 1, 0);
    cy.get(_exceptions2.ADD_AND_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('user.last', 1, 1);
    cy.get(_exceptions2.ADD_AND_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('e', 1, 2); // delete single entry from exception item 2

    cy.get(_exceptions2.ENTRY_DELETE_BTN).eq(3).click();
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'agent.name');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(1).should('have.text', 'user.id.keyword');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'user.first');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(1).should('have.text', 'e'); // delete remaining entries in exception item 2

    cy.get(_exceptions2.ENTRY_DELETE_BTN).eq(2).click();
    cy.get(_exceptions2.ENTRY_DELETE_BTN).eq(2).click();
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'agent.name');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(1).should('have.text', 'user.id.keyword');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).should('not.exist');
    (0, _exceptions.closeExceptionBuilderModal)();
  });
  it('Does not overwrite values of nested entry items', () => {
    (0, _rule_details.openExceptionModalFromRuleSettings)();
    cy.get(_exceptions2.LOADING_SPINNER).should('not.exist'); // exception item 1

    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('agent.name', 0, 0);
    cy.get(_exceptions2.ADD_AND_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('b', 0, 1); // exception item 2 with nested field

    cy.get(_exceptions2.ADD_OR_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('c', 1, 0);
    cy.get(_exceptions2.ADD_NESTED_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('user.id{downarrow}{enter}', 1, 1);
    cy.get(_exceptions2.ADD_AND_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('last{downarrow}{enter}', 1, 3); // This button will now read `Add non-nested button`

    cy.get(_exceptions2.ADD_NESTED_BTN).click();
    (0, _exceptions.addExceptionEntryFieldValueOfItemX)('@timestamp', 1, 4); // should have only deleted `user.id`

    cy.get(_exceptions2.ENTRY_DELETE_BTN).eq(4).click();
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'agent.name');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(1).should('have.text', 'b');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'c');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(1).should('have.text', 'user');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(2).should('have.text', 'last');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(3).should('have.text', '@timestamp'); // deleting the last value of a nested entry, should delete the child and parent

    cy.get(_exceptions2.ENTRY_DELETE_BTN).eq(4).click();
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'agent.name');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(0).find(_exceptions2.FIELD_INPUT).eq(1).should('have.text', 'b');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(0).should('have.text', 'c');
    cy.get(_exceptions2.EXCEPTION_ITEM_CONTAINER).eq(1).find(_exceptions2.FIELD_INPUT).eq(1).should('have.text', '@timestamp');
    (0, _exceptions.closeExceptionBuilderModal)();
  });
});