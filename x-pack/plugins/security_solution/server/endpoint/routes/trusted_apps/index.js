"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTrustedAppsRoutes = void 0;

var _trusted_apps = require("../../../../common/endpoint/schema/trusted_apps");

var _constants = require("../../../../common/endpoint/constants");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerTrustedAppsRoutes = (router, endpointAppContext) => {
  // DELETE one
  router.delete({
    path: _constants.TRUSTED_APPS_DELETE_API,
    validate: _trusted_apps.DeleteTrustedAppsRequestSchema,
    options: {
      authRequired: true
    }
  }, (0, _handlers.getTrustedAppsDeleteRouteHandler)(endpointAppContext)); // GET list

  router.get({
    path: _constants.TRUSTED_APPS_LIST_API,
    validate: _trusted_apps.GetTrustedAppsRequestSchema,
    options: {
      authRequired: true
    }
  }, (0, _handlers.getTrustedAppsListRouteHandler)(endpointAppContext)); // CREATE

  router.post({
    path: _constants.TRUSTED_APPS_CREATE_API,
    validate: _trusted_apps.PostTrustedAppCreateRequestSchema,
    options: {
      authRequired: true
    }
  }, (0, _handlers.getTrustedAppsCreateRouteHandler)(endpointAppContext)); // SUMMARY

  router.get({
    path: _constants.TRUSTED_APPS_SUMMARY_API,
    validate: false,
    options: {
      authRequired: true
    }
  }, (0, _handlers.getTrustedAppsSummaryRouteHandler)(endpointAppContext));
};

exports.registerTrustedAppsRoutes = registerTrustedAppsRoutes;