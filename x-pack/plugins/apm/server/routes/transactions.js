"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transactionChartsErrorRateRoute = exports.transactionChartsBreakdownRoute = exports.transactionChartsDistributionRoute = exports.transactionThroughputChartsRoute = exports.transactionLatencyChartsRoute = exports.transactionGroupsComparisonStatisticsRoute = exports.transactionGroupsPrimaryStatisticsRoute = exports.transactionGroupsRoute = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _latency_aggregation_types = require("../../common/latency_aggregation_types");

var _json_rt = require("../../common/runtime_types/json_rt");

var _to_number_rt = require("../../common/runtime_types/to_number_rt");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");

var _setup_request = require("../lib/helpers/setup_request");

var _get_service_transaction_groups = require("../lib/services/get_service_transaction_groups");

var _get_service_transaction_group_comparison_statistics = require("../lib/services/get_service_transaction_group_comparison_statistics");

var _breakdown = require("../lib/transactions/breakdown");

var _distribution = require("../lib/transactions/distribution");

var _get_anomaly_data = require("../lib/transactions/get_anomaly_data");

var _get_latency_charts = require("../lib/transactions/get_latency_charts");

var _get_throughput_charts = require("../lib/transactions/get_throughput_charts");

var _transaction_groups = require("../lib/transaction_groups");

var _get_error_rate = require("../lib/transaction_groups/get_error_rate");

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns a list of transactions grouped by name
 * //TODO: delete this once we moved away from the old table in the transaction overview page. It should be replaced by /transactions/groups/primary_statistics/
 */


const transactionGroupsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transactions/groups',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt])
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
      serviceName
    } = context.params.path;
    const {
      environment,
      transactionType
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _transaction_groups.getTransactionGroupList)({
      environment,
      type: 'top_transactions',
      serviceName,
      transactionType,
      searchAggregatedTransactions
    }, setup);
  }
});
exports.transactionGroupsRoute = transactionGroupsRoute;
const transactionGroupsPrimaryStatisticsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transactions/groups/primary_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.uiFiltersRt, t.type({
      transactionType: t.string,
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt
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
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    const {
      path: {
        serviceName
      },
      query: {
        environment,
        latencyAggregationType,
        transactionType
      }
    } = context.params;
    return (0, _get_service_transaction_groups.getServiceTransactionGroups)({
      environment,
      setup,
      serviceName,
      searchAggregatedTransactions,
      transactionType,
      latencyAggregationType: latencyAggregationType
    });
  }
});
exports.transactionGroupsPrimaryStatisticsRoute = transactionGroupsPrimaryStatisticsRoute;
const transactionGroupsComparisonStatisticsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transactions/groups/comparison_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.uiFiltersRt, t.type({
      transactionNames: _json_rt.jsonRt,
      numBuckets: _to_number_rt.toNumberRt,
      transactionType: t.string,
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt
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
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    const {
      path: {
        serviceName
      },
      query: {
        environment,
        transactionNames,
        latencyAggregationType,
        numBuckets,
        transactionType
      }
    } = context.params;
    return (0, _get_service_transaction_group_comparison_statistics.getServiceTransactionGroupComparisonStatistics)({
      environment,
      setup,
      serviceName,
      transactionNames,
      searchAggregatedTransactions,
      transactionType,
      numBuckets,
      latencyAggregationType: latencyAggregationType
    });
  }
});
exports.transactionGroupsComparisonStatisticsRoute = transactionGroupsComparisonStatisticsRoute;
const transactionLatencyChartsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transactions/charts/latency',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.partial({
      transactionName: t.string
    }), t.type({
      transactionType: t.string,
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt
    }), _default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const logger = context.logger;
    const {
      serviceName
    } = context.params.path;
    const {
      environment,
      transactionType,
      transactionName,
      latencyAggregationType
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    const options = {
      environment,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions,
      logger
    };
    const [latencyData, anomalyTimeseries] = await Promise.all([(0, _get_latency_charts.getLatencyTimeseries)({ ...options,
      latencyAggregationType: latencyAggregationType
    }), (0, _get_anomaly_data.getAnomalySeries)(options).catch(error => {
      logger.warn(`Unable to retrieve anomalies for latency charts.`);
      logger.error(error);
      return undefined;
    })]);
    const {
      latencyTimeseries,
      overallAvgDuration
    } = latencyData;
    return {
      latencyTimeseries,
      overallAvgDuration,
      anomalyTimeseries
    };
  }
});
exports.transactionLatencyChartsRoute = transactionLatencyChartsRoute;
const transactionThroughputChartsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transactions/charts/throughput',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), t.partial({
      transactionName: t.string
    }), _default_api_types.uiFiltersRt, _default_api_types.rangeRt, _default_api_types.environmentRt])
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
      serviceName
    } = context.params.path;
    const {
      environment,
      transactionType,
      transactionName
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return await (0, _get_throughput_charts.getThroughputCharts)({
      environment,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions
    });
  }
});
exports.transactionThroughputChartsRoute = transactionThroughputChartsRoute;
const transactionChartsDistributionRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transactions/charts/distribution',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string,
      transactionName: t.string
    }), t.partial({
      transactionId: t.string,
      traceId: t.string
    }), _default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt])
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
      serviceName
    } = context.params.path;
    const {
      environment,
      transactionType,
      transactionName,
      transactionId = '',
      traceId = ''
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _distribution.getTransactionDistribution)({
      environment,
      serviceName,
      transactionType,
      transactionName,
      transactionId,
      traceId,
      setup,
      searchAggregatedTransactions
    });
  }
});
exports.transactionChartsDistributionRoute = transactionChartsDistributionRoute;
const transactionChartsBreakdownRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transaction/charts/breakdown',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), t.partial({
      transactionName: t.string
    }), _default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt])
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
      serviceName
    } = context.params.path;
    const {
      environment,
      transactionName,
      transactionType
    } = context.params.query;
    return (0, _breakdown.getTransactionBreakdown)({
      environment,
      serviceName,
      transactionName,
      transactionType,
      setup
    });
  }
});
exports.transactionChartsBreakdownRoute = transactionChartsBreakdownRoute;
const transactionChartsErrorRateRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/transactions/charts/error_rate',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.uiFiltersRt, _default_api_types.rangeRt, t.type({
      transactionType: t.string
    }), t.partial({
      transactionName: t.string
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
      params
    } = context;
    const {
      serviceName
    } = params.path;
    const {
      environment,
      transactionType,
      transactionName
    } = params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return (0, _get_error_rate.getErrorRate)({
      environment,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions
    });
  }
});
exports.transactionChartsErrorRateRoute = transactionChartsErrorRateRoute;