"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEsPrivilegeResponse = validateEsPrivilegeResponse;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Validates an Elasticsearch "Has privileges" response against the expected application, actions, and resources.
 *
 * Note: the `actions` and `resources` parameters must be unique string arrays; any duplicates will cause validation to fail.
 */


function validateEsPrivilegeResponse(response, application, actions, resources) {
  const validationSchema = buildValidationSchema(application, actions, resources);

  try {
    validationSchema.validate(response);
  } catch (e) {
    throw new Error(`Invalid response received from Elasticsearch has_privilege endpoint. ${e}`);
  }

  return response;
}

function buildValidationSchema(application, actions, resources) {
  const actionValidationSchema = _configSchema.schema.boolean();

  const actionsValidationSchema = _configSchema.schema.object({}, {
    unknowns: 'allow',
    validate: value => {
      const actualActions = Object.keys(value).sort();

      if (actions.length !== actualActions.length || ![...actions].sort().every((x, i) => x === actualActions[i])) {
        throw new Error('Payload did not match expected actions');
      }

      Object.values(value).forEach(actionResult => {
        actionValidationSchema.validate(actionResult);
      });
    }
  });

  const resourcesValidationSchema = _configSchema.schema.object({}, {
    unknowns: 'allow',
    validate: value => {
      const actualResources = Object.keys(value).sort();

      if (resources.length !== actualResources.length || ![...resources].sort().every((x, i) => x === actualResources[i])) {
        throw new Error('Payload did not match expected resources');
      }

      Object.values(value).forEach(actionResult => {
        actionsValidationSchema.validate(actionResult);
      });
    }
  });

  return _configSchema.schema.object({
    username: _configSchema.schema.string(),
    has_all_requested: _configSchema.schema.boolean(),
    cluster: _configSchema.schema.object({}, {
      unknowns: 'allow'
    }),
    application: _configSchema.schema.object({
      [application]: resourcesValidationSchema
    }),
    index: _configSchema.schema.object({}, {
      unknowns: 'allow'
    })
  });
}