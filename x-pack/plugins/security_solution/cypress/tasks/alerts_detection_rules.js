"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goToNextPage = exports.goToPage = exports.changeRowsPerPageTo300 = exports.changeRowsPerPageTo = exports.resetAllRulesIdleModalTimeout = exports.checkAllRulesIdleModal = exports.dismissAllRulesIdleModal = exports.checkAutoRefresh = exports.waitForRuleToBeActivated = exports.waitForPrebuiltDetectionRulesToBeLoaded = exports.waitForRulesTableToBeAutoRefreshed = exports.waitForRulesTableToBeRefreshed = exports.waitForRulesTableToBeLoaded = exports.sortByActivatedRules = exports.selectNumberOfRules = exports.reloadDeletedRules = exports.loadPrebuiltDetectionRules = exports.goToRuleDetails = exports.goToCreateNewRule = exports.filterByCustomRules = exports.exportFirstRule = exports.deleteSelectedRules = exports.deleteRule = exports.deleteFirstRule = exports.duplicateRuleFromMenu = exports.duplicateFirstRule = exports.editFirstRule = exports.activateRule = void 0;

var _alerts_detection_rules = require("../screens/alerts_detection_rules");

var _rule_details = require("../screens/rule_details");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const activateRule = rulePosition => {
  cy.get(_alerts_detection_rules.RULE_SWITCH).eq(rulePosition).click({
    force: true
  });
};

exports.activateRule = activateRule;

const editFirstRule = () => {
  cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).should('be.visible');
  cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).first().click({
    force: true
  });
  cy.get(_alerts_detection_rules.EDIT_RULE_ACTION_BTN).should('be.visible');
  cy.get(_alerts_detection_rules.EDIT_RULE_ACTION_BTN).click();
};

exports.editFirstRule = editFirstRule;

const duplicateFirstRule = () => {
  cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).should('be.visible');
  cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).first().click({
    force: true
  });
  cy.get(_alerts_detection_rules.DUPLICATE_RULE_ACTION_BTN).should('be.visible');
  cy.get(_alerts_detection_rules.DUPLICATE_RULE_ACTION_BTN).click();
};
/**
 * Duplicates the rule from the menu and does additional
 * pipes and checking that the elements are present on the
 * page as well as removed when doing the clicks to help reduce
 * flake.
 */


exports.duplicateFirstRule = duplicateFirstRule;

const duplicateRuleFromMenu = () => {
  cy.get(_rule_details.ALL_ACTIONS).should('be.visible');
  cy.root().pipe($el => {
    $el.find(_rule_details.ALL_ACTIONS).trigger('click');
    return $el.find(_alerts_detection_rules.DUPLICATE_RULE_MENU_PANEL_BTN);
  }).should($el => expect($el).to.be.visible); // Because of a fade effect and fast clicking this can produce more than one click

  cy.get(_alerts_detection_rules.DUPLICATE_RULE_MENU_PANEL_BTN).pipe($el => $el.trigger('click')).should('not.be.visible');
};

exports.duplicateRuleFromMenu = duplicateRuleFromMenu;

const deleteFirstRule = () => {
  cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).first().click({
    force: true
  });
  cy.get(_alerts_detection_rules.DELETE_RULE_ACTION_BTN).click();
};

exports.deleteFirstRule = deleteFirstRule;

const deleteRule = () => {
  cy.get(_rule_details.ALL_ACTIONS).click();
  cy.get(_rule_details.DELETE_RULE).click();
};

exports.deleteRule = deleteRule;

const deleteSelectedRules = () => {
  cy.get(_alerts_detection_rules.BULK_ACTIONS_BTN).click({
    force: true
  });
  cy.get(_alerts_detection_rules.DELETE_RULE_BULK_BTN).click();
};

exports.deleteSelectedRules = deleteSelectedRules;

const exportFirstRule = () => {
  cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).first().click({
    force: true
  });
  cy.get(_alerts_detection_rules.EXPORT_ACTION_BTN).click();
  cy.get(_alerts_detection_rules.EXPORT_ACTION_BTN).should('not.exist');
};

exports.exportFirstRule = exportFirstRule;

const filterByCustomRules = () => {
  cy.get(_alerts_detection_rules.CUSTOM_RULES_BTN).click({
    force: true
  });
  waitForRulesTableToBeRefreshed();
};

exports.filterByCustomRules = filterByCustomRules;

const goToCreateNewRule = () => {
  cy.get(_alerts_detection_rules.CREATE_NEW_RULE_BTN).click({
    force: true
  });
};

exports.goToCreateNewRule = goToCreateNewRule;

const goToRuleDetails = () => {
  cy.get(_alerts_detection_rules.RULE_NAME).click({
    force: true
  });
};

exports.goToRuleDetails = goToRuleDetails;

const loadPrebuiltDetectionRules = () => {
  cy.get(_alerts_detection_rules.LOAD_PREBUILT_RULES_BTN).should('exist').click({
    force: true
  });
};

exports.loadPrebuiltDetectionRules = loadPrebuiltDetectionRules;

const reloadDeletedRules = () => {
  cy.get(_alerts_detection_rules.RELOAD_PREBUILT_RULES_BTN).click({
    force: true
  });
};
/**
 * Selects the number of rules. Since there can be missing click handlers
 * when the page loads at first, we use a pipe and a trigger of click
 * on it and then check to ensure that it is checked before continuing
 * with the tests.
 * @param numberOfRules The number of rules to click/check
 */


exports.reloadDeletedRules = reloadDeletedRules;

const selectNumberOfRules = numberOfRules => {
  for (let i = 0; i < numberOfRules; i++) {
    cy.get(_alerts_detection_rules.RULE_CHECKBOX).eq(i).pipe($el => $el.trigger('click')).should('be.checked');
  }
};

exports.selectNumberOfRules = selectNumberOfRules;

const sortByActivatedRules = () => {
  cy.get(_alerts_detection_rules.SORT_RULES_BTN).contains('Activated').click({
    force: true
  });
  waitForRulesTableToBeRefreshed();
  cy.get(_alerts_detection_rules.SORT_RULES_BTN).contains('Activated').click({
    force: true
  });
  waitForRulesTableToBeRefreshed();
};

exports.sortByActivatedRules = sortByActivatedRules;

const waitForRulesTableToBeLoaded = () => {
  cy.get(_alerts_detection_rules.RULES_TABLE_INITIAL_LOADING_INDICATOR).should('exist');
  cy.get(_alerts_detection_rules.RULES_TABLE_INITIAL_LOADING_INDICATOR).should('not.exist');
};

exports.waitForRulesTableToBeLoaded = waitForRulesTableToBeLoaded;

const waitForRulesTableToBeRefreshed = () => {
  cy.get(_alerts_detection_rules.RULES_TABLE_REFRESH_INDICATOR).should('exist');
  cy.get(_alerts_detection_rules.RULES_TABLE_REFRESH_INDICATOR).should('not.exist');
};

exports.waitForRulesTableToBeRefreshed = waitForRulesTableToBeRefreshed;

const waitForRulesTableToBeAutoRefreshed = () => {
  cy.get(_alerts_detection_rules.RULES_TABLE_AUTOREFRESH_INDICATOR).should('exist');
  cy.get(_alerts_detection_rules.RULES_TABLE_AUTOREFRESH_INDICATOR).should('not.exist');
};

exports.waitForRulesTableToBeAutoRefreshed = waitForRulesTableToBeAutoRefreshed;

const waitForPrebuiltDetectionRulesToBeLoaded = () => {
  cy.get(_alerts_detection_rules.LOAD_PREBUILT_RULES_BTN).should('not.exist');
  cy.get(_alerts_detection_rules.RULES_TABLE).should('exist');
};

exports.waitForPrebuiltDetectionRulesToBeLoaded = waitForPrebuiltDetectionRulesToBeLoaded;

const waitForRuleToBeActivated = () => {
  cy.get(_alerts_detection_rules.RULE_SWITCH_LOADER).should('exist');
  cy.get(_alerts_detection_rules.RULE_SWITCH_LOADER).should('not.exist');
};

exports.waitForRuleToBeActivated = waitForRuleToBeActivated;

const checkAutoRefresh = (ms, condition) => {
  cy.get(_alerts_detection_rules.RULES_TABLE_AUTOREFRESH_INDICATOR).should('not.exist');
  cy.tick(ms);
  cy.get(_alerts_detection_rules.RULES_TABLE_AUTOREFRESH_INDICATOR).should(condition);
};

exports.checkAutoRefresh = checkAutoRefresh;

const dismissAllRulesIdleModal = () => {
  cy.get(_alerts_detection_rules.RULE_AUTO_REFRESH_IDLE_MODAL_CONTINUE).eq(1).should('exist').click({
    force: true,
    multiple: true
  });
  cy.get(_alerts_detection_rules.RULE_AUTO_REFRESH_IDLE_MODAL).should('not.exist');
};

exports.dismissAllRulesIdleModal = dismissAllRulesIdleModal;

const checkAllRulesIdleModal = condition => {
  cy.tick(2700000);
  cy.get(_alerts_detection_rules.RULE_AUTO_REFRESH_IDLE_MODAL).should(condition);
};

exports.checkAllRulesIdleModal = checkAllRulesIdleModal;

const resetAllRulesIdleModalTimeout = () => {
  cy.tick(2000000);
  cy.window().trigger('mousemove', {
    force: true
  });
  cy.tick(700000);
};

exports.resetAllRulesIdleModalTimeout = resetAllRulesIdleModalTimeout;

const changeRowsPerPageTo = rowsCount => {
  cy.get(_alerts_detection_rules.PAGINATION_POPOVER_BTN).click({
    force: true
  });
  cy.get((0, _alerts_detection_rules.rowsPerPageSelector)(rowsCount)).click();
  waitForRulesTableToBeRefreshed();
};

exports.changeRowsPerPageTo = changeRowsPerPageTo;

const changeRowsPerPageTo300 = () => {
  changeRowsPerPageTo(300);
};

exports.changeRowsPerPageTo300 = changeRowsPerPageTo300;

const goToPage = pageNumber => {
  cy.get(_alerts_detection_rules.RULES_TABLE_REFRESH_INDICATOR).should('not.exist');
  cy.get((0, _alerts_detection_rules.pageSelector)(pageNumber)).last().click({
    force: true
  });
  waitForRulesTableToBeRefreshed();
};

exports.goToPage = goToPage;

const goToNextPage = () => {
  cy.get(_alerts_detection_rules.RULES_TABLE_REFRESH_INDICATOR).should('not.exist');
  cy.get(_alerts_detection_rules.NEXT_BTN).click({
    force: true
  });
  waitForRulesTableToBeRefreshed();
};

exports.goToNextPage = goToNextPage;