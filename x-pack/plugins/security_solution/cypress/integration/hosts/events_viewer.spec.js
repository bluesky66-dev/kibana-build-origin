"use strict";

var _fields_browser = require("../../screens/fields_browser");

var _events = require("../../screens/hosts/events");

var _timeline = require("../../screens/timeline");

var _fields_browser2 = require("../../tasks/fields_browser");

var _login = require("../../tasks/login");

var _main = require("../../tasks/hosts/main");

var _events2 = require("../../tasks/hosts/events");

var _security_header = require("../../tasks/security_header");

var _navigation = require("../../urls/navigation");

var _timeline2 = require("../../tasks/timeline");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultHeadersInDefaultEcsCategory = [{
  id: '@timestamp'
}, {
  id: 'message'
}, {
  id: 'host.name'
}, {
  id: 'event.action'
}, {
  id: 'user.name'
}, {
  id: 'source.ip'
}, {
  id: 'destination.ip'
}];
describe('Events Viewer', () => {
  context('Fields rendering', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _main.openEvents)();
    });
    beforeEach(() => {
      (0, _events2.openEventsViewerFieldsBrowser)();
    });
    afterEach(() => {
      (0, _fields_browser2.closeFieldsBrowser)();
      cy.get(_fields_browser.FIELDS_BROWSER_CONTAINER).should('not.exist');
    });
    it('displays the `default ECS` category (by default)', () => {
      cy.get(_fields_browser.FIELDS_BROWSER_SELECTED_CATEGORY_TITLE).should('have.text', 'default ECS');
    });
    it('displays a checked checkbox for all of the default events viewer columns that are also in the default ECS category', () => {
      defaultHeadersInDefaultEcsCategory.forEach(header => cy.get((0, _fields_browser.FIELDS_BROWSER_CHECKBOX)(header.id)).should('be.checked'));
    });
  });
  context('Events viewer query modal', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _main.openEvents)();
    });
    it('launches the inspect query modal when the inspect button is clicked', () => {
      (0, _events2.waitsForEventsToBeLoaded)();
      (0, _events2.opensInspectQueryModal)();
      cy.get(_events.INSPECT_MODAL).should('exist');
    });
  });
  context('Events viewer fields behaviour', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _main.openEvents)();
    });
    beforeEach(() => {
      (0, _events2.openEventsViewerFieldsBrowser)();
    });
    it('adds a field to the events viewer when the user clicks the checkbox', () => {
      const filterInput = 'host.geo.c';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_events.HOST_GEO_CITY_NAME_HEADER).should('not.exist');
      (0, _events2.addsHostGeoCityNameToHeader)();
      (0, _fields_browser2.closeFieldsBrowser)();
      cy.get(_events.HOST_GEO_CITY_NAME_HEADER).should('exist');
    });
    it('resets all fields in the events viewer when `Reset Fields` is clicked', () => {
      const filterInput = 'host.geo.c';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_events.HOST_GEO_COUNTRY_NAME_HEADER).should('not.exist');
      (0, _events2.addsHostGeoCountryNameToHeader)();
      (0, _timeline2.resetFields)();
      cy.get(_events.HOST_GEO_COUNTRY_NAME_HEADER).should('not.exist');
    });
  });
  context('Events behavior', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _main.openEvents)();
      (0, _events2.waitsForEventsToBeLoaded)();
    });
    afterEach(() => {
      (0, _security_header.clearSearchBar)();
    });
    it('filters the events by applying filter criteria from the search bar at the top of the page', () => {
      const filterInput = 'aa7ca589f1b8220002f2fc61c64cfbf1'; // this will never match real data

      cy.get(_events.HEADER_SUBTITLE).invoke('text').then(initialNumberOfEvents => {
        (0, _security_header.kqlSearch)(`${filterInput}{enter}`);
        cy.get(_events.HEADER_SUBTITLE).should('not.have.text', initialNumberOfEvents);
      });
    });
  });
  context('Events columns', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _main.openEvents)();
      cy.scrollTo('bottom');
      (0, _events2.waitsForEventsToBeLoaded)();
    });
    afterEach(() => {
      (0, _events2.openEventsViewerFieldsBrowser)();
      (0, _timeline2.resetFields)();
    });
    it('re-orders columns via drag and drop', () => {
      const originalColumnOrder = '@timestamp1messagehost.nameevent.moduleevent.datasetevent.actionuser.namesource.ipdestination.ip';
      const expectedOrderAfterDragAndDrop = 'message@timestamp1host.nameevent.moduleevent.datasetevent.actionuser.namesource.ipdestination.ip';
      cy.get(_timeline.HEADERS_GROUP).should('have.text', originalColumnOrder);
      (0, _events2.dragAndDropColumn)({
        column: 0,
        newPosition: 0
      });
      cy.get(_timeline.HEADERS_GROUP).should('have.text', expectedOrderAfterDragAndDrop);
    });
  });
});