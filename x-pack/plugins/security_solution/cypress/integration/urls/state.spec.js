"use strict";

var _date_picker = require("../../screens/date_picker");

var _all_hosts = require("../../screens/hosts/all_hosts");

var _main = require("../../screens/hosts/main");

var _security_header = require("../../screens/security_header");

var _timeline = require("../../screens/timeline");

var _login = require("../../tasks/login");

var _date_picker2 = require("../../tasks/date_picker");

var _all_hosts2 = require("../../tasks/hosts/all_hosts");

var _main2 = require("../../tasks/hosts/main");

var _flows = require("../../tasks/network/flows");

var _security_header2 = require("../../tasks/security_header");

var _security_main = require("../../tasks/security_main");

var _timeline2 = require("../../tasks/timeline");

var _navigation = require("../../urls/navigation");

var _state = require("../../urls/state");

var _timeline3 = require("../../objects/timeline");

var _create_new_case = require("../../screens/create_new_case");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ABSOLUTE_DATE = {
  endTime: '2019-08-01T20:33:29.186Z',
  endTimeTimeline: '2019-08-02T21:03:29.186Z',
  newEndTimeTyped: 'Aug 01, 2019 @ 15:03:29.186',
  newStartTimeTyped: 'Aug 01, 2019 @ 14:33:29.186',
  startTime: '2019-08-01T20:03:29.186Z',
  startTimeTimeline: '2019-08-02T20:03:29.186Z'
};
describe('url state', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
  });
  it('sets the global start and end dates from the url', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.url);
    cy.get(_date_picker.DATE_PICKER_START_DATE_POPOVER_BUTTON).should('have.attr', 'title', ABSOLUTE_DATE.startTime);
    cy.get(_date_picker.DATE_PICKER_END_DATE_POPOVER_BUTTON).should('have.attr', 'title', ABSOLUTE_DATE.endTime);
  });
  it('sets the url state when start and end date are set', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.url);
    (0, _date_picker2.setStartDate)(ABSOLUTE_DATE.newStartTimeTyped);
    (0, _date_picker2.updateDates)();
    (0, _flows.waitForIpsTableToBeLoaded)();
    (0, _date_picker2.setEndDate)(ABSOLUTE_DATE.newEndTimeTyped);
    (0, _date_picker2.updateDates)();
    cy.url().should('include', `(global:(linkTo:!(timeline),timerange:(from:%27${new Date(ABSOLUTE_DATE.newStartTimeTyped).toISOString()}%27,kind:absolute,to:%27${new Date(ABSOLUTE_DATE.newEndTimeTyped).toISOString()}%27))`);
  });
  it('sets the timeline start and end dates from the url when locked to global time', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.url);
    (0, _security_main.openTimelineUsingToggle)();
    cy.get(_date_picker.DATE_PICKER_START_DATE_POPOVER_BUTTON_TIMELINE).should('have.attr', 'title', ABSOLUTE_DATE.startTime);
    cy.get(_date_picker.DATE_PICKER_END_DATE_POPOVER_BUTTON_TIMELINE).should('have.attr', 'title', ABSOLUTE_DATE.endTime);
  });
  it('sets the timeline start and end dates independently of the global start and end dates when times are unlocked', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.urlUnlinked);
    cy.get(_date_picker.DATE_PICKER_START_DATE_POPOVER_BUTTON).should('have.attr', 'title', ABSOLUTE_DATE.startTime);
    cy.get(_date_picker.DATE_PICKER_END_DATE_POPOVER_BUTTON).should('have.attr', 'title', ABSOLUTE_DATE.endTime);
    (0, _security_main.openTimelineUsingToggle)();
    cy.get(_date_picker.DATE_PICKER_START_DATE_POPOVER_BUTTON_TIMELINE).should('have.attr', 'title', ABSOLUTE_DATE.startTimeTimeline);
    cy.get(_date_picker.DATE_PICKER_END_DATE_POPOVER_BUTTON_TIMELINE).should('have.attr', 'title', ABSOLUTE_DATE.endTimeTimeline);
  });
  it('sets the url state when timeline/global date pickers are unlinked and timeline start and end date are set', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.urlUnlinked);
    (0, _security_main.openTimelineUsingToggle)();
    (0, _date_picker2.setTimelineStartDate)(ABSOLUTE_DATE.newStartTimeTyped);
    (0, _date_picker2.updateTimelineDates)();
    (0, _date_picker2.setTimelineEndDate)(ABSOLUTE_DATE.newEndTimeTyped);
    (0, _date_picker2.updateTimelineDates)();
    cy.url().should('include', `timeline:(linkTo:!(),timerange:(from:%27${new Date(ABSOLUTE_DATE.newStartTimeTyped).toISOString()}%27,kind:absolute,to:%27${new Date(ABSOLUTE_DATE.newEndTimeTyped).toISOString()}%27))`);
  });
  it('sets kql on network page', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.urlKqlNetworkNetwork);
    cy.get(_security_header.KQL_INPUT).should('have.text', 'source.ip: "10.142.0.9"');
  });
  it('sets kql on hosts page', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.urlKqlHostsHosts);
    cy.get(_security_header.KQL_INPUT).should('have.text', 'source.ip: "10.142.0.9"');
  });
  it('sets the url state when kql is set', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.url);
    (0, _security_header2.kqlSearch)('source.ip: "10.142.0.9" {enter}');
    cy.url().should('include', `query=(language:kuery,query:%27source.ip:%20%2210.142.0.9%22%20%27)`);
  });
  it('sets the url state when kql is set and check if href reflect this change', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.url);
    (0, _security_header2.kqlSearch)('source.ip: "10.142.0.9" {enter}');
    (0, _security_header2.navigateFromHeaderTo)(_security_header.HOSTS);
    cy.get(_security_header.NETWORK).should('have.attr', 'href', `/app/security/network?query=(language:kuery,query:'source.ip:%20%2210.142.0.9%22%20')&sourcerer=(default:!(\'auditbeat-*\'))&timerange=(global:(linkTo:!(timeline),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2019-08-01T20:33:29.186Z')),timeline:(linkTo:!(global),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2019-08-01T20:33:29.186Z')))`);
  });
  it('sets KQL in host page and detail page and check if href match on breadcrumb, tabs and subTabs', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.urlHostNew);
    (0, _security_header2.kqlSearch)('host.name: "siem-kibana" {enter}');
    (0, _main2.openAllHosts)();
    (0, _all_hosts2.waitForAllHostsToBeLoaded)();
    cy.get(_security_header.HOSTS).should('have.attr', 'href', `/app/security/hosts?query=(language:kuery,query:'host.name:%20%22siem-kibana%22%20')&sourcerer=(default:!(\'auditbeat-*\'))&timerange=(global:(linkTo:!(timeline),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')),timeline:(linkTo:!(global),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')))`);
    cy.get(_security_header.NETWORK).should('have.attr', 'href', `/app/security/network?query=(language:kuery,query:'host.name:%20%22siem-kibana%22%20')&sourcerer=(default:!(\'auditbeat-*\'))&timerange=(global:(linkTo:!(timeline),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')),timeline:(linkTo:!(global),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')))`);
    cy.get(_all_hosts.HOSTS_NAMES).first().should('have.text', 'siem-kibana');
    (0, _all_hosts2.openFirstHostDetails)();
    (0, _security_header2.clearSearchBar)();
    (0, _security_header2.kqlSearch)('agent.type: "auditbeat" {enter}');
    cy.get(_main.ANOMALIES_TAB).should('have.attr', 'href', "/app/security/hosts/siem-kibana/anomalies?query=(language:kuery,query:'agent.type:%20%22auditbeat%22%20')&sourcerer=(default:!('auditbeat-*'))&timerange=(global:(linkTo:!(timeline),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')),timeline:(linkTo:!(global),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')))");
    cy.get(_security_header.BREADCRUMBS).eq(1).should('have.attr', 'href', `/app/security/hosts?query=(language:kuery,query:'agent.type:%20%22auditbeat%22%20')&sourcerer=(default:!(\'auditbeat-*\'))&timerange=(global:(linkTo:!(timeline),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')),timeline:(linkTo:!(global),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')))`);
    cy.get(_security_header.BREADCRUMBS).eq(2).should('have.attr', 'href', `/app/security/hosts/siem-kibana?query=(language:kuery,query:'agent.type:%20%22auditbeat%22%20')&sourcerer=(default:!(\'auditbeat-*\'))&timerange=(global:(linkTo:!(timeline),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')),timeline:(linkTo:!(global),timerange:(from:'2019-08-01T20:03:29.186Z',kind:absolute,to:'2020-01-01T21:33:29.186Z')))`);
  });
  it('Do not clears kql when navigating to a new page', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_state.ABSOLUTE_DATE_RANGE.urlKqlHostsHosts);
    (0, _security_header2.navigateFromHeaderTo)(_security_header.NETWORK);
    cy.get(_security_header.KQL_INPUT).should('have.text', 'source.ip: "10.142.0.9"');
  });
  it('sets and reads the url state for timeline by id', () => {
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
    (0, _security_main.openTimelineUsingToggle)();
    (0, _timeline2.populateTimeline)();
    cy.intercept('PATCH', '/api/timeline').as('timeline');
    (0, _timeline2.addNameToTimeline)(_timeline3.timeline.title);
    cy.wait('@timeline').then(({
      response
    }) => {
      (0, _timeline2.closeTimeline)();
      cy.wrap(response.statusCode).should('eql', 200);
      const timelineId = response.body.data.persistTimeline.timeline.savedObjectId;
      cy.visit('/app/home');
      cy.visit(`/app/security/timelines?timeline=(id:'${timelineId}',isOpen:!t)`);
      cy.get(_date_picker.DATE_PICKER_APPLY_BUTTON_TIMELINE).should('exist');
      cy.get(_date_picker.DATE_PICKER_APPLY_BUTTON_TIMELINE).should('not.have.text', 'Updating');
      cy.get(_create_new_case.TIMELINE).should('be.visible');
      cy.get(_timeline.TIMELINE_TITLE).should('be.visible');
      cy.get(_timeline.TIMELINE_TITLE).should('have.text', _timeline3.timeline.title);
    });
  });
});