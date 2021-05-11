"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineViewRoutes = defineViewRoutes;

var _access_agreement = require("./access_agreement");

var _account_management = require("./account_management");

var _logged_out = require("./logged_out");

var _login = require("./login");

var _logout = require("./logout");

var _overwritten_session = require("./overwritten_session");

var _capture_url = require("./capture_url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineViewRoutes(params) {
  if (params.config.authc.selector.enabled || params.config.authc.sortedProviders.some(({
    type
  }) => type === 'basic' || type === 'token')) {
    (0, _login.defineLoginRoutes)(params);
  }

  (0, _access_agreement.defineAccessAgreementRoutes)(params);
  (0, _account_management.defineAccountManagementRoutes)(params);
  (0, _logged_out.defineLoggedOutRoutes)(params);
  (0, _logout.defineLogoutRoutes)(params);
  (0, _overwritten_session.defineOverwrittenSessionRoutes)(params);
  (0, _capture_url.defineCaptureURLRoutes)(params);
}