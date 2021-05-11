"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceMapServiceNodeRoute = exports.serviceMapRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var t = _interopRequireWildcard(require("io-ts"));

var _service_map = require("../../common/service_map");

var _setup_request = require("../lib/helpers/setup_request");

var _get_service_map = require("../lib/service_map/get_service_map");

var _get_service_map_service_node_info = require("../lib/service_map/get_service_map_service_node_info");

var _create_route = require("./create_route");

var _default_api_types = require("./default_api_types");

var _feature = require("../feature");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");

var _license_check = require("../../common/license_check");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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


const serviceMapRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/service-map',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string
    }), _default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    if (!context.config['xpack.apm.serviceMapEnabled']) {
      throw _boom.default.notFound();
    }

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }

    (0, _feature.notifyFeatureUsage)({
      licensingPlugin: context.licensing,
      featureName: 'serviceMaps'
    });
    const logger = context.logger;
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query: {
        serviceName,
        environment
      }
    } = context.params;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _get_service_map.getServiceMap)({
      setup,
      serviceName,
      environment,
      searchAggregatedTransactions,
      logger
    });
  }
});
exports.serviceMapRoute = serviceMapRoute;
const serviceMapServiceNodeRoute = (0, _create_route.createRoute)({
  endpoint: `GET /api/apm/service-map/service/{serviceName}`,
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    if (!context.config['xpack.apm.serviceMapEnabled']) {
      throw _boom.default.notFound();
    }

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }

    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      path: {
        serviceName
      },
      query: {
        environment
      }
    } = context.params;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _get_service_map_service_node_info.getServiceMapServiceNodeInfo)({
      environment,
      setup,
      serviceName,
      searchAggregatedTransactions
    });
  }
});
exports.serviceMapServiceNodeRoute = serviceMapServiceNodeRoute;