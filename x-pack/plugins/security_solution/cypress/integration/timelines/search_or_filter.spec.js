"use strict";

var _timeline = require("../../screens/timeline");

var _common = require("../../tasks/common");

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


describe('timeline search or filter KQL bar', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
  });
  it('executes a KQL query', () => {
    const hostExistsQuery = 'host.name: *';
    (0, _security_main.openTimelineUsingToggle)();
    (0, _timeline2.executeTimelineKQL)(hostExistsQuery);
    cy.get(_timeline.SERVER_SIDE_EVENT_COUNT).should($count => expect(+$count.text()).to.be.gt(0));
  });
});