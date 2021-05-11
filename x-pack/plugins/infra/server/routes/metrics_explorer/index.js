"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMetricExplorerRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _configSchema = require("@kbn/config-schema");

var _http_api = require("../../../common/http_api");

var _runtime_types = require("../../../common/runtime_types");

var _convert_request_to_metrics_api_options = require("./lib/convert_request_to_metrics_api_options");

var _create_search_client = require("../../lib/create_search_client");

var _find_interval_for_metrics = require("./lib/find_interval_for_metrics");

var _metrics = require("../../lib/metrics");

var _query_total_groupings = require("./lib/query_total_groupings");

var _transform_series = require("./lib/transform_series");

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

const initMetricExplorerRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/infra/metrics_explorer',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const options = (0, _pipeable.pipe)(_http_api.metricsExplorerRequestBodyRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
      const interval = await (0, _find_interval_for_metrics.findIntervalForMetrics)(client, options);
      const optionsWithInterval = options.forceInterval ? options : { ...options,
        timerange: { ...options.timerange,
          interval: interval ? `>=${interval}s` : options.timerange.interval
        }
      };
      const metricsApiOptions = (0, _convert_request_to_metrics_api_options.convertRequestToMetricsAPIOptions)(optionsWithInterval);
      const metricsApiResponse = await (0, _metrics.query)(client, metricsApiOptions);
      const totalGroupings = await (0, _query_total_groupings.queryTotalGroupings)(client, metricsApiOptions);
      const hasGroupBy = Array.isArray(metricsApiOptions.groupBy) && metricsApiOptions.groupBy.length > 0;
      const pageInfo = {
        total: totalGroupings,
        afterKey: null
      };

      if (metricsApiResponse.info.afterKey) {
        pageInfo.afterKey = metricsApiResponse.info.afterKey;
      } // If we have a groupBy but there are ZERO groupings returned then we need to
      // return an empty array. Otherwise we transform the series to match the current schema.


      const series = hasGroupBy && totalGroupings === 0 ? [] : metricsApiResponse.series.map((0, _transform_series.transformSeries)(hasGroupBy));
      return response.ok({
        body: _http_api.metricsExplorerResponseRT.encode({
          series,
          pageInfo
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initMetricExplorerRoute = initMetricExplorerRoute;