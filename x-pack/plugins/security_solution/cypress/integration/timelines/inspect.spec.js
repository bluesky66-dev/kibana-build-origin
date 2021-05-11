"use strict";

var _inspect = require("../../screens/inspect");

var _login = require("../../tasks/login");

var _security_main = require("../../tasks/security_main");

var _timeline = require("../../tasks/timeline");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Inspect', () => {
  context('Timeline', () => {
    it('inspects the timeline', () => {
      const hostExistsQuery = 'host.name: *';
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
      (0, _security_main.openTimelineUsingToggle)();
      (0, _timeline.executeTimelineKQL)(hostExistsQuery);
      (0, _timeline.openTimelineInspectButton)();
      cy.get(_inspect.INSPECT_MODAL).should('be.visible');
    });
  });
});