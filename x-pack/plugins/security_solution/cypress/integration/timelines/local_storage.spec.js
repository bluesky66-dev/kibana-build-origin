"use strict";

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");

var _main = require("../../tasks/hosts/main");

var _timeline = require("../../screens/timeline");

var _external_events = require("../../screens/hosts/external_events");

var _events = require("../../tasks/hosts/events");

var _timeline2 = require("../../tasks/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('persistent timeline', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
    (0, _main.openEvents)();
    (0, _events.waitsForEventsToBeLoaded)();
    cy.get(_timeline.DRAGGABLE_HEADER).then(header => cy.wrap(header.length - 1).as('expectedNumberOfTimelineColumns'));
  });
  it('persist the deletion of a column', function () {
    cy.get(_timeline.DRAGGABLE_HEADER).eq(_external_events.TABLE_COLUMN_EVENTS_MESSAGE).should('have.text', 'message');
    (0, _timeline2.removeColumn)(_external_events.TABLE_COLUMN_EVENTS_MESSAGE);
    cy.get(_timeline.DRAGGABLE_HEADER).should('have.length', this.expectedNumberOfTimelineColumns);
    (0, _common.reload)();
    (0, _events.waitsForEventsToBeLoaded)();
    cy.get(_timeline.DRAGGABLE_HEADER).should('have.length', this.expectedNumberOfTimelineColumns);
    cy.get(_timeline.DRAGGABLE_HEADER).each($el => expect($el.text()).not.equal('message'));
  });
});