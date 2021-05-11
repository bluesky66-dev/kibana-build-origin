"use strict";

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");

var _all_hosts = require("../../tasks/hosts/all_hosts");

var _sourcerer = require("../../tasks/sourcerer");

var _security_main = require("../../tasks/security_main");

var _timeline = require("../../tasks/timeline");

var _timeline2 = require("../../screens/timeline");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Skipped at the moment as this has flake due to click handler issues. This has been raised with team members
// and the code is being re-worked and then these tests will be unskipped


describe.skip('Sourcerer', () => {
  before(() => {
    (0, _common.cleanKibana)();
  });
  beforeEach(() => {
    cy.clearLocalStorage();
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
  });
  describe('Default scope', () => {
    it('has SIEM index patterns selected on initial load', () => {
      (0, _sourcerer.openSourcerer)();
      (0, _sourcerer.isSourcererSelection)(`auditbeat-*`);
    });
    it('has Kibana index patterns in the options', () => {
      (0, _sourcerer.openSourcerer)();
      (0, _sourcerer.isSourcererOptions)([`metrics-*`, `logs-*`]);
    });
    it('selected KIP gets added to sourcerer', () => {
      (0, _sourcerer.setSourcererOption)(`metrics-*`);
      (0, _sourcerer.openSourcerer)();
      (0, _sourcerer.isSourcererSelection)(`metrics-*`);
    });
    it('does not return data without correct pattern selected', () => {
      (0, _all_hosts.waitForAllHostsToBeLoaded)();
      (0, _sourcerer.isHostsStatValue)('4 ');
      (0, _sourcerer.setSourcererOption)(`metrics-*`);
      (0, _sourcerer.unsetSourcererOption)(`auditbeat-*`);
      (0, _sourcerer.isHostsStatValue)('0 ');
    });
    it('reset button restores to original state', () => {
      (0, _sourcerer.setSourcererOption)(`metrics-*`);
      (0, _sourcerer.openSourcerer)();
      (0, _sourcerer.isSourcererSelection)(`metrics-*`);
      (0, _sourcerer.resetSourcerer)();
      (0, _sourcerer.openSourcerer)();
      (0, _sourcerer.isNotSourcererSelection)(`metrics-*`);
    });
  });
  describe('Timeline scope', () => {
    const alertPatterns = ['.siem-signals-default'];
    const rawPatterns = ['auditbeat-*'];
    const allPatterns = [...alertPatterns, ...rawPatterns];
    it('Radio buttons select correct sourcerer patterns', () => {
      (0, _security_main.openTimelineUsingToggle)();
      (0, _sourcerer.openSourcerer)('timeline');
      allPatterns.forEach(ss => (0, _sourcerer.isSourcererSelection)(ss, 'timeline'));
      (0, _sourcerer.clickTimelineRadio)('raw');
      rawPatterns.forEach(ss => (0, _sourcerer.isSourcererSelection)(ss, 'timeline'));
      alertPatterns.forEach(ss => (0, _sourcerer.isNotSourcererSelection)(ss, 'timeline'));
      (0, _sourcerer.clickTimelineRadio)('alert');
      alertPatterns.forEach(ss => (0, _sourcerer.isSourcererSelection)(ss, 'timeline'));
      rawPatterns.forEach(ss => (0, _sourcerer.isNotSourcererSelection)(ss, 'timeline'));
    });
    it('Adding an option results in the custom radio becoming active', () => {
      (0, _security_main.openTimelineUsingToggle)();
      (0, _sourcerer.openSourcerer)('timeline');
      (0, _sourcerer.isNotCustomRadio)();
      (0, _sourcerer.clickOutOfSourcererTimeline)();
      const luckyOption = 'logs-*';
      (0, _sourcerer.setSourcererOption)(luckyOption, 'timeline');
      (0, _sourcerer.openSourcerer)('timeline');
      (0, _sourcerer.isCustomRadio)();
    });
    it('Selected index patterns are properly queried', () => {
      (0, _security_main.openTimelineUsingToggle)();
      (0, _timeline.populateTimeline)();
      (0, _sourcerer.openSourcerer)('timeline');
      (0, _sourcerer.deselectSourcererOptions)(rawPatterns, 'timeline');
      cy.get(_timeline2.SERVER_SIDE_EVENT_COUNT).should($count => expect(+$count.text()).to.eql(0));
    });
  });
});