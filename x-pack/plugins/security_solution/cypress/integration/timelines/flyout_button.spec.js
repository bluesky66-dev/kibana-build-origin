"use strict";

var _security_main = require("../../screens/security_main");

var _timeline = require("../../screens/timeline");

var _common = require("../../tasks/common");

var _all_hosts = require("../../tasks/hosts/all_hosts");

var _login = require("../../tasks/login");

var _security_main2 = require("../../tasks/security_main");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('timeline flyout button', () => {
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
    (0, _all_hosts.waitForAllHostsToBeLoaded)();
  });
  it('toggles open the timeline', () => {
    (0, _security_main2.openTimelineUsingToggle)();
    cy.get(_timeline.TIMELINE_FLYOUT_HEADER).should('have.css', 'visibility', 'visible');
    (0, _security_main2.closeTimelineUsingToggle)();
  });
  it('re-focuses the toggle button when timeline is closed by clicking the active timeline toggle button', () => {
    (0, _security_main2.openTimelineUsingToggle)();
    (0, _security_main2.closeTimelineUsingToggle)();
    cy.get(_security_main.TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON).should('have.focus');
  });
  it('re-focuses the toggle button when timeline is closed by clicking the [X] close button', () => {
    (0, _security_main2.openTimelineUsingToggle)();
    (0, _security_main2.closeTimelineUsingCloseButton)();
    cy.get(_security_main.TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON).should('have.focus');
  });
  it('re-focuses the toggle button when timeline is closed by pressing the Esc key', () => {
    (0, _security_main2.openTimelineUsingToggle)();
    cy.get('body').type('{esc}');
    cy.get(_security_main.TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON).should('have.focus');
  });
  it('the `(+)` button popover menu owns focus', () => {
    cy.get(_timeline.TIMELINE_SETTINGS_ICON).filter(':visible').click({
      force: true
    });
    cy.get(_timeline.CREATE_NEW_TIMELINE).should('have.focus');
    cy.get('body').type('{esc}');
    cy.get(_timeline.CREATE_NEW_TIMELINE).should('not.be.visible');
  });
  it('should render the global search dropdown when the input is focused', () => {
    (0, _security_main2.openTimelineUsingToggle)();
    cy.get('[data-test-subj="nav-search-input"]').focus();
    cy.get('[data-test-subj="nav-search-input"]').should('be.focused');
    cy.get('[data-test-subj="nav-search-option"]').should('be.visible');
    cy.get('[data-test-subj="nav-search-option"]').first().trigger('mouseenter'); // check that at least one item is visible in the search bar after mousing over, i.e. it's still usable.

    cy.get('[data-test-subj="nav-search-option"]').its('length').should('be.gte', 1);
    (0, _security_main2.closeTimelineUsingCloseButton)();
  });
  it('sets correct classes when the user starts dragging a host, but is not hovering over the data providers', () => {
    (0, _all_hosts.dragFirstHostToTimeline)();
    cy.get(_timeline.IS_DRAGGING_DATA_PROVIDERS).find(_timeline.TIMELINE_DATA_PROVIDERS).filter(':visible').should('have.class', 'drop-target-data-providers');
  });
});