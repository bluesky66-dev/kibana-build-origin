"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REPORTER = exports.PARTICIPANTS = exports.DELETE_CASE_CONFIRMATION_BTN = exports.DELETE_CASE_BTN = exports.CONNECTOR_TITLE = exports.CONNECTOR_CARD_DETAILS = exports.CASE_DETAILS_USERNAMES = exports.CASE_DETAILS_USER_ACTION_DESCRIPTION_USERNAME = exports.CASE_DETAILS_USER_ACTION_DESCRIPTION_EVENT = exports.CASE_DETAILS_TIMELINE_LINK_MARKDOWN = exports.CASE_DETAILS_TAGS = exports.CASE_DETAILS_STATUS = exports.CASE_DETAILS_PUSH_TO_EXTERNAL_SERVICE_BTN = exports.CASE_DETAILS_PAGE_TITLE = exports.CASE_DETAILS_DESCRIPTION = exports.CASE_ACTIONS_BTN = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CASE_ACTIONS_BTN = '[data-test-subj="property-actions-ellipses"]';
exports.CASE_ACTIONS_BTN = CASE_ACTIONS_BTN;
const CASE_DETAILS_DESCRIPTION = '[data-test-subj="description-action"] [data-test-subj="user-action-markdown"]';
exports.CASE_DETAILS_DESCRIPTION = CASE_DETAILS_DESCRIPTION;
const CASE_DETAILS_PAGE_TITLE = '[data-test-subj="header-page-title"]';
exports.CASE_DETAILS_PAGE_TITLE = CASE_DETAILS_PAGE_TITLE;
const CASE_DETAILS_PUSH_TO_EXTERNAL_SERVICE_BTN = '[data-test-subj="push-to-external-service"]';
exports.CASE_DETAILS_PUSH_TO_EXTERNAL_SERVICE_BTN = CASE_DETAILS_PUSH_TO_EXTERNAL_SERVICE_BTN;
const CASE_DETAILS_STATUS = '[data-test-subj="case-view-status-dropdown"]';
exports.CASE_DETAILS_STATUS = CASE_DETAILS_STATUS;
const CASE_DETAILS_TAGS = '[data-test-subj="case-tags"]';
exports.CASE_DETAILS_TAGS = CASE_DETAILS_TAGS;
const CASE_DETAILS_TIMELINE_LINK_MARKDOWN = '[data-test-subj="description-action"] [data-test-subj="user-action-markdown"] button';
exports.CASE_DETAILS_TIMELINE_LINK_MARKDOWN = CASE_DETAILS_TIMELINE_LINK_MARKDOWN;
const CASE_DETAILS_USER_ACTION_DESCRIPTION_EVENT = '[data-test-subj="description-action"] .euiCommentEvent__headerEvent';
exports.CASE_DETAILS_USER_ACTION_DESCRIPTION_EVENT = CASE_DETAILS_USER_ACTION_DESCRIPTION_EVENT;
const CASE_DETAILS_USER_ACTION_DESCRIPTION_USERNAME = '[data-test-subj="description-action"] .euiCommentEvent__headerUsername';
exports.CASE_DETAILS_USER_ACTION_DESCRIPTION_USERNAME = CASE_DETAILS_USER_ACTION_DESCRIPTION_USERNAME;
const CASE_DETAILS_USERNAMES = '[data-test-subj="case-view-username"]';
exports.CASE_DETAILS_USERNAMES = CASE_DETAILS_USERNAMES;
const CONNECTOR_CARD_DETAILS = '[data-test-subj="connector-card"]';
exports.CONNECTOR_CARD_DETAILS = CONNECTOR_CARD_DETAILS;
const CONNECTOR_TITLE = '[data-test-subj="connector-card"] span.euiTitle';
exports.CONNECTOR_TITLE = CONNECTOR_TITLE;
const DELETE_CASE_BTN = '[data-test-subj="property-actions-trash"]';
exports.DELETE_CASE_BTN = DELETE_CASE_BTN;
const DELETE_CASE_CONFIRMATION_BTN = '[data-test-subj="confirmModalConfirmButton"]';
exports.DELETE_CASE_CONFIRMATION_BTN = DELETE_CASE_CONFIRMATION_BTN;
const PARTICIPANTS = 1;
exports.PARTICIPANTS = PARTICIPANTS;
const REPORTER = 0;
exports.REPORTER = REPORTER;