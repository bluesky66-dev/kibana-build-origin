"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NEXT_BTN = exports.pageSelector = exports.rowsPerPageSelector = exports.PAGINATION_POPOVER_BTN = exports.RULE_AUTO_REFRESH_IDLE_MODAL_CONTINUE = exports.RULE_AUTO_REFRESH_IDLE_MODAL = exports.SORT_RULES_BTN = exports.SHOWING_RULES_TEXT = exports.SEVERITY = exports.SEVENTH_RULE = exports.RULES_ROW = exports.RULES_TABLE = exports.RULE_SWITCH_LOADER = exports.RULE_SWITCH = exports.RULE_NAME = exports.RULE_CHECKBOX = exports.SECOND_RULE = exports.RELOAD_PREBUILT_RULES_BTN = exports.RISK_SCORE = exports.RULES_TABLE_AUTOREFRESH_INDICATOR = exports.RULES_TABLE_REFRESH_INDICATOR = exports.RULES_TABLE_INITIAL_LOADING_INDICATOR = exports.LOAD_PREBUILT_RULES_BTN = exports.FOURTH_RULE = exports.FIRST_RULE = exports.FIFTH_RULE = exports.EXPORT_ACTION_BTN = exports.ELASTIC_RULES_BTN = exports.DELETE_RULE_BULK_BTN = exports.REFRESH_BTN = exports.DUPLICATE_RULE_MENU_PANEL_BTN = exports.DUPLICATE_RULE_ACTION_BTN = exports.EDIT_RULE_ACTION_BTN = exports.DELETE_RULE_ACTION_BTN = exports.CUSTOM_RULES_BTN = exports.COLLAPSED_ACTION_BTN = exports.CREATE_NEW_RULE_BTN = exports.BULK_ACTIONS_BTN = exports.ATTACH_ALERT_TO_CASE_BUTTON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ATTACH_ALERT_TO_CASE_BUTTON = '[data-test-subj="attach-alert-to-case-button"]';
exports.ATTACH_ALERT_TO_CASE_BUTTON = ATTACH_ALERT_TO_CASE_BUTTON;
const BULK_ACTIONS_BTN = '[data-test-subj="bulkActions"] span';
exports.BULK_ACTIONS_BTN = BULK_ACTIONS_BTN;
const CREATE_NEW_RULE_BTN = '[data-test-subj="create-new-rule"]';
exports.CREATE_NEW_RULE_BTN = CREATE_NEW_RULE_BTN;
const COLLAPSED_ACTION_BTN = '[data-test-subj="euiCollapsedItemActionsButton"]';
exports.COLLAPSED_ACTION_BTN = COLLAPSED_ACTION_BTN;
const CUSTOM_RULES_BTN = '[data-test-subj="showCustomRulesFilterButton"]';
exports.CUSTOM_RULES_BTN = CUSTOM_RULES_BTN;
const DELETE_RULE_ACTION_BTN = '[data-test-subj="deleteRuleAction"]';
exports.DELETE_RULE_ACTION_BTN = DELETE_RULE_ACTION_BTN;
const EDIT_RULE_ACTION_BTN = '[data-test-subj="editRuleAction"]';
exports.EDIT_RULE_ACTION_BTN = EDIT_RULE_ACTION_BTN;
const DUPLICATE_RULE_ACTION_BTN = '[data-test-subj="duplicateRuleAction"]';
exports.DUPLICATE_RULE_ACTION_BTN = DUPLICATE_RULE_ACTION_BTN;
const DUPLICATE_RULE_MENU_PANEL_BTN = '[data-test-subj="rules-details-duplicate-rule"]';
exports.DUPLICATE_RULE_MENU_PANEL_BTN = DUPLICATE_RULE_MENU_PANEL_BTN;
const REFRESH_BTN = '[data-test-subj="refreshRulesAction"] button';
exports.REFRESH_BTN = REFRESH_BTN;
const DELETE_RULE_BULK_BTN = '[data-test-subj="deleteRuleBulk"]';
exports.DELETE_RULE_BULK_BTN = DELETE_RULE_BULK_BTN;
const ELASTIC_RULES_BTN = '[data-test-subj="showElasticRulesFilterButton"]';
exports.ELASTIC_RULES_BTN = ELASTIC_RULES_BTN;
const EXPORT_ACTION_BTN = '[data-test-subj="exportRuleAction"]';
exports.EXPORT_ACTION_BTN = EXPORT_ACTION_BTN;
const FIFTH_RULE = 4;
exports.FIFTH_RULE = FIFTH_RULE;
const FIRST_RULE = 0;
exports.FIRST_RULE = FIRST_RULE;
const FOURTH_RULE = 3;
exports.FOURTH_RULE = FOURTH_RULE;
const LOAD_PREBUILT_RULES_BTN = '[data-test-subj="load-prebuilt-rules"]';
exports.LOAD_PREBUILT_RULES_BTN = LOAD_PREBUILT_RULES_BTN;
const RULES_TABLE_INITIAL_LOADING_INDICATOR = '[data-test-subj="initialLoadingPanelAllRulesTable"]';
exports.RULES_TABLE_INITIAL_LOADING_INDICATOR = RULES_TABLE_INITIAL_LOADING_INDICATOR;
const RULES_TABLE_REFRESH_INDICATOR = '[data-test-subj="loading-spinner"]';
exports.RULES_TABLE_REFRESH_INDICATOR = RULES_TABLE_REFRESH_INDICATOR;
const RULES_TABLE_AUTOREFRESH_INDICATOR = '[data-test-subj="loadingRulesInfoProgress"]';
exports.RULES_TABLE_AUTOREFRESH_INDICATOR = RULES_TABLE_AUTOREFRESH_INDICATOR;
const RISK_SCORE = '[data-test-subj="riskScore"]';
exports.RISK_SCORE = RISK_SCORE;
const RELOAD_PREBUILT_RULES_BTN = '[data-test-subj="reloadPrebuiltRulesBtn"]';
exports.RELOAD_PREBUILT_RULES_BTN = RELOAD_PREBUILT_RULES_BTN;
const SECOND_RULE = 1;
exports.SECOND_RULE = SECOND_RULE;
const RULE_CHECKBOX = '.euiTableRow .euiCheckbox__input';
exports.RULE_CHECKBOX = RULE_CHECKBOX;
const RULE_NAME = '[data-test-subj="ruleName"]';
exports.RULE_NAME = RULE_NAME;
const RULE_SWITCH = '[data-test-subj="ruleSwitch"]';
exports.RULE_SWITCH = RULE_SWITCH;
const RULE_SWITCH_LOADER = '[data-test-subj="ruleSwitchLoader"]';
exports.RULE_SWITCH_LOADER = RULE_SWITCH_LOADER;
const RULES_TABLE = '[data-test-subj="rules-table"]';
exports.RULES_TABLE = RULES_TABLE;
const RULES_ROW = '.euiTableRow';
exports.RULES_ROW = RULES_ROW;
const SEVENTH_RULE = 6;
exports.SEVENTH_RULE = SEVENTH_RULE;
const SEVERITY = '[data-test-subj="severity"]';
exports.SEVERITY = SEVERITY;
const SHOWING_RULES_TEXT = '[data-test-subj="showingRules"]';
exports.SHOWING_RULES_TEXT = SHOWING_RULES_TEXT;
const SORT_RULES_BTN = '[data-test-subj="tableHeaderSortButton"]';
exports.SORT_RULES_BTN = SORT_RULES_BTN;
const RULE_AUTO_REFRESH_IDLE_MODAL = '[data-test-subj="allRulesIdleModal"]';
exports.RULE_AUTO_REFRESH_IDLE_MODAL = RULE_AUTO_REFRESH_IDLE_MODAL;
const RULE_AUTO_REFRESH_IDLE_MODAL_CONTINUE = '[data-test-subj="allRulesIdleModal"] button';
exports.RULE_AUTO_REFRESH_IDLE_MODAL_CONTINUE = RULE_AUTO_REFRESH_IDLE_MODAL_CONTINUE;
const PAGINATION_POPOVER_BTN = '[data-test-subj="tablePaginationPopoverButton"]';
exports.PAGINATION_POPOVER_BTN = PAGINATION_POPOVER_BTN;

const rowsPerPageSelector = count => `[data-test-subj="tablePagination-${count}-rows"]`;

exports.rowsPerPageSelector = rowsPerPageSelector;

const pageSelector = pageNumber => `[data-test-subj="pagination-button-${pageNumber - 1}"]`;

exports.pageSelector = pageSelector;
const NEXT_BTN = '[data-test-subj="pagination-button-next"]';
exports.NEXT_BTN = NEXT_BTN;