"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitorListRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createMonitorListRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.MONITOR_LIST,
  validate: {
    query: _configSchema.schema.object({
      dateRangeStart: _configSchema.schema.string(),
      dateRangeEnd: _configSchema.schema.string(),
      filters: _configSchema.schema.maybe(_configSchema.schema.string()),
      pagination: _configSchema.schema.maybe(_configSchema.schema.string()),
      statusFilter: _configSchema.schema.maybe(_configSchema.schema.string()),
      pageSize: _configSchema.schema.number(),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  options: {
    tags: ['access:uptime-read']
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    const {
      dateRangeStart,
      dateRangeEnd,
      filters,
      pagination,
      statusFilter,
      pageSize
    } = request.query;
    const decodedPagination = pagination ? JSON.parse(decodeURIComponent(pagination)) : _constants.CONTEXT_DEFAULTS.CURSOR_PAGINATION;
    const result = await libs.requests.getMonitorStates({
      uptimeEsClient,
      dateRangeStart,
      dateRangeEnd,
      pagination: decodedPagination,
      pageSize,
      filters,
      // this is added to make typescript happy,
      // this sort of reassignment used to be further downstream but I've moved it here
      // because this code is going to be decomissioned soon
      statusFilter: statusFilter || undefined
    });
    return result;
  }
});

exports.createMonitorListRoute = createMonitorListRoute;