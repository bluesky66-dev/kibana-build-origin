"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transactionDurationChartPreview = exports.transactionErrorCountChartPreview = exports.transactionErrorRateChartPreview = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _get_transaction_duration = require("../../lib/alerts/chart_preview/get_transaction_duration");

var _get_transaction_error_count = require("../../lib/alerts/chart_preview/get_transaction_error_count");

var _get_transaction_error_rate = require("../../lib/alerts/chart_preview/get_transaction_error_rate");

var _setup_request = require("../../lib/helpers/setup_request");

var _create_route = require("../create_route");

var _default_api_types = require("../default_api_types");

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


const alertParamsRt = t.intersection([t.partial({
  aggregationType: t.union([t.literal('avg'), t.literal('95th'), t.literal('99th')]),
  serviceName: t.string,
  environment: t.string,
  transactionType: t.string
}), _default_api_types.rangeRt]);
const transactionErrorRateChartPreview = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/alerts/chart_preview/transaction_error_rate',
  params: t.type({
    query: alertParamsRt
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
      _debug,
      ...alertParams
    } = context.params.query;
    return (0, _get_transaction_error_rate.getTransactionErrorRateChartPreview)({
      setup,
      alertParams
    });
  }
});
exports.transactionErrorRateChartPreview = transactionErrorRateChartPreview;
const transactionErrorCountChartPreview = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/alerts/chart_preview/transaction_error_count',
  params: t.type({
    query: alertParamsRt
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
      _debug,
      ...alertParams
    } = context.params.query;
    return (0, _get_transaction_error_count.getTransactionErrorCountChartPreview)({
      setup,
      alertParams
    });
  }
});
exports.transactionErrorCountChartPreview = transactionErrorCountChartPreview;
const transactionDurationChartPreview = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/alerts/chart_preview/transaction_duration',
  params: t.type({
    query: alertParamsRt
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
      _debug,
      ...alertParams
    } = context.params.query;
    return (0, _get_transaction_duration.getTransactionDurationChartPreview)({
      alertParams,
      setup
    });
  }
});
exports.transactionDurationChartPreview = transactionDurationChartPreview;