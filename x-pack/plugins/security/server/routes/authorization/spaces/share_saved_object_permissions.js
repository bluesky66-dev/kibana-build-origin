"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineShareSavedObjectPermissionRoutes = defineShareSavedObjectPermissionRoutes;

var _configSchema = require("@kbn/config-schema");

var _licensed_route_handler = require("../../licensed_route_handler");

var _errors = require("../../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineShareSavedObjectPermissionRoutes({
  router,
  authz
}) {
  router.get({
    path: '/internal/security/_share_saved_object_permissions',
    validate: {
      query: _configSchema.schema.object({
        type: _configSchema.schema.string()
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    let shareToAllSpaces = true;
    const {
      type
    } = request.query;

    try {
      const checkPrivileges = authz.checkPrivilegesWithRequest(request);
      shareToAllSpaces = (await checkPrivileges.globally({
        kibana: authz.actions.savedObject.get(type, 'share_to_space')
      })).hasAllRequested;
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }

    return response.ok({
      body: {
        shareToAllSpaces
      }
    });
  }));
}