"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMetricsAPIRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _configSchema = require("@kbn/config-schema");

var _runtime_types = require("../../../common/runtime_types");

var _create_search_client = require("../../lib/create_search_client");

var _metrics = require("../../lib/metrics");

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

const initMetricsAPIRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/infra/metrics_api',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const options = (0, _pipeable.pipe)(_http_api.MetricsAPIRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
      const metricsApiResponse = await (0, _metrics.query)(client, options);
      return response.ok({
        body: _http_api.MetricsAPIResponseRT.encode(metricsApiResponse)
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initMetricsAPIRoute = initMetricsAPIRoute;