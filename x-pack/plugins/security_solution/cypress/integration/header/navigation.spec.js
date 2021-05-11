"use strict";

var _security_header = require("../../screens/security_header");

var _login = require("../../tasks/login");

var _security_header2 = require("../../tasks/security_header");

var _navigation = require("../../urls/navigation");

var _kibana_navigation = require("../../tasks/kibana_navigation");

var _kibana_navigation2 = require("../../screens/kibana_navigation");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('top-level navigation common to all pages in the Security app', () => {
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.TIMELINES_URL);
  });
  it('navigates to the Overview page', () => {
    (0, _security_header2.navigateFromHeaderTo)(_security_header.OVERVIEW);
    cy.url().should('include', _navigation.OVERVIEW_URL);
  });
  it('navigates to the Detections page', () => {
    (0, _security_header2.navigateFromHeaderTo)(_security_header.DETECTIONS);
    cy.url().should('include', _navigation.DETECTIONS_URL);
  });
  it('navigates to the Hosts page', () => {
    (0, _security_header2.navigateFromHeaderTo)(_security_header.HOSTS);
    cy.url().should('include', _navigation.HOSTS_URL);
  });
  it('navigates to the Network page', () => {
    (0, _security_header2.navigateFromHeaderTo)(_security_header.NETWORK);
    cy.url().should('include', _navigation.NETWORK_URL);
  });
  it('navigates to the Timelines page', () => {
    (0, _security_header2.navigateFromHeaderTo)(_security_header.TIMELINES);
    cy.url().should('include', _navigation.TIMELINES_URL);
  });
  it('navigates to the Cases page', () => {
    (0, _security_header2.navigateFromHeaderTo)(_security_header.CASES);
    cy.url().should('include', _navigation.CASES_URL);
  });
  it('navigates to the Administration page', () => {
    (0, _security_header2.navigateFromHeaderTo)(_security_header.ADMINISTRATION);
    cy.url().should('include', _navigation.ADMINISTRATION_URL);
  });
});
describe('Kibana navigation to all pages in the Security app ', () => {
  before(() => {
    (0, _login.loginAndWaitForPage)(_navigation.KIBANA_HOME);
  });
  beforeEach(() => {
    (0, _kibana_navigation.openKibanaNavigation)();
  });
  it('navigates to the Overview page', () => {
    (0, _kibana_navigation.navigateFromKibanaCollapsibleTo)(_kibana_navigation2.OVERVIEW_PAGE);
    cy.url().should('include', _navigation.OVERVIEW_URL);
  });
  it('navigates to the Detections page', () => {
    (0, _kibana_navigation.navigateFromKibanaCollapsibleTo)(_kibana_navigation2.DETECTIONS_PAGE);
    cy.url().should('include', _navigation.DETECTIONS_URL);
  });
  it('navigates to the Hosts page', () => {
    (0, _kibana_navigation.navigateFromKibanaCollapsibleTo)(_kibana_navigation2.HOSTS_PAGE);
    cy.url().should('include', _navigation.HOSTS_URL);
  });
  it('navigates to the Network page', () => {
    (0, _kibana_navigation.navigateFromKibanaCollapsibleTo)(_kibana_navigation2.NETWORK_PAGE);
    cy.url().should('include', _navigation.NETWORK_URL);
  });
  it('navigates to the Timelines page', () => {
    (0, _kibana_navigation.navigateFromKibanaCollapsibleTo)(_kibana_navigation2.TIMELINES_PAGE);
    cy.url().should('include', _navigation.TIMELINES_URL);
  });
  it('navigates to the Cases page', () => {
    (0, _kibana_navigation.navigateFromKibanaCollapsibleTo)(_kibana_navigation2.CASES_PAGE);
    cy.url().should('include', _navigation.CASES_URL);
  });
  it('navigates to the Administration page', () => {
    (0, _kibana_navigation.navigateFromKibanaCollapsibleTo)(_kibana_navigation2.ADMINISTRATION_PAGE);
    cy.url().should('include', _navigation.ADMINISTRATION_URL);
  });
});