"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetStatusBarRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetStatusBarRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.MONITOR_STATUS,
  validate: {
    query: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      dateStart: _configSchema.schema.string(),
      dateEnd: _configSchema.schema.string(),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    const {
      monitorId,
      dateStart,
      dateEnd
    } = request.query;
    return await libs.requests.getLatestMonitor({
      uptimeEsClient,
      monitorId,
      dateStart,
      dateEnd
    });
  }
});

exports.createGetStatusBarRoute = createGetStatusBarRoute;