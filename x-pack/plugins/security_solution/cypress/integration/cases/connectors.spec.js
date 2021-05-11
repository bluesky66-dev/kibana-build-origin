"use strict";

var _case = require("../../objects/case");

var _configure_cases = require("../../screens/configure_cases");

var _all_cases = require("../../tasks/all_cases");

var _common = require("../../tasks/common");

var _configure_cases2 = require("../../tasks/configure_cases");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Cases connectors', () => {
  const configureResult = {
    connector: {
      id: 'e271c3b8-f702-4fbc-98e0-db942b573bbd',
      name: 'SN',
      type: '.servicenow',
      fields: null
    },
    closure_type: 'close-by-user',
    created_at: '2020-12-01T16:28:09.219Z',
    created_by: {
      email: null,
      full_name: null,
      username: 'elastic'
    },
    error: null,
    updated_at: null,
    updated_by: null,
    mappings: [{
      source: 'title',
      target: 'short_description',
      action_type: 'overwrite'
    }, {
      source: 'description',
      target: 'description',
      action_type: 'overwrite'
    }, {
      source: 'comments',
      target: 'comments',
      action_type: 'append'
    }],
    version: 'WzEwNCwxXQ=='
  };
  beforeEach(() => {
    (0, _common.cleanKibana)();
    cy.intercept('POST', '/api/actions/action').as('createConnector');
    cy.intercept('POST', '/api/cases/configure', req => {
      const connector = req.body.connector;
      req.reply(res => {
        res.send(200, { ...configureResult,
          connector
        });
      });
    }).as('saveConnector');
    cy.intercept('GET', '/api/cases/configure', req => {
      req.reply(res => {
        const resBody = res.body.version != null ? { ...res.body,
          error: null,
          mappings: [{
            source: 'title',
            target: 'short_description',
            action_type: 'overwrite'
          }, {
            source: 'description',
            target: 'description',
            action_type: 'overwrite'
          }, {
            source: 'comments',
            target: 'comments',
            action_type: 'append'
          }]
        } : res.body;
        res.send(200, resBody);
      });
    });
  });
  it('Configures a new connector', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.CASES_URL);
    (0, _all_cases.goToEditExternalConnection)();
    (0, _configure_cases2.openAddNewConnectorOption)();
    (0, _configure_cases2.addServiceNowConnector)(_case.serviceNowConnector);
    cy.wait('@createConnector').then(({
      response
    }) => {
      cy.wrap(response.statusCode).should('eql', 200);
      cy.get(_configure_cases.TOASTER).should('have.text', "Created 'New connector'");
      cy.get(_configure_cases.TOASTER).should('not.exist');
      (0, _configure_cases2.selectLastConnectorCreated)(response.body.id);
      cy.wait('@saveConnector', {
        timeout: 10000
      }).its('response.statusCode').should('eql', 200);
      cy.get(_configure_cases.SERVICE_NOW_MAPPING).first().should('have.text', 'short_description');
      cy.get(_configure_cases.TOASTER).should('have.text', 'Saved external connection settings');
    });
  });
});