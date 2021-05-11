"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectLastConnectorCreated = exports.openAddNewConnectorOption = exports.addServiceNowConnector = void 0;

var _configure_cases = require("../screens/configure_cases");

var _security_main = require("../screens/security_main");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addServiceNowConnector = connector => {
  cy.get(_configure_cases.SERVICE_NOW_CONNECTOR_CARD).click();
  cy.get(_configure_cases.CONNECTOR_NAME).type(connector.connectorName);
  cy.get(_configure_cases.URL).type(connector.URL);
  cy.get(_configure_cases.USERNAME).type(connector.username);
  cy.get(_configure_cases.PASSWORD).type(connector.password);
  cy.get(_configure_cases.SAVE_BTN).click({
    force: true
  });
};

exports.addServiceNowConnector = addServiceNowConnector;

const openAddNewConnectorOption = () => {
  cy.get(_security_main.MAIN_PAGE).then($page => {
    if ($page.find(_configure_cases.SERVICE_NOW_CONNECTOR_CARD).length !== 1) {
      cy.wait(1000);
      cy.get(_configure_cases.CONNECTORS_DROPDOWN).click({
        force: true
      });
      cy.get(_configure_cases.ADD_NEW_CONNECTOR_DROPDOWN_BUTTON).click();
    }
  });
};

exports.openAddNewConnectorOption = openAddNewConnectorOption;

const selectLastConnectorCreated = id => {
  cy.get(_configure_cases.CONNECTORS_DROPDOWN).click({
    force: true
  });
  cy.get((0, _configure_cases.CONNECTOR)(id)).click();
};

exports.selectLastConnectorCreated = selectLastConnectorCreated;