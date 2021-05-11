"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMELINE_CONTEXT_MENU_BTN = exports.TAKE_ACTION_POPOVER_BTN = exports.SHOWING_ALERTS = exports.SEND_ALERT_TO_TIMELINE_BTN = exports.SELECTED_ALERTS = exports.OPENED_ALERTS_FILTER_BTN = exports.OPEN_SELECTED_ALERTS_BTN = exports.OPEN_ALERT_BTN = exports.NUMBER_OF_ALERTS = exports.MARK_SELECTED_ALERTS_IN_PROGRESS_BTN = exports.MARK_ALERT_IN_PROGRESS_BTN = exports.MANAGE_ALERT_DETECTION_RULES_BTN = exports.LOADING_ALERTS_PANEL = exports.IN_PROGRESS_ALERTS_FILTER_BTN = exports.EXPAND_ALERT_BTN = exports.CLOSED_ALERTS_FILTER_BTN = exports.CLOSE_SELECTED_ALERTS_BTN = exports.CLOSE_ALERT_BTN = exports.ALERT_RULE_VERSION = exports.ALERT_RULE_SEVERITY = exports.ALERT_RULE_RISK_SCORE = exports.ALERT_RULE_NAME = exports.ALERT_RULE_METHOD = exports.ALERT_RISK_SCORE_HEADER = exports.ALERT_ID = exports.ALERT_CHECKBOX = exports.ALERTS_COUNT = exports.ALERTS = exports.ADD_EXCEPTION_BTN = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ADD_EXCEPTION_BTN = '[data-test-subj="addExceptionButton"]';
exports.ADD_EXCEPTION_BTN = ADD_EXCEPTION_BTN;
const ALERTS = '[data-test-subj="events-viewer-panel"] [data-test-subj="event"]';
exports.ALERTS = ALERTS;
const ALERTS_COUNT = '[data-test-subj="events-viewer-panel"] [data-test-subj="server-side-event-count"]';
exports.ALERTS_COUNT = ALERTS_COUNT;
const ALERT_CHECKBOX = '[data-test-subj="select-event-container"] .euiCheckbox__input';
exports.ALERT_CHECKBOX = ALERT_CHECKBOX;
const ALERT_ID = '[data-test-subj="draggable-content-_id"]';
exports.ALERT_ID = ALERT_ID;
const ALERT_RISK_SCORE_HEADER = '[data-test-subj="header-text-signal.rule.risk_score"]';
exports.ALERT_RISK_SCORE_HEADER = ALERT_RISK_SCORE_HEADER;
const ALERT_RULE_METHOD = '[data-test-subj="draggable-content-signal.rule.type"]';
exports.ALERT_RULE_METHOD = ALERT_RULE_METHOD;
const ALERT_RULE_NAME = '[data-test-subj="draggable-content-signal.rule.name"]';
exports.ALERT_RULE_NAME = ALERT_RULE_NAME;
const ALERT_RULE_RISK_SCORE = '[data-test-subj="draggable-content-signal.rule.risk_score"]';
exports.ALERT_RULE_RISK_SCORE = ALERT_RULE_RISK_SCORE;
const ALERT_RULE_SEVERITY = '[data-test-subj="draggable-content-signal.rule.severity"]';
exports.ALERT_RULE_SEVERITY = ALERT_RULE_SEVERITY;
const ALERT_RULE_VERSION = '[data-test-subj="draggable-content-signal.rule.version"]';
exports.ALERT_RULE_VERSION = ALERT_RULE_VERSION;
const CLOSE_ALERT_BTN = '[data-test-subj="close-alert-status"]';
exports.CLOSE_ALERT_BTN = CLOSE_ALERT_BTN;
const CLOSE_SELECTED_ALERTS_BTN = '[data-test-subj="closeSelectedAlertsButton"]';
exports.CLOSE_SELECTED_ALERTS_BTN = CLOSE_SELECTED_ALERTS_BTN;
const CLOSED_ALERTS_FILTER_BTN = '[data-test-subj="closedAlerts"]';
exports.CLOSED_ALERTS_FILTER_BTN = CLOSED_ALERTS_FILTER_BTN;
const EXPAND_ALERT_BTN = '[data-test-subj="expand-event"]';
exports.EXPAND_ALERT_BTN = EXPAND_ALERT_BTN;
const IN_PROGRESS_ALERTS_FILTER_BTN = '[data-test-subj="inProgressAlerts"]';
exports.IN_PROGRESS_ALERTS_FILTER_BTN = IN_PROGRESS_ALERTS_FILTER_BTN;
const LOADING_ALERTS_PANEL = '[data-test-subj="loading-alerts-panel"]';
exports.LOADING_ALERTS_PANEL = LOADING_ALERTS_PANEL;
const MANAGE_ALERT_DETECTION_RULES_BTN = '[data-test-subj="manage-alert-detection-rules"]';
exports.MANAGE_ALERT_DETECTION_RULES_BTN = MANAGE_ALERT_DETECTION_RULES_BTN;
const MARK_ALERT_IN_PROGRESS_BTN = '[data-test-subj="in-progress-alert-status"]';
exports.MARK_ALERT_IN_PROGRESS_BTN = MARK_ALERT_IN_PROGRESS_BTN;
const MARK_SELECTED_ALERTS_IN_PROGRESS_BTN = '[data-test-subj="markSelectedAlertsInProgressButton"]';
exports.MARK_SELECTED_ALERTS_IN_PROGRESS_BTN = MARK_SELECTED_ALERTS_IN_PROGRESS_BTN;
const NUMBER_OF_ALERTS = '[data-test-subj="events-viewer-panel"] [data-test-subj="local-events-count"]';
exports.NUMBER_OF_ALERTS = NUMBER_OF_ALERTS;
const OPEN_ALERT_BTN = '[data-test-subj="open-alert-status"]';
exports.OPEN_ALERT_BTN = OPEN_ALERT_BTN;
const OPEN_SELECTED_ALERTS_BTN = '[data-test-subj="openSelectedAlertsButton"]';
exports.OPEN_SELECTED_ALERTS_BTN = OPEN_SELECTED_ALERTS_BTN;
const OPENED_ALERTS_FILTER_BTN = '[data-test-subj="openAlerts"]';
exports.OPENED_ALERTS_FILTER_BTN = OPENED_ALERTS_FILTER_BTN;
const SELECTED_ALERTS = '[data-test-subj="selectedAlerts"]';
exports.SELECTED_ALERTS = SELECTED_ALERTS;
const SEND_ALERT_TO_TIMELINE_BTN = '[data-test-subj="send-alert-to-timeline-button"]';
exports.SEND_ALERT_TO_TIMELINE_BTN = SEND_ALERT_TO_TIMELINE_BTN;
const SHOWING_ALERTS = '[data-test-subj="showingAlerts"]';
exports.SHOWING_ALERTS = SHOWING_ALERTS;
const TAKE_ACTION_POPOVER_BTN = '[data-test-subj="alertActionPopover"] button';
exports.TAKE_ACTION_POPOVER_BTN = TAKE_ACTION_POPOVER_BTN;
const TIMELINE_CONTEXT_MENU_BTN = '[data-test-subj="timeline-context-menu-button"]';
exports.TIMELINE_CONTEXT_MENU_BTN = TIMELINE_CONTEXT_MENU_BTN;