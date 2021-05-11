"use strict";

var _login = require("../../tasks/login");

var _timeline = require("../../tasks/timeline");

var _create_new_case = require("../../screens/create_new_case");

var _case = require("../../objects/case");

var _timeline2 = require("../../objects/timeline");

var _timelines = require("../../tasks/api_calls/timelines");

var _common = require("../../tasks/common");

var _cases = require("../../tasks/api_calls/cases");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('attach timeline to case', () => {
  context('without cases created', () => {
    beforeEach(() => {
      (0, _common.cleanKibana)();
      (0, _timelines.createTimeline)(_timeline2.timeline).then(response => cy.wrap(response.body.data.persistTimeline.timeline).as('myTimeline'));
    });
    it('attach timeline to a new case', function () {
      (0, _login.loginAndWaitForTimeline)(this.myTimeline.savedObjectId);
      (0, _timeline.attachTimelineToNewCase)();
      cy.location('origin').then(origin => {
        cy.get(_create_new_case.DESCRIPTION_INPUT).should('have.text', `[${this.myTimeline.title}](${origin}/app/security/timelines?timeline=(id:%27${this.myTimeline.savedObjectId}%27,isOpen:!t))`);
      });
    });
    it('attach timeline to an existing case with no case', function () {
      (0, _login.loginAndWaitForTimeline)(this.myTimeline.savedObjectId);
      (0, _timeline.attachTimelineToExistingCase)();
      (0, _timeline.addNewCase)();
      cy.location('origin').then(origin => {
        cy.get(_create_new_case.DESCRIPTION_INPUT).should('have.text', `[${this.myTimeline.title}](${origin}/app/security/timelines?timeline=(id:%27${this.myTimeline.savedObjectId}%27,isOpen:!t))`);
      });
    });
  });
  context('with cases created', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _timelines.createTimeline)(_timeline2.timeline).then(response => cy.wrap(response.body.data.persistTimeline.timeline.savedObjectId).as('timelineId'));
      (0, _cases.createCase)(_case.case1).then(response => cy.wrap(response.body.id).as('caseId'));
    });
    it('attach timeline to an existing case', function () {
      (0, _login.loginAndWaitForTimeline)(this.timelineId);
      (0, _timeline.attachTimelineToExistingCase)();
      (0, _timeline.selectCase)(this.caseId);
      cy.location('origin').then(origin => {
        cy.get(_create_new_case.ADD_COMMENT_INPUT).should('have.text', `[${_timeline2.timeline.title}](${origin}/app/security/timelines?timeline=(id:%27${this.timelineId}%27,isOpen:!t))`);
      });
    });
  });
});