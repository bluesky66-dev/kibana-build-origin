"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initNodeDetailsRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _configSchema = require("@kbn/config-schema");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _usage_collector = require("../../usage/usage_collector");

var _node_details_api = require("../../../common/http_api/node_details_api");

var _runtime_types = require("../../../common/runtime_types");

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

const initNodeDetailsRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/metrics/node_details',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const {
        nodeId,
        cloudId,
        nodeType,
        metrics,
        timerange,
        sourceId
      } = (0, _pipeable.pipe)(_node_details_api.NodeDetailsRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const source = await libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);

      _usage_collector.UsageCollector.countNode(nodeType);

      const options = {
        nodeIds: {
          nodeId,
          cloudId
        },
        nodeType,
        sourceConfiguration: source.configuration,
        metrics,
        timerange
      };
      return response.ok({
        body: _node_details_api.NodeDetailsMetricDataResponseRT.encode({
          metrics: await libs.metrics.getMetrics(requestContext, options, request)
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initNodeDetailsRoute = initNodeDetailsRoute;