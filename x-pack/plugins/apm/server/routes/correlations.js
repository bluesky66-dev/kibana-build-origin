"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correlationsForFailedTransactionsRoute = exports.correlationsForSlowTransactionsRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var t = _interopRequireWildcard(require("io-ts"));

var _license_check = require("../../common/license_check");

var _get_correlations_for_failed_transactions = require("../lib/correlations/get_correlations_for_failed_transactions");

var _get_correlations_for_slow_transactions = require("../lib/correlations/get_correlations_for_slow_transactions");

var _setup_request = require("../lib/helpers/setup_request");

var _create_route = require("./create_route");

var _default_api_types = require("./default_api_types");

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


const INVALID_LICENSE = _i18n.i18n.translate('xpack.apm.significanTerms.license.text', {
  defaultMessage: 'To use the correlations API, you must be subscribed to an Elastic Platinum license.'
});

const correlationsForSlowTransactionsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/correlations/slow_transactions',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), t.type({
      durationPercentile: t.string,
      fieldNames: t.string
    }), t.partial({
      uiFilters: t.string
    }), _default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      environment,
      serviceName,
      transactionType,
      transactionName,
      durationPercentile,
      fieldNames
    } = context.params.query;
    return (0, _get_correlations_for_slow_transactions.getCorrelationsForSlowTransactions)({
      environment,
      serviceName,
      transactionType,
      transactionName,
      durationPercentile: parseInt(durationPercentile, 10),
      fieldNames: fieldNames.split(','),
      setup
    });
  }
});
exports.correlationsForSlowTransactionsRoute = correlationsForSlowTransactionsRoute;
const correlationsForFailedTransactionsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/correlations/failed_transactions',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), t.type({
      fieldNames: t.string
    }), t.partial({
      uiFilters: t.string
    }), _default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      environment,
      serviceName,
      transactionType,
      transactionName,
      fieldNames
    } = context.params.query;
    return (0, _get_correlations_for_failed_transactions.getCorrelationsForFailedTransactions)({
      environment,
      serviceName,
      transactionType,
      transactionName,
      fieldNames: fieldNames.split(','),
      setup
    });
  }
});
exports.correlationsForFailedTransactionsRoute = correlationsForFailedTransactionsRoute;