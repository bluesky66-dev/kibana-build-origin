"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetCertsRoute = exports.DEFAULT_TO = exports.DEFAULT_FROM = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_FROM = 'now-5m';
exports.DEFAULT_FROM = DEFAULT_FROM;
const DEFAULT_TO = 'now';
exports.DEFAULT_TO = DEFAULT_TO;
const DEFAULT_SIZE = 25;
const DEFAULT_SORT = 'not_after';
const DEFAULT_DIRECTION = 'asc';

const createGetCertsRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.CERTS,
  validate: {
    query: _configSchema.schema.object({
      from: _configSchema.schema.maybe(_configSchema.schema.string()),
      to: _configSchema.schema.maybe(_configSchema.schema.string()),
      search: _configSchema.schema.maybe(_configSchema.schema.string()),
      index: _configSchema.schema.maybe(_configSchema.schema.number()),
      size: _configSchema.schema.maybe(_configSchema.schema.number()),
      sortBy: _configSchema.schema.maybe(_configSchema.schema.string()),
      direction: _configSchema.schema.maybe(_configSchema.schema.string())
    })
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    var _request$query$index, _request$query, _request$query$size, _request$query2, _request$query$from, _request$query3, _request$query$to, _request$query4, _request$query$sortBy, _request$query5, _request$query$direct, _request$query6;

    const index = (_request$query$index = (_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.index) !== null && _request$query$index !== void 0 ? _request$query$index : 0;
    const size = (_request$query$size = (_request$query2 = request.query) === null || _request$query2 === void 0 ? void 0 : _request$query2.size) !== null && _request$query$size !== void 0 ? _request$query$size : DEFAULT_SIZE;
    const from = (_request$query$from = (_request$query3 = request.query) === null || _request$query3 === void 0 ? void 0 : _request$query3.from) !== null && _request$query$from !== void 0 ? _request$query$from : DEFAULT_FROM;
    const to = (_request$query$to = (_request$query4 = request.query) === null || _request$query4 === void 0 ? void 0 : _request$query4.to) !== null && _request$query$to !== void 0 ? _request$query$to : DEFAULT_TO;
    const sortBy = (_request$query$sortBy = (_request$query5 = request.query) === null || _request$query5 === void 0 ? void 0 : _request$query5.sortBy) !== null && _request$query$sortBy !== void 0 ? _request$query$sortBy : DEFAULT_SORT;
    const direction = (_request$query$direct = (_request$query6 = request.query) === null || _request$query6 === void 0 ? void 0 : _request$query6.direction) !== null && _request$query$direct !== void 0 ? _request$query$direct : DEFAULT_DIRECTION;
    const {
      search
    } = request.query;
    return await libs.requests.getCerts({
      uptimeEsClient,
      index,
      search,
      size,
      from,
      to,
      sortBy,
      direction
    });
  }
});

exports.createGetCertsRoute = createGetCertsRoute;