"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = exports.getCheckPermissionsHandler = void 0;

var _constants = require("../../constants");

var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCheckPermissionsHandler = async (context, request, response) => {
  const body = {
    success: true
  };

  try {
    const security = await _services.appContextService.getSecurity();
    const user = security.authc.getCurrentUser(request);

    if (!(user !== null && user !== void 0 && user.roles.includes('superuser'))) {
      body.success = false;
      body.error = 'MISSING_SUPERUSER_ROLE';
      return response.ok({
        body
      });
    }

    return response.ok({
      body: {
        success: true
      }
    });
  } catch (e) {
    body.success = false;
    body.error = 'MISSING_SECURITY';
    return response.ok({
      body
    });
  }
};

exports.getCheckPermissionsHandler = getCheckPermissionsHandler;

const registerRoutes = router => {
  router.get({
    path: _constants.APP_API_ROUTES.CHECK_PERMISSIONS_PATTERN,
    validate: {},
    options: {
      tags: []
    }
  }, getCheckPermissionsHandler);
};

exports.registerRoutes = registerRoutes;