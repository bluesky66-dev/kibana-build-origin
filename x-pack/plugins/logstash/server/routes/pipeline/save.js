"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPipelineSaveRoute = registerPipelineSaveRoute;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _pipeline = require("../../models/pipeline");

var _server = require("../../../../licensing/server");

var _check_license = require("../../lib/check_license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerPipelineSaveRoute(router, security) {
  router.put({
    path: '/api/logstash/pipeline/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        description: _configSchema.schema.maybe(_configSchema.schema.string()),
        pipeline: _configSchema.schema.string(),
        settings: _configSchema.schema.maybe(_configSchema.schema.object({}, {
          unknowns: 'allow'
        }))
      })
    }
  }, (0, _server.wrapRouteWithLicenseCheck)(_check_license.checkLicense, router.handleLegacyErrors(async (context, request, response) => {
    try {
      let username;

      if (security) {
        const user = await security.authc.getCurrentUser(request);
        username = user === null || user === void 0 ? void 0 : user.username;
      }

      const client = context.logstash.esClient;

      const pipeline = _pipeline.Pipeline.fromDownstreamJSON(request.body, request.params.id, username);

      await client.callAsCurrentUser('transport.request', {
        path: '/_logstash/pipeline/' + encodeURIComponent(pipeline.id),
        method: 'PUT',
        body: pipeline.upstreamJSON
      });
      return response.noContent();
    } catch (err) {
      const statusCode = err.statusCode; // handles the permissions issue of Elasticsearch

      if (statusCode === 403) {
        return response.forbidden({
          body: _i18n.i18n.translate('xpack.logstash.insufficientUserPermissionsDescription', {
            defaultMessage: 'Insufficient user permissions for managing Logstash pipelines'
          })
        });
      }

      throw err;
    }
  })));
}