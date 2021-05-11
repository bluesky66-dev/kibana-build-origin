"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetAllUsersRoutes = defineGetAllUsersRoutes;

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineGetAllUsersRoutes({
  router
}) {
  router.get({
    path: '/internal/security/users',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      return response.ok({
        // Return only values since keys (user names) are already duplicated there.
        body: Object.values((await context.core.elasticsearch.client.asCurrentUser.security.getUser()).body)
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}