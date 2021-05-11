"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initOverviewRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _configSchema = require("@kbn/config-schema");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _inventory_models = require("../../../common/inventory_models");

var _runtime_types = require("../../../common/runtime_types");

var _overview_api = require("../../../common/http_api/overview_api");

var _create_search_client = require("../../lib/create_search_client");

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

const initOverviewRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/metrics/overview',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      var _esResponse$aggregati, _esResponse$aggregati2, _esResponse$aggregati3, _esResponse$aggregati4, _esResponse$aggregati5, _esResponse$aggregati6;

      const overviewRequest = (0, _pipeable.pipe)(_overview_api.OverviewRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
      const source = await libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, overviewRequest.sourceId);
      const inventoryModelFields = (0, _inventory_models.findInventoryFields)('host', source.configuration.fields);
      const params = {
        index: source.configuration.metricAlias,
        body: {
          query: {
            range: {
              [source.configuration.fields.timestamp]: {
                gte: overviewRequest.timerange.from,
                lte: overviewRequest.timerange.to,
                format: 'epoch_millis'
              }
            }
          },
          aggs: {
            hosts: {
              cardinality: {
                field: inventoryModelFields.id
              }
            },
            cpu: {
              avg: {
                field: 'system.cpu.total.norm.pct'
              }
            },
            memory: {
              avg: {
                field: 'system.memory.actual.used.pct'
              }
            }
          }
        }
      };
      const esResponse = await client(params);
      return response.ok({
        body: {
          stats: {
            hosts: {
              type: 'number',
              value: (_esResponse$aggregati = (_esResponse$aggregati2 = esResponse.aggregations) === null || _esResponse$aggregati2 === void 0 ? void 0 : _esResponse$aggregati2.hosts.value) !== null && _esResponse$aggregati !== void 0 ? _esResponse$aggregati : 0
            },
            cpu: {
              type: 'percent',
              value: (_esResponse$aggregati3 = (_esResponse$aggregati4 = esResponse.aggregations) === null || _esResponse$aggregati4 === void 0 ? void 0 : _esResponse$aggregati4.cpu.value) !== null && _esResponse$aggregati3 !== void 0 ? _esResponse$aggregati3 : 0
            },
            memory: {
              type: 'percent',
              value: (_esResponse$aggregati5 = (_esResponse$aggregati6 = esResponse.aggregations) === null || _esResponse$aggregati6 === void 0 ? void 0 : _esResponse$aggregati6.memory.value) !== null && _esResponse$aggregati5 !== void 0 ? _esResponse$aggregati5 : 0
            }
          }
        }
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initOverviewRoute = initOverviewRoute;