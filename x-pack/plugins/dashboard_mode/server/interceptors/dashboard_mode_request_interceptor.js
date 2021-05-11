"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupDashboardModeRequestInterceptor = void 0;

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const superuserRole = 'superuser';

const setupDashboardModeRequestInterceptor = ({
  http,
  security,
  getUiSettingsClient
}) => async (request, response, toolkit) => {
  const path = request.url.pathname;
  const isAppRequest = path.startsWith('/app/');

  if (!isAppRequest) {
    return toolkit.next();
  }

  const authenticatedUser = security.authc.getCurrentUser(request);
  const roles = (authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.roles) || [];

  if (!authenticatedUser || roles.length === 0) {
    return toolkit.next();
  }

  const uiSettings = await getUiSettingsClient();
  const dashboardOnlyModeRoles = await uiSettings.get(_common.UI_SETTINGS.CONFIG_DASHBOARD_ONLY_MODE_ROLES);

  if (!dashboardOnlyModeRoles) {
    return toolkit.next();
  }

  const isDashboardOnlyModeUser = roles.find(role => dashboardOnlyModeRoles.includes(role));
  const isSuperUser = roles.find(role => role === superuserRole);
  const enforceDashboardOnlyMode = isDashboardOnlyModeUser && !isSuperUser;

  if (enforceDashboardOnlyMode) {
    if (path.startsWith('/app/home') || path.startsWith('/app/kibana') || path.startsWith('/app/dashboards')) {
      const dashBoardModeUrl = `${http.basePath.get(request)}/app/dashboard_mode`; // If the user is in "Dashboard only mode" they should only be allowed to see
      // the dashboard app and none others.

      return response.redirected({
        headers: {
          location: dashBoardModeUrl
        }
      });
    }

    if (path.startsWith('/app/dashboard_mode')) {
      // let through requests to the dashboard_mode app
      return toolkit.next();
    }

    return response.notFound();
  }

  return toolkit.next();
};

exports.setupDashboardModeRequestInterceptor = setupDashboardModeRequestInterceptor;