"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetAllRolesRoutes = defineGetAllRolesRoutes;

var _licensed_route_handler = require("../../licensed_route_handler");

var _errors = require("../../../errors");

var _model = require("./model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineGetAllRolesRoutes({
  router,
  authz
}) {
  router.get({
    path: '/api/security/role',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const {
        body: elasticsearchRoles
      } = await context.core.elasticsearch.client.asCurrentUser.security.getRole(); // Transform elasticsearch roles into Kibana roles and return in a list sorted by the role name.

      return response.ok({
        body: Object.entries(elasticsearchRoles).map(([roleName, elasticsearchRole]) => (0, _model.transformElasticsearchRoleToRole)(elasticsearchRole, roleName, authz.applicationName)).sort((roleA, roleB) => {
          if (roleA.name < roleB.name) {
            return -1;
          }

          if (roleA.name > roleB.name) {
            return 1;
          }

          return 0;
        })
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}