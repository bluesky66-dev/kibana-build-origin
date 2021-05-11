"use strict";

var _timeline = require("../../objects/timeline");

var _timeline2 = require("../../screens/timeline");

var _timelines = require("../../screens/timelines");

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _security_main = require("../../tasks/security_main");

var _timeline3 = require("../../tasks/timeline");

var _timelines2 = require("../../tasks/timelines");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Timeline Templates', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    cy.intercept('PATCH', '/api/timeline').as('timeline');
  });
  it('Creates a timeline template', async () => {
    (0, _login.loginAndWaitForPage)(_navigation.OVERVIEW_URL);
    (0, _security_main.openTimelineUsingToggle)();
    (0, _timeline3.createNewTimelineTemplate)();
    (0, _timeline3.populateTimeline)();
    (0, _timeline3.addFilter)(_timeline.timeline.filter);
    cy.get(_timeline2.PIN_EVENT).should('have.attr', 'aria-label', 'This event may not be pinned while editing a template timeline');
    cy.get(_timeline2.LOCKED_ICON).should('be.visible');
    (0, _timeline3.addNameToTimeline)(_timeline.timeline.title);
    cy.wait('@timeline').then(({
      response
    }) => {
      const timelineId = response.body.data.persistTimeline.timeline.savedObjectId;
      (0, _timeline3.addDescriptionToTimeline)(_timeline.timeline.description);
      (0, _timeline3.addNotesToTimeline)(_timeline.timeline.notes);
      (0, _timeline3.markAsFavorite)();
      (0, _timeline3.waitForTimelineChanges)();
      (0, _timeline3.createNewTimelineTemplate)();
      (0, _timeline3.closeTimeline)();
      (0, _timeline3.openTimelineTemplateFromSettings)(timelineId);
      cy.contains(_timeline.timeline.title).should('exist');
      cy.get(_timelines.TIMELINES_DESCRIPTION).first().should('have.text', _timeline.timeline.description);
      cy.get(_timelines.TIMELINES_PINNED_EVENT_COUNT).first().should('have.text', '1');
      cy.get(_timelines.TIMELINES_NOTES_COUNT).first().should('have.text', '1');
      cy.get(_timelines.TIMELINES_FAVORITE).first().should('exist');
      (0, _timelines2.openTimeline)(timelineId);
      cy.get(_timeline2.FAVORITE_TIMELINE).should('exist');
      cy.get(_timeline2.TIMELINE_TITLE).should('have.text', _timeline.timeline.title);
      cy.get(_timeline2.TIMELINE_DESCRIPTION).should('have.text', _timeline.timeline.description);
      cy.get(_timeline2.TIMELINE_QUERY).should('have.text', _timeline.timeline.query); // Comments this assertion until we agreed what to do with the filters.
      // cy.get(TIMELINE_FILTER(timeline.filter)).should('exist');
      // cy.get(NOTES_COUNT).should('have.text', '1');

      cy.get(_timeline2.NOTES_TAB_BUTTON).click();
      cy.get(_timeline2.NOTES_TEXT_AREA).should('exist');
      cy.get(_timeline2.NOTES).should('have.text', _timeline.timeline.notes);
    });
  });
});