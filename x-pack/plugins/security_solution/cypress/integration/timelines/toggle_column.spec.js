"use strict";

var _timeline = require("../../screens/timeline");

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _security_main = require("../../tasks/security_main");

var _timeline2 = require("../../tasks/timeline");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('toggle column in timeline', () => {
  before(() => {
    (0, _common.cleanKibana)();
    cy.intercept('POST', '/api/timeline/_export?file_name=timelines_export.ndjson').as('export');
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
  });
  beforeEach(() => {
    (0, _security_main.openTimelineUsingToggle)();
    (0, _timeline2.populateTimeline)();
  });
  afterEach(() => {
    (0, _timeline2.createNewTimeline)();
    (0, _timeline2.closeTimeline)();
  });
  it('displays a checked Toggle field checkbox for `@timestamp`, a default timeline column', () => {
    (0, _timeline2.expandFirstTimelineEventDetails)();
    cy.get(_timeline.TIMESTAMP_TOGGLE_FIELD).should('be.checked');
  });
  it('displays an Unchecked Toggle field checkbox for `_id`, because it is NOT a default timeline column', () => {
    (0, _timeline2.expandFirstTimelineEventDetails)();
    cy.get(_timeline.ID_TOGGLE_FIELD).should('not.be.checked');
  });
  it('removes the @timestamp field from the timeline when the user un-checks the toggle', () => {
    (0, _timeline2.expandFirstTimelineEventDetails)();
    (0, _timeline2.uncheckTimestampToggleField)();
    cy.get(_timeline.TIMESTAMP_HEADER_FIELD).should('not.exist');
  });
  it('adds the _id field to the timeline when the user checks the field', () => {
    (0, _timeline2.expandFirstTimelineEventDetails)();
    (0, _timeline2.checkIdToggleField)();
    cy.get(_timeline.ID_HEADER_FIELD).should('exist');
  });
  it('adds the _id field to the timeline via drag and drop', () => {
    (0, _timeline2.expandFirstTimelineEventDetails)();
    (0, _timeline2.dragAndDropIdToggleFieldToTimeline)();
    cy.get(_timeline.ID_HEADER_FIELD).should('exist');
  });
});