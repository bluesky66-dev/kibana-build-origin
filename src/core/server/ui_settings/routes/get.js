"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = registerGetRoute;

var _saved_objects = require("../../saved_objects");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerGetRoute(router) {
  router.get({
    path: '/api/kibana/settings',
    validate: false
  }, async (context, request, response) => {
    try {
      const uiSettingsClient = context.core.uiSettings.client;
      return response.ok({
        body: {
          settings: await uiSettingsClient.getUserProvided()
        }
      });
    } catch (error) {
      if (_saved_objects.SavedObjectsErrorHelpers.isSavedObjectsClientError(error)) {
        return response.customError({
          body: error,
          statusCode: error.output.statusCode
        });
      }

      throw error;
    }
  });
}