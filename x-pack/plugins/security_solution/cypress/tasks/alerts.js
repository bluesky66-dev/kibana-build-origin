"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForAlertsToBeLoaded = exports.waitForAlertsPanelToBeLoaded = exports.waitForAlertsIndexToBeCreated = exports.waitForAlerts = exports.investigateFirstAlertInTimeline = exports.sortRiskScore = exports.selectNumberOfAlerts = exports.markInProgressAlerts = exports.markInProgressFirstAlert = exports.goToInProgressAlerts = exports.openAlerts = exports.openFirstAlert = exports.goToOpenedAlerts = exports.goToManageAlertsDetectionRules = exports.goToClosedAlerts = exports.expandFirstAlert = exports.closeAlerts = exports.closeFirstAlert = exports.addExceptionFromFirstAlert = void 0;

var _alerts = require("../screens/alerts");

var _security_header = require("../screens/security_header");

var _timeline = require("../screens/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addExceptionFromFirstAlert = () => {
  cy.get(_alerts.TIMELINE_CONTEXT_MENU_BTN).first().click();
  cy.get(_alerts.ADD_EXCEPTION_BTN).click();
};

exports.addExceptionFromFirstAlert = addExceptionFromFirstAlert;

const closeFirstAlert = () => {
  cy.get(_alerts.TIMELINE_CONTEXT_MENU_BTN).first().click({
    force: true
  });
  cy.get(_alerts.CLOSE_ALERT_BTN).click();
};

exports.closeFirstAlert = closeFirstAlert;

const closeAlerts = () => {
  cy.get(_alerts.TAKE_ACTION_POPOVER_BTN).click({
    force: true
  });
  cy.get(_alerts.CLOSE_SELECTED_ALERTS_BTN).click();
};

exports.closeAlerts = closeAlerts;

const expandFirstAlert = () => {
  cy.get(_alerts.EXPAND_ALERT_BTN).first().click({
    force: true
  });
};

exports.expandFirstAlert = expandFirstAlert;

const goToClosedAlerts = () => {
  cy.get(_alerts.CLOSED_ALERTS_FILTER_BTN).click();
  cy.get(_security_header.REFRESH_BUTTON).should('not.have.text', 'Updating');
  cy.get(_security_header.REFRESH_BUTTON).should('have.text', 'Refresh');
  cy.get(_timeline.TIMELINE_COLUMN_SPINNER).should('not.exist');
};

exports.goToClosedAlerts = goToClosedAlerts;

const goToManageAlertsDetectionRules = () => {
  cy.get(_alerts.MANAGE_ALERT_DETECTION_RULES_BTN).should('exist').click({
    force: true
  });
};

exports.goToManageAlertsDetectionRules = goToManageAlertsDetectionRules;

const goToOpenedAlerts = () => {
  cy.get(_alerts.OPENED_ALERTS_FILTER_BTN).click({
    force: true
  });
  cy.get(_security_header.REFRESH_BUTTON).should('not.have.text', 'Updating');
  cy.get(_security_header.REFRESH_BUTTON).should('have.text', 'Refresh');
  cy.get(_timeline.TIMELINE_COLUMN_SPINNER).should('not.exist');
};

exports.goToOpenedAlerts = goToOpenedAlerts;

const openFirstAlert = () => {
  cy.get(_alerts.TIMELINE_CONTEXT_MENU_BTN).first().click({
    force: true
  });
  cy.get(_alerts.OPEN_ALERT_BTN).click();
};

exports.openFirstAlert = openFirstAlert;

const openAlerts = () => {
  cy.get(_alerts.TAKE_ACTION_POPOVER_BTN).click({
    force: true
  });
  cy.get(_alerts.OPEN_SELECTED_ALERTS_BTN).click();
};

exports.openAlerts = openAlerts;

const goToInProgressAlerts = () => {
  cy.get(_alerts.IN_PROGRESS_ALERTS_FILTER_BTN).click();
};

exports.goToInProgressAlerts = goToInProgressAlerts;

const markInProgressFirstAlert = () => {
  cy.get(_alerts.TIMELINE_CONTEXT_MENU_BTN).first().click({
    force: true
  });
  cy.get(_alerts.MARK_ALERT_IN_PROGRESS_BTN).click();
};

exports.markInProgressFirstAlert = markInProgressFirstAlert;

const markInProgressAlerts = () => {
  cy.get(_alerts.TAKE_ACTION_POPOVER_BTN).click({
    force: true
  });
  cy.get(_alerts.MARK_SELECTED_ALERTS_IN_PROGRESS_BTN).click();
};

exports.markInProgressAlerts = markInProgressAlerts;

const selectNumberOfAlerts = numberOfAlerts => {
  for (let i = 0; i < numberOfAlerts; i++) {
    cy.get(_alerts.ALERT_CHECKBOX).eq(i).click({
      force: true
    });
  }
};

exports.selectNumberOfAlerts = selectNumberOfAlerts;

const sortRiskScore = () => {
  cy.get(_alerts.ALERT_RISK_SCORE_HEADER).click();
  cy.get(_timeline.TIMELINE_COLUMN_SPINNER).should('exist');
  cy.get(_timeline.TIMELINE_COLUMN_SPINNER).should('not.exist');
};

exports.sortRiskScore = sortRiskScore;

const investigateFirstAlertInTimeline = () => {
  cy.get(_alerts.SEND_ALERT_TO_TIMELINE_BTN).first().click({
    force: true
  });
};

exports.investigateFirstAlertInTimeline = investigateFirstAlertInTimeline;

const waitForAlerts = () => {
  cy.get(_security_header.REFRESH_BUTTON).should('not.have.text', 'Updating');
};

exports.waitForAlerts = waitForAlerts;

const waitForAlertsIndexToBeCreated = () => {
  cy.request({
    url: '/api/detection_engine/index',
    failOnStatusCode: false
  }).then(response => {
    if (response.status !== 200) {
      cy.request({
        method: 'POST',
        url: `/api/detection_engine/index`,
        headers: {
          'kbn-xsrf': 'create-signals-index'
        }
      });
    }
  });
};

exports.waitForAlertsIndexToBeCreated = waitForAlertsIndexToBeCreated;

const waitForAlertsPanelToBeLoaded = () => {
  cy.get(_alerts.LOADING_ALERTS_PANEL).should('exist');
  cy.get(_alerts.LOADING_ALERTS_PANEL).should('not.exist');
};

exports.waitForAlertsPanelToBeLoaded = waitForAlertsPanelToBeLoaded;

const waitForAlertsToBeLoaded = () => {
  const expectedNumberOfDisplayedAlerts = 25;
  cy.get(_alerts.ALERTS).should('have.length', expectedNumberOfDisplayedAlerts);
};

exports.waitForAlertsToBeLoaded = waitForAlertsToBeLoaded;