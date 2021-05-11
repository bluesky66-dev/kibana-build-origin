"use strict";

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");

var _state = require("../../urls/state");

var _date_picker = require("../../screens/date_picker");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ABSOLUTE_DATE = {
  endTime: '2019-08-01T20:33:29.186Z',
  startTime: '2019-08-01T20:03:29.186Z'
};
describe('URL compatibility', () => {
  before(() => {
    (0, _common.cleanKibana)();
  });
  it('Redirects to Detection alerts from old Detections URL', () => {
    (0, _login.loginAndWaitForPage)(_navigation.DETECTIONS);
    cy.url().should('include', '/security/detections');
  });
  it('sets the global start and end dates from the url with timestamps', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.urlWithTimestamps);
    cy.get(_date_picker.DATE_PICKER_START_DATE_POPOVER_BUTTON).should('have.attr', 'title', ABSOLUTE_DATE.startTime);
    cy.get(_date_picker.DATE_PICKER_END_DATE_POPOVER_BUTTON).should('have.attr', 'title', ABSOLUTE_DATE.endTime);
  });
});