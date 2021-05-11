"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLOBAL_SEARCH_BAR_FILTER_ITEM = exports.ADD_FILTER_FORM_SAVE_BUTTON = exports.ADD_FILTER_FORM_FILTER_VALUE_INPUT = exports.ADD_FILTER_FORM_OPERATOR_OPTION_IS = exports.ADD_FILTER_FORM_OPERATOR_FIELD = exports.ADD_FILTER_FORM_FIELD_OPTION = exports.ADD_FILTER_FORM_FIELD_INPUT = exports.GLOBAL_SEARCH_BAR_SUBMIT_BUTTON = exports.GLOBAL_SEARCH_BAR_ADD_FILTER = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GLOBAL_SEARCH_BAR_ADD_FILTER = '[data-test-subj="globalDatePicker"] [data-test-subj="addFilter"]';
exports.GLOBAL_SEARCH_BAR_ADD_FILTER = GLOBAL_SEARCH_BAR_ADD_FILTER;
const GLOBAL_SEARCH_BAR_SUBMIT_BUTTON = '[data-test-subj="globalDatePicker"] [data-test-subj="querySubmitButton"]';
exports.GLOBAL_SEARCH_BAR_SUBMIT_BUTTON = GLOBAL_SEARCH_BAR_SUBMIT_BUTTON;
const ADD_FILTER_FORM_FIELD_INPUT = '[data-test-subj="filterFieldSuggestionList"] input[data-test-subj="comboBoxSearchInput"]';
exports.ADD_FILTER_FORM_FIELD_INPUT = ADD_FILTER_FORM_FIELD_INPUT;

const ADD_FILTER_FORM_FIELD_OPTION = value => `[data-test-subj="comboBoxOptionsList filterFieldSuggestionList-optionsList"] button[title="${value}"] mark`;

exports.ADD_FILTER_FORM_FIELD_OPTION = ADD_FILTER_FORM_FIELD_OPTION;
const ADD_FILTER_FORM_OPERATOR_FIELD = '[data-test-subj="filterOperatorList"] input[data-test-subj="comboBoxSearchInput"]';
exports.ADD_FILTER_FORM_OPERATOR_FIELD = ADD_FILTER_FORM_OPERATOR_FIELD;
const ADD_FILTER_FORM_OPERATOR_OPTION_IS = '[data-test-subj="comboBoxOptionsList filterOperatorList-optionsList"] button[title="is"]';
exports.ADD_FILTER_FORM_OPERATOR_OPTION_IS = ADD_FILTER_FORM_OPERATOR_OPTION_IS;
const ADD_FILTER_FORM_FILTER_VALUE_INPUT = '[data-test-subj="filterParams"] input';
exports.ADD_FILTER_FORM_FILTER_VALUE_INPUT = ADD_FILTER_FORM_FILTER_VALUE_INPUT;
const ADD_FILTER_FORM_SAVE_BUTTON = '[data-test-subj="saveFilter"]';
exports.ADD_FILTER_FORM_SAVE_BUTTON = ADD_FILTER_FORM_SAVE_BUTTON;
const GLOBAL_SEARCH_BAR_FILTER_ITEM = '#popoverFor_filter0';
exports.GLOBAL_SEARCH_BAR_FILTER_ITEM = GLOBAL_SEARCH_BAR_FILTER_ITEM;