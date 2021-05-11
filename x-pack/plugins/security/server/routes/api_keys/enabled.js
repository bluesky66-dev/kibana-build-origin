"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineEnabledApiKeysRoutes = defineEnabledApiKeysRoutes;

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineEnabledApiKeysRoutes({
  router,
  getAuthenticationService
}) {
  router.get({
    path: '/internal/security/api_key/_enabled',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const apiKeysEnabled = await getAuthenticationService().apiKeys.areAPIKeysEnabled();
      return response.ok({
        body: {
          apiKeysEnabled
        }
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}