"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observabilityOverviewRoute = exports.observabilityOverviewHasDataRoute = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _setup_request = require("../lib/helpers/setup_request");

var _get_service_count = require("../lib/observability_overview/get_service_count");

var _get_transaction_coordinates = require("../lib/observability_overview/get_transaction_coordinates");

var _has_data = require("../lib/observability_overview/has_data");

var _create_route = require("./create_route");

var _default_api_types = require("./default_api_types");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");

var _with_apm_span = require("../utils/with_apm_span");

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const observabilityOverviewHasDataRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/observability_overview/has_data',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    return await (0, _has_data.hasData)({
      setup
    });
  }
});
exports.observabilityOverviewHasDataRoute = observabilityOverviewHasDataRoute;
const observabilityOverviewRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/observability_overview',
  params: t.type({
    query: t.intersection([_default_api_types.rangeRt, t.type({
      bucketSize: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      bucketSize
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _with_apm_span.withApmSpan)('observability_overview', async () => {
      const [serviceCount, transactionCoordinates] = await Promise.all([(0, _get_service_count.getServiceCount)({
        setup,
        searchAggregatedTransactions
      }), (0, _get_transaction_coordinates.getTransactionCoordinates)({
        setup,
        bucketSize,
        searchAggregatedTransactions
      })]);
      return {
        serviceCount,
        transactionCoordinates
      };
    });
  }
});
exports.observabilityOverviewRoute = observabilityOverviewRoute;