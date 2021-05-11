"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootTransactionByTraceIdRoute = exports.tracesByIdRoute = exports.tracesRoute = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _setup_request = require("../lib/helpers/setup_request");

var _get_trace = require("../lib/traces/get_trace");

var _transaction_groups = require("../lib/transaction_groups");

var _create_route = require("./create_route");

var _default_api_types = require("./default_api_types");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");

var _get_transaction_by_trace = require("../lib/transactions/get_transaction_by_trace");

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


const tracesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/traces',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.uiFiltersRt])
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
      environment
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _transaction_groups.getTransactionGroupList)({
      environment,
      type: 'top_traces',
      searchAggregatedTransactions
    }, setup);
  }
});
exports.tracesRoute = tracesRoute;
const tracesByIdRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/traces/{traceId}',
  params: t.type({
    path: t.type({
      traceId: t.string
    }),
    query: _default_api_types.rangeRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    return (0, _get_trace.getTrace)(context.params.path.traceId, setup);
  }
});
exports.tracesByIdRoute = tracesByIdRoute;
const rootTransactionByTraceIdRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/traces/{traceId}/root_transaction',
  params: t.type({
    path: t.type({
      traceId: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const {
      traceId
    } = context.params.path;
    const setup = await (0, _setup_request.setupRequest)(context, request);
    return (0, _get_transaction_by_trace.getRootTransactionByTraceId)(traceId, setup);
  }
});
exports.rootTransactionByTraceIdRoute = rootTransactionByTraceIdRoute;