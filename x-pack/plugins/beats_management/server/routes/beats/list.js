"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListAgentsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _security = require("../../../common/constants/security");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerListAgentsRoute = router => {
  router.get({
    path: '/api/beats/agents/{listByAndValue*}',
    validate: {
      params: _configSchema.schema.object({
        listByAndValue: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      query: _configSchema.schema.object({
        ESQuery: _configSchema.schema.maybe(_configSchema.schema.string())
      }, {
        defaultValue: {}
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredRoles: ['beats_admin'],
    requiredLicense: _security.REQUIRED_LICENSES
  }, async (context, request, response) => {
    var _request$params$listB, _request$params$listB2;

    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const listByAndValueParts = (_request$params$listB = (_request$params$listB2 = request.params.listByAndValue) === null || _request$params$listB2 === void 0 ? void 0 : _request$params$listB2.split('/')) !== null && _request$params$listB !== void 0 ? _request$params$listB : [];
    let listBy = null;
    let listByValue = null;

    if (listByAndValueParts.length === 2) {
      listBy = listByAndValueParts[0];
      listByValue = listByAndValueParts[1];
    }

    let beats;

    switch (listBy) {
      case 'tag':
        beats = await beatsManagement.beats.getAllWithTag(user, listByValue || '');
        break;

      default:
        beats = await beatsManagement.beats.getAll(user, request.query.ESQuery ? JSON.parse(request.query.ESQuery) : undefined);
        break;
    }

    return response.ok({
      body: {
        list: beats,
        success: true,
        page: -1,
        total: -1
      }
    });
  }));
};

exports.registerListAgentsRoute = registerListAgentsRoute;