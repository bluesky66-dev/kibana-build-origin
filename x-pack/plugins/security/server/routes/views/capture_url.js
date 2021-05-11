"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineCaptureURLRoutes = defineCaptureURLRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for the Capture URL view.
 */


function defineCaptureURLRoutes({
  httpResources
}) {
  httpResources.register({
    path: '/internal/security/capture-url',
    validate: {
      query: _configSchema.schema.object({
        providerType: _configSchema.schema.string({
          minLength: 1
        }),
        providerName: _configSchema.schema.string({
          minLength: 1
        }),
        next: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      authRequired: false
    }
  }, (context, request, response) => response.renderAnonymousCoreApp());
}