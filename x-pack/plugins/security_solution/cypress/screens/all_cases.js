"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EDIT_EXTERNAL_CONNECTION = exports.ALL_CASES_TAGS_COUNT = exports.ALL_CASES_TAGS = exports.ALL_CASES_SERVICE_NOW_INCIDENT = exports.ALL_CASES_REPORTERS_COUNT = exports.ALL_CASES_REPORTER = exports.ALL_CASES_PAGE_TITLE = exports.ALL_CASES_OPENED_ON = exports.ALL_CASES_OPEN_CASES_STATS = exports.ALL_CASES_OPEN_FILTER = exports.ALL_CASES_OPEN_CASES_COUNT = exports.ALL_CASES_NAME = exports.ALL_CASES_IN_PROGRESS_CASES_STATS = exports.ALL_CASES_DELETE_ACTION = exports.ALL_CASES_CREATE_NEW_CASE_TABLE_BTN = exports.ALL_CASES_CREATE_NEW_CASE_BTN = exports.ALL_CASES_COMMENTS_COUNT = exports.ALL_CASES_CLOSED_CASES_STATS = exports.ALL_CASES_CLOSE_ACTION = exports.ALL_CASES_CASE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ALL_CASES_CASE = id => {
  return `[data-test-subj="cases-table-row-${id}"]`;
};

exports.ALL_CASES_CASE = ALL_CASES_CASE;
const ALL_CASES_CLOSE_ACTION = '[data-test-subj="action-close"]';
exports.ALL_CASES_CLOSE_ACTION = ALL_CASES_CLOSE_ACTION;
const ALL_CASES_CLOSED_CASES_STATS = '[data-test-subj="closedStatsHeader"]';
exports.ALL_CASES_CLOSED_CASES_STATS = ALL_CASES_CLOSED_CASES_STATS;
const ALL_CASES_COMMENTS_COUNT = '[data-test-subj="case-table-column-commentCount"]';
exports.ALL_CASES_COMMENTS_COUNT = ALL_CASES_COMMENTS_COUNT;
const ALL_CASES_CREATE_NEW_CASE_BTN = '[data-test-subj="createNewCaseBtn"]';
exports.ALL_CASES_CREATE_NEW_CASE_BTN = ALL_CASES_CREATE_NEW_CASE_BTN;
const ALL_CASES_CREATE_NEW_CASE_TABLE_BTN = '[data-test-subj="cases-table-add-case"]';
exports.ALL_CASES_CREATE_NEW_CASE_TABLE_BTN = ALL_CASES_CREATE_NEW_CASE_TABLE_BTN;
const ALL_CASES_DELETE_ACTION = '[data-test-subj="action-delete"]';
exports.ALL_CASES_DELETE_ACTION = ALL_CASES_DELETE_ACTION;
const ALL_CASES_IN_PROGRESS_CASES_STATS = '[data-test-subj="inProgressStatsHeader"]';
exports.ALL_CASES_IN_PROGRESS_CASES_STATS = ALL_CASES_IN_PROGRESS_CASES_STATS;
const ALL_CASES_NAME = '[data-test-subj="case-details-link"]';
exports.ALL_CASES_NAME = ALL_CASES_NAME;
const ALL_CASES_OPEN_CASES_COUNT = '[data-test-subj="case-status-filter"]';
exports.ALL_CASES_OPEN_CASES_COUNT = ALL_CASES_OPEN_CASES_COUNT;
const ALL_CASES_OPEN_FILTER = '[data-test-subj="case-status-filter-open"]';
exports.ALL_CASES_OPEN_FILTER = ALL_CASES_OPEN_FILTER;
const ALL_CASES_OPEN_CASES_STATS = '[data-test-subj="openStatsHeader"]';
exports.ALL_CASES_OPEN_CASES_STATS = ALL_CASES_OPEN_CASES_STATS;
const ALL_CASES_OPENED_ON = '[data-test-subj="case-table-column-createdAt"]';
exports.ALL_CASES_OPENED_ON = ALL_CASES_OPENED_ON;
const ALL_CASES_PAGE_TITLE = '[data-test-subj="header-page-title"]';
exports.ALL_CASES_PAGE_TITLE = ALL_CASES_PAGE_TITLE;
const ALL_CASES_REPORTER = '[data-test-subj="case-table-column-createdBy"]';
exports.ALL_CASES_REPORTER = ALL_CASES_REPORTER;
const ALL_CASES_REPORTERS_COUNT = '[data-test-subj="options-filter-popover-button-Reporter"]';
exports.ALL_CASES_REPORTERS_COUNT = ALL_CASES_REPORTERS_COUNT;
const ALL_CASES_SERVICE_NOW_INCIDENT = '[data-test-subj="case-table-column-external-notPushed"]';
exports.ALL_CASES_SERVICE_NOW_INCIDENT = ALL_CASES_SERVICE_NOW_INCIDENT;

const ALL_CASES_TAGS = index => {
  return `[data-test-subj="case-table-column-tags-${index}"]`;
};

exports.ALL_CASES_TAGS = ALL_CASES_TAGS;
const ALL_CASES_TAGS_COUNT = '[data-test-subj="options-filter-popover-button-Tags"]';
exports.ALL_CASES_TAGS_COUNT = ALL_CASES_TAGS_COUNT;
const EDIT_EXTERNAL_CONNECTION = '[data-test-subj="configure-case-button"]';
exports.EDIT_EXTERNAL_CONNECTION = EDIT_EXTERNAL_CONNECTION;