"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLensUsageRoute = initLensUsageRoute;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _elasticsearch = require("@elastic/elasticsearch");

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../../src/core/server");

var _common = require("../../common");

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
// This route is responsible for taking a batch of click events from the browser
// and writing them to saved objects


async function initLensUsageRoute(setup) {
  const router = setup.http.createRouter();
  router.post({
    path: `${_common.BASE_API_URL}/stats`,
    validate: {
      body: _configSchema.schema.object({
        events: _configSchema.schema.mapOf(_configSchema.schema.string(), _configSchema.schema.mapOf(_configSchema.schema.string(), _configSchema.schema.number())),
        suggestionEvents: _configSchema.schema.mapOf(_configSchema.schema.string(), _configSchema.schema.mapOf(_configSchema.schema.string(), _configSchema.schema.number()))
      })
    }
  }, async (context, req, res) => {
    const {
      events,
      suggestionEvents
    } = req.body;

    try {
      const client = context.core.savedObjects.client;
      const allEvents = [];
      events.forEach((subMap, date) => {
        subMap.forEach((count, key) => {
          allEvents.push({
            type: 'lens-ui-telemetry',
            attributes: {
              name: key,
              date,
              count,
              type: 'regular'
            }
          });
        });
      });
      suggestionEvents.forEach((subMap, date) => {
        subMap.forEach((count, key) => {
          allEvents.push({
            type: 'lens-ui-telemetry',
            attributes: {
              name: key,
              date,
              count,
              type: 'suggestion'
            }
          });
        });
      });

      if (allEvents.length) {
        await client.bulkCreate(allEvents);
      }

      return res.ok({
        body: {}
      });
    } catch (e) {
      if (_server.SavedObjectsErrorHelpers.isForbiddenError(e)) {
        return res.forbidden();
      }

      if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 404) {
        return res.notFound();
      }

      if (e.isBoom) {
        if (e.output.statusCode === 404) {
          return res.notFound();
        }

        return res.internalError(e.output.message);
      } else {
        return res.internalError({
          body: _boom.default.internal(e.message || e.name)
        });
      }
    }
  });
}