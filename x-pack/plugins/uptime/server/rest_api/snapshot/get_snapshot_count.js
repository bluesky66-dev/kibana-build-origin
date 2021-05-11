"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetSnapshotCount = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetSnapshotCount = libs => ({
  method: 'GET',
  path: _constants.API_URLS.SNAPSHOT_COUNT,
  validate: {
    query: _configSchema.schema.object({
      dateRangeStart: _configSchema.schema.string(),
      dateRangeEnd: _configSchema.schema.string(),
      filters: _configSchema.schema.maybe(_configSchema.schema.string()),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    const {
      dateRangeStart,
      dateRangeEnd,
      filters
    } = request.query;
    return await libs.requests.getSnapshotCount({
      uptimeEsClient,
      dateRangeStart,
      dateRangeEnd,
      filters
    });
  }
});

exports.createGetSnapshotCount = createGetSnapshotCount;