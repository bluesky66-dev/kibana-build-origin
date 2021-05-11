"use strict";

var _timelines = require("../../tasks/timelines");

var _login = require("../../tasks/login");

var _timeline = require("../../objects/timeline");

var _navigation = require("../../urls/navigation");

var _timelines2 = require("../../tasks/api_calls/timelines");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Export timelines', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    cy.intercept('POST', 'api/timeline/_export?file_name=timelines_export.ndjson').as('export');
    (0, _timelines2.createTimelineTemplate)(_timeline.timeline).then(response => {
      cy.wrap(response).as('templateResponse');
      cy.wrap(response.body.data.persistTimeline.timeline.savedObjectId).as('templateId');
    });
  });
  it('Exports a custom timeline template', function () {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.TIMELINE_TEMPLATES_URL);
    (0, _timelines.exportTimeline)(this.templateId);
    cy.wait('@export').then(({
      response
    }) => {
      cy.wrap(response.body).should('eql', (0, _timeline.expectedExportedTimelineTemplate)(this.templateResponse));
    });
  });
});