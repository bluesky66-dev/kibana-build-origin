"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initProcessListRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _configSchema = require("@kbn/config-schema");

var _runtime_types = require("../../../common/runtime_types");

var _create_search_client = require("../../lib/create_search_client");

var _process_list = require("../../lib/host_details/process_list");

var _process_list_chart = require("../../lib/host_details/process_list_chart");

var _http_api = require("../../../common/http_api");

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


const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

const initProcessListRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/metrics/process_list',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const options = (0, _pipeable.pipe)(_http_api.ProcessListAPIRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
      const processListResponse = await (0, _process_list.getProcessList)(client, options);
      return response.ok({
        body: _http_api.ProcessListAPIResponseRT.encode(processListResponse)
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
  framework.registerRoute({
    method: 'post',
    path: '/api/metrics/process_list/chart',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const options = (0, _pipeable.pipe)(_http_api.ProcessListAPIChartRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
      const processListResponse = await (0, _process_list_chart.getProcessListChart)(client, options);
      return response.ok({
        body: _http_api.ProcessListAPIChartResponseRT.encode(processListResponse)
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initProcessListRoute = initProcessListRoute;