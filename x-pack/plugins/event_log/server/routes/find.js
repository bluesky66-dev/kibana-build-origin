"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");

var _event_log_client = require("../event_log_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramSchema = _configSchema.schema.object({
  type: _configSchema.schema.string(),
  id: _configSchema.schema.string()
});

const findRoute = (router, systemLogger) => {
  router.get({
    path: `${_common.BASE_EVENT_LOG_API_PATH}/{type}/{id}/_find`,
    validate: {
      params: paramSchema,
      query: _event_log_client.findOptionsSchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    if (!context.eventLog) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for eventLog'
      });
    }

    const eventLogClient = context.eventLog.getEventLogClient();
    const {
      params: {
        id,
        type
      },
      query
    } = req;

    try {
      return res.ok({
        body: await eventLogClient.findEventsBySavedObjectIds(type, [id], query)
      });
    } catch (err) {
      const call = `findEventsBySavedObjectIds(${type}, [${id}], ${JSON.stringify(query)})`;
      systemLogger.debug(`error calling eventLog ${call}: ${err.message}`);
      return res.notFound();
    }
  }));
};

exports.findRoute = findRoute;