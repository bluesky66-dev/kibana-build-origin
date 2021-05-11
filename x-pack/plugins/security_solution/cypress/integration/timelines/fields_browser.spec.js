"use strict";

var _fields_browser = require("../../screens/fields_browser");

var _timeline = require("../../screens/timeline");

var _common = require("../../tasks/common");

var _fields_browser2 = require("../../tasks/fields_browser");

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


const defaultHeaders = [{
  id: '@timestamp'
}, {
  id: 'message'
}, {
  id: 'event.category'
}, {
  id: 'event.action'
}, {
  id: 'host.name'
}, {
  id: 'source.ip'
}, {
  id: 'destination.ip'
}, {
  id: 'user.name'
}];
describe('Fields Browser', () => {
  context('Fields Browser rendering', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _security_main.openTimelineUsingToggle)();
      (0, _timeline2.populateTimeline)();
      (0, _timeline2.openTimelineFieldsBrowser)();
    });
    afterEach(() => {
      (0, _fields_browser2.clearFieldsBrowser)();
    });
    it('displays the `default ECS` category (by default)', () => {
      cy.get(_fields_browser.FIELDS_BROWSER_SELECTED_CATEGORY_TITLE).should('have.text', 'default ECS');
    });
    it('the `defaultECS` (selected) category count matches the default timeline header count', () => {
      cy.get(_fields_browser.FIELDS_BROWSER_SELECTED_CATEGORY_COUNT).should('have.text', `${defaultHeaders.length}`);
    });
    it('displays a checked checkbox for all of the default timeline columns', () => {
      defaultHeaders.forEach(header => cy.get(`[data-test-subj="field-${header.id}-checkbox"]`).should('be.checked'));
    });
    it('displays the expected count of categories that match the filter input', () => {
      const filterInput = 'host.mac';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_fields_browser.FIELDS_BROWSER_CATEGORIES_COUNT).should('have.text', '2 categories');
    });
    it('displays a search results label with the expected count of fields matching the filter input', () => {
      const filterInput = 'host.mac';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_fields_browser.FIELDS_BROWSER_HOST_CATEGORIES_COUNT).invoke('text').then(hostCategoriesCount => {
        cy.get(_fields_browser.FIELDS_BROWSER_SYSTEM_CATEGORIES_COUNT).invoke('text').then(systemCategoriesCount => {
          cy.get(_fields_browser.FIELDS_BROWSER_FIELDS_COUNT).should('have.text', `${+hostCategoriesCount + +systemCategoriesCount} fields`);
        });
      });
    });
    it('displays a count of only the fields in the selected category that match the filter input', () => {
      const filterInput = 'host.geo.c';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_fields_browser.FIELDS_BROWSER_SELECTED_CATEGORY_COUNT).should('have.text', '4');
    });
  });
  context('Editing the timeline', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _security_main.openTimelineUsingToggle)();
      (0, _timeline2.populateTimeline)();
      (0, _timeline2.openTimelineFieldsBrowser)();
    });
    afterEach(() => {
      (0, _timeline2.openTimelineFieldsBrowser)();
      (0, _fields_browser2.clearFieldsBrowser)();
    });
    it('removes the message field from the timeline when the user un-checks the field', () => {
      cy.get(_fields_browser.FIELDS_BROWSER_MESSAGE_HEADER).should('exist');
      (0, _fields_browser2.removesMessageField)();
      (0, _fields_browser2.closeFieldsBrowser)();
      cy.get(_fields_browser.FIELDS_BROWSER_MESSAGE_HEADER).should('not.exist');
    });
    it('selects a search results label with the expected count of categories matching the filter input', () => {
      const category = 'host';
      (0, _fields_browser2.filterFieldsBrowser)(category);
      cy.get(_fields_browser.FIELDS_BROWSER_SELECTED_CATEGORY_TITLE).should('have.text', category);
    });
    it('adds a field to the timeline when the user clicks the checkbox', () => {
      const filterInput = 'host.geo.c';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_fields_browser.FIELDS_BROWSER_HOST_GEO_CITY_NAME_HEADER).should('not.exist');
      (0, _fields_browser2.addsHostGeoCityNameToTimeline)();
      (0, _fields_browser2.closeFieldsBrowser)();
      cy.get(_fields_browser.FIELDS_BROWSER_HOST_GEO_CITY_NAME_HEADER).should('exist');
    });
    it('adds a field to the timeline when the user drags and drops a field', () => {
      const filterInput = 'host.geo.c';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_fields_browser.FIELDS_BROWSER_HOST_GEO_COUNTRY_NAME_HEADER).should('not.exist');
      (0, _fields_browser2.addsHostGeoCountryNameToTimelineDraggingIt)();
      cy.get(_fields_browser.FIELDS_BROWSER_HOST_GEO_COUNTRY_NAME_HEADER).should('exist');
    });
    it('resets all fields in the timeline when `Reset Fields` is clicked', () => {
      const filterInput = 'host.geo.c';
      (0, _fields_browser2.filterFieldsBrowser)(filterInput);
      cy.get(_fields_browser.FIELDS_BROWSER_HEADER_HOST_GEO_CONTINENT_NAME_HEADER).should('not.exist');
      (0, _fields_browser2.addsHostGeoContinentNameToTimeline)();
      (0, _fields_browser2.closeFieldsBrowser)();
      cy.get(_fields_browser.FIELDS_BROWSER_HEADER_HOST_GEO_CONTINENT_NAME_HEADER).should('exist');
      (0, _timeline2.openTimelineFieldsBrowser)();
      (0, _fields_browser2.resetFields)();
      cy.get(_fields_browser.FIELDS_BROWSER_HEADER_HOST_GEO_CONTINENT_NAME_HEADER).should('not.exist');
    });
    it('restores focus to the Customize Columns button when `Reset Fields` is clicked', () => {
      (0, _timeline2.openTimelineFieldsBrowser)();
      (0, _fields_browser2.resetFields)();
      cy.get(_timeline.TIMELINE_FIELDS_BUTTON).should('have.focus');
    });
    it('restores focus to the Customize Columns button when Esc is pressed', () => {
      (0, _timeline2.openTimelineFieldsBrowser)();
      cy.get(_fields_browser.FIELDS_BROWSER_FILTER_INPUT).type('{esc}');
      cy.get(_timeline.TIMELINE_FIELDS_BUTTON).should('have.focus');
    });
  });
});