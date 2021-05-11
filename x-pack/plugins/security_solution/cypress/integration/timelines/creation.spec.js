"use strict";

var _timeline = require("../../objects/timeline");

var _timeline2 = require("../../screens/timeline");

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _security_main = require("../../tasks/security_main");

var _timeline3 = require("../../tasks/timeline");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Timelines', () => {
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.OVERVIEW_URL);
  });
  describe('Toggle create timeline from plus icon', () => {
    after(() => {
      (0, _timeline3.closeTimeline)();
    });
    it('toggle create timeline ', () => {
      (0, _timeline3.createNewTimeline)();
      cy.get(_timeline2.TIMELINE_PANEL).should('be.visible');
    });
  });
  describe('Creates a timeline by clicking untitled timeline from bottom bar', () => {
    after(() => {
      (0, _timeline3.closeTimeline)();
    });
    before(() => {
      (0, _security_main.openTimelineUsingToggle)();
      (0, _timeline3.addNameAndDescriptionToTimeline)(_timeline.timeline);
      (0, _timeline3.populateTimeline)();
    });
    beforeEach(() => {
      (0, _timeline3.goToQueryTab)();
    });
    it('can be added filter', () => {
      (0, _timeline3.addFilter)(_timeline.timeline.filter);
      cy.get((0, _timeline2.TIMELINE_FILTER)(_timeline.timeline.filter)).should('exist');
    });
    it('pins an event', () => {
      (0, _timeline3.pinFirstEvent)();
      cy.get(_timeline2.PIN_EVENT).should('have.attr', 'aria-label').and('match', /Unpin the event in row 2/);
    });
    it('has a lock icon', () => {
      cy.get(_timeline2.LOCKED_ICON).should('be.visible');
    });
    it('can be added notes', () => {
      (0, _timeline3.addNotesToTimeline)(_timeline.timeline.notes);
      cy.get(_timeline2.NOTES_TEXT).should('have.text', _timeline.timeline.notes);
    });
    it('can be marked as favorite', () => {
      (0, _timeline3.markAsFavorite)();
      (0, _timeline3.waitForTimelineChanges)();
      cy.get(_timeline2.FAVORITE_TIMELINE).should('have.text', 'Remove from favorites');
    });
  });
});