"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _uuid = _interopRequireDefault(require("uuid"));

var _configSchema = require("@kbn/config-schema");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoutes(router) {
  router.post({
    path: '/api/osquery/queries',
    validate: {
      params: _configSchema.schema.object({}, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    }
  }, async (context, request, response) => {
    const esClient = context.core.elasticsearch.client.asInternalUser;
    const query = await esClient.index({
      index: '.fleet-actions-new',
      body: {
        action_id: _uuid.default.v4(),
        '@timestamp': (0, _moment.default)().toISOString(),
        expiration: (0, _moment.default)().add(2, 'days').toISOString(),
        type: 'APP_ACTION',
        input_id: 'osquery',
        // @ts-expect-error
        agents: request.body.agents,
        data: {
          commands: [{
            id: _uuid.default.v4(),
            // @ts-expect-error
            query: request.body.command.query
          }]
        }
      }
    });
    return response.ok({
      body: query
    });
  });
}