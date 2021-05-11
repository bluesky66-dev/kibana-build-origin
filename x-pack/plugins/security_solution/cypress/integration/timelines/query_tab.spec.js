"use strict";

var _timeline = require("../../objects/timeline");

var _timeline2 = require("../../screens/timeline");

var _notes = require("../../tasks/api_calls/notes");

var _timelines = require("../../tasks/api_calls/timelines");

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _timeline3 = require("../../tasks/timeline");

var _timelines2 = require("../../tasks/timelines");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Timeline query tab', () => {
  let timelineId = null;
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.TIMELINES_URL);
    (0, _timelines2.waitForTimelinesPanelToBeLoaded)();
    (0, _timelines.createTimeline)(_timeline.timeline).then(response => {
      timelineId = response.body.data.persistTimeline.timeline.savedObjectId;
    }).then(() => {
      const note = _timeline.timeline.notes;
      (0, _notes.addNoteToTimeline)(note, timelineId).should(response => {
        expect(response.status).to.equal(200);
        (0, _timelines2.waitForTimelinesPanelToBeLoaded)();
        (0, _timeline3.openTimelineById)(timelineId).click({
          force: true
        }).then(() => {
          (0, _timeline3.waitForEventsPanelToBeLoaded)();
          (0, _timeline3.pinFirstEvent)();
          (0, _timeline3.addFilter)(_timeline.timeline.filter);
        });
      });
    });
  });
  describe('Query tab', () => {
    after(() => {
      (0, _timeline3.closeTimeline)();
    });
    it('should contain the right query', () => {
      cy.get(_timeline2.TIMELINE_QUERY).should('have.text', `${_timeline.timeline.query}`);
    });
    it('should display timeline filter', () => {
      cy.get((0, _timeline2.TIMELINE_FILTER)(_timeline.timeline.filter)).should('exist');
    });
    it('should display pinned events', () => {
      cy.get(_timeline2.PIN_EVENT).should('have.attr', 'aria-label').and('match', /Unpin the event in row 2/);
    });
    it('should have an unlock icon', () => {
      cy.get(_timeline2.UNLOCKED_ICON).should('be.visible');
    });
  });
});