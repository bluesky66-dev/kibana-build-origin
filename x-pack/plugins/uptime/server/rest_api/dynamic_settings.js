"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPostDynamicSettingsRoute = exports.validateCertsValues = exports.createGetDynamicSettingsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _Either = require("fp-ts/lib/Either");

var _PathReporter = require("io-ts/lib/PathReporter");

var _runtime_types = require("../../common/runtime_types");

var _saved_objects = require("../lib/saved_objects");

var _translations = require("../../common/translations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetDynamicSettingsRoute = libs => ({
  method: 'GET',
  path: '/api/uptime/dynamic_settings',
  validate: false,
  handler: async ({
    savedObjectsClient
  }) => {
    return _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
  }
});

exports.createGetDynamicSettingsRoute = createGetDynamicSettingsRoute;

const validateCertsValues = settings => {
  const errors = {};

  if (settings.certAgeThreshold <= 0) {
    errors.certAgeThreshold = _translations.VALUE_MUST_BE_GREATER_THAN_ZERO;
  } else if (settings.certAgeThreshold % 1) {
    errors.certAgeThreshold = _translations.VALUE_MUST_BE_AN_INTEGER;
  }

  if (settings.certExpirationThreshold <= 0) {
    errors.certExpirationThreshold = _translations.VALUE_MUST_BE_GREATER_THAN_ZERO;
  } else if (settings.certExpirationThreshold % 1) {
    errors.certExpirationThreshold = _translations.VALUE_MUST_BE_AN_INTEGER;
  }

  if (errors.certAgeThreshold || errors.certExpirationThreshold) {
    return errors;
  }
};

exports.validateCertsValues = validateCertsValues;

const createPostDynamicSettingsRoute = libs => ({
  method: 'POST',
  path: '/api/uptime/dynamic_settings',
  validate: {
    body: _configSchema.schema.object({
      heartbeatIndices: _configSchema.schema.string(),
      certAgeThreshold: _configSchema.schema.number(),
      certExpirationThreshold: _configSchema.schema.number(),
      defaultConnectors: _configSchema.schema.arrayOf(_configSchema.schema.string())
    })
  },
  writeAccess: true,
  handler: async ({
    savedObjectsClient,
    request,
    response
  }) => {
    const decoded = _runtime_types.DynamicSettingsType.decode(request.body);

    const certThresholdErrors = validateCertsValues(request.body);

    if ((0, _Either.isRight)(decoded) && !certThresholdErrors) {
      const newSettings = decoded.right;
      await _saved_objects.savedObjectsAdapter.setUptimeDynamicSettings(savedObjectsClient, newSettings);
      return response.ok({
        body: {
          success: true
        }
      });
    } else {
      const error = _PathReporter.PathReporter.report(decoded).join(', ');

      return response.badRequest({
        body: JSON.stringify(certThresholdErrors) || error
      });
    }
  }
});

exports.createPostDynamicSettingsRoute = createPostDynamicSettingsRoute;