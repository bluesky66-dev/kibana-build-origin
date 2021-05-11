"use strict";

var _timeline = require("../../screens/timeline");

var _all_hosts = require("../../screens/hosts/all_hosts");

var _all_hosts2 = require("../../tasks/hosts/all_hosts");

var _login = require("../../tasks/login");

var _security_main = require("../../tasks/security_main");

var _timeline2 = require("../../tasks/timeline");

var _navigation = require("../../urls/navigation");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('timeline data providers', () => {
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
    (0, _all_hosts2.waitForAllHostsToBeLoaded)();
    (0, _common.scrollToBottom)();
  });
  afterEach(() => {
    (0, _timeline2.createNewTimeline)();
    (0, _timeline2.closeTimeline)();
  });
  it('renders the data provider of a host dragged from the All Hosts widget on the hosts page', () => {
    (0, _all_hosts2.dragAndDropFirstHostToTimeline)();
    (0, _security_main.openTimelineUsingToggle)();
    cy.get(_timeline.TIMELINE_DROPPED_DATA_PROVIDERS).first().invoke('text').then(dataProviderText => {
      cy.get(_all_hosts.HOSTS_NAMES_DRAGGABLE).first().invoke('text').should(hostname => {
        expect(dataProviderText).to.eq(`host.name: "${hostname}"AND`);
      });
    });
  });
  it('displays the data provider action menu when Enter is pressed', done => {
    (0, _security_main.openTimelineUsingToggle)();
    (0, _timeline2.addDataProvider)({
      field: 'host.name',
      operator: 'exists'
    }).then(() => {
      cy.get(_timeline.TIMELINE_DATA_PROVIDERS_ACTION_MENU).should('not.exist');
      cy.get(`${_timeline.TIMELINE_FLYOUT_HEADER} ${_timeline.TIMELINE_DROPPED_DATA_PROVIDERS}`).pipe($el => $el.trigger('focus')).should('exist');
      cy.get(`${_timeline.TIMELINE_FLYOUT_HEADER} ${_timeline.TIMELINE_DROPPED_DATA_PROVIDERS}`).first().parent().type('{enter}');
      cy.get(_timeline.TIMELINE_DATA_PROVIDERS_ACTION_MENU).should('exist');
      done();
    });
  });
  it('sets correct classes when the user starts dragging a host, but is not hovering over the data providers', () => {
    (0, _all_hosts2.dragFirstHostToTimeline)();
    cy.get(_timeline.IS_DRAGGING_DATA_PROVIDERS).find(_timeline.TIMELINE_DATA_PROVIDERS).filter(':visible').should('have.class', 'drop-target-data-providers');
  });
  it('render an extra highlighted area in dataProvider when the user starts dragging a host AND is hovering over the data providers', () => {
    (0, _all_hosts2.dragFirstHostToEmptyTimelineDataProviders)();
    cy.get(_timeline.IS_DRAGGING_DATA_PROVIDERS).find(_timeline.TIMELINE_DATA_PROVIDERS_EMPTY).children().should('exist'); // Release the dragging item so the cursor can peform other action

    (0, _all_hosts2.unDragFirstHostToEmptyTimelineDataProviders)();
  });
});