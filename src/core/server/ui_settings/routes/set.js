"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSetRoute = registerSetRoute;

var _configSchema = require("@kbn/config-schema");

var _saved_objects = require("../../saved_objects");

var _ui_settings_errors = require("../ui_settings_errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const validate = {
  params: _configSchema.schema.object({
    key: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    value: _configSchema.schema.any()
  })
};

function registerSetRoute(router) {
  router.post({
    path: '/api/kibana/settings/{key}',
    validate
  }, async (context, request, response) => {
    try {
      const uiSettingsClient = context.core.uiSettings.client;
      const {
        key
      } = request.params;
      const {
        value
      } = request.body;
      await uiSettingsClient.set(key, value);
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

      if (error instanceof _ui_settings_errors.CannotOverrideError || error instanceof _configSchema.ValidationError) {
        return response.badRequest({
          body: error
        });
      }

      throw error;
    }
  });
}