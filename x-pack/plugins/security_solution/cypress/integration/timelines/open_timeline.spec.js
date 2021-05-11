"use strict";

var _timeline = require("../../objects/timeline");

var _timeline2 = require("../../screens/timeline");

var _timelines = require("../../screens/timelines");

var _notes = require("../../tasks/api_calls/notes");

var _timelines2 = require("../../tasks/api_calls/timelines");

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _timeline3 = require("../../tasks/timeline");

var _timelines3 = require("../../tasks/timelines");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Open timeline', () => {
  let timelineId = null;
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.TIMELINES_URL);
    (0, _timelines3.waitForTimelinesPanelToBeLoaded)();
    (0, _timelines2.createTimeline)(_timeline.timeline).then(response => {
      timelineId = response.body.data.persistTimeline.timeline.savedObjectId;
    }).then(() => {
      const note = _timeline.timeline.notes;
      (0, _notes.addNoteToTimeline)(note, timelineId).should(response => {
        expect(response.status).to.equal(200);
        (0, _timelines3.waitForTimelinesPanelToBeLoaded)();
        (0, _timeline3.openTimelineById)(timelineId).click({
          force: true
        }).then(() => {
          (0, _timeline3.waitForEventsPanelToBeLoaded)();
          (0, _timeline3.pinFirstEvent)();
          (0, _timeline3.markAsFavorite)();
        });
      });
    });
  });
  describe('Open timeline modal', () => {
    before(() => {
      (0, _timeline3.openTimelineFromSettings)();
    });
    after(() => {
      (0, _timeline3.closeOpenTimelineModal)();
    });
    it('should open a modal', () => {
      cy.get(_timeline2.OPEN_TIMELINE_MODAL).should('be.visible');
    });
    it('should display timeline info - title', () => {
      cy.contains(_timeline.timeline.title).should('exist');
    });
    it('should display timeline info - description', () => {
      cy.get(_timelines.TIMELINES_DESCRIPTION).first().should('have.text', _timeline.timeline.description);
    });
    it('should display timeline info - pinned event count', () => {
      cy.get(_timelines.TIMELINES_PINNED_EVENT_COUNT).first().should('have.text', '1');
    });
    it('should display timeline info - notes count', () => {
      cy.get(_timelines.TIMELINES_NOTES_COUNT).first().should('have.text', '1');
    });
    it('should display timeline info - favorite timeline', () => {
      cy.get(_timelines.TIMELINES_FAVORITE).first().should('exist');
    });
    it('should display timeline content - title', () => {
      cy.get(_timeline2.TIMELINE_TITLE).should('have.text', _timeline.timeline.title);
    });
    it('should display timeline content - description', () => {
      cy.get(_timeline2.TIMELINE_DESCRIPTION).should('have.text', _timeline.timeline.description); // This is the flake part where it sometimes does not show/load the timelines correctly
    });
  });
});