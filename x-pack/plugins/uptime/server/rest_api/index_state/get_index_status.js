"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetIndexStatusRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetIndexStatusRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.INDEX_STATUS,
  validate: {
    query: _configSchema.schema.object({
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    uptimeEsClient
  }) => {
    return await libs.requests.getIndexStatus({
      uptimeEsClient
    });
  }
});

exports.createGetIndexStatusRoute = createGetIndexStatusRoute;