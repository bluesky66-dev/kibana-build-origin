"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLogEntriesSummaryRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _configSchema = require("@kbn/config-schema");

var _runtime_types = require("../../../common/runtime_types");

var _log_entries = require("../../../common/http_api/log_entries");

var _serialized_query = require("../../utils/serialized_query");

var _usage_collector = require("../../usage/usage_collector");

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

const initLogEntriesSummaryRoute = ({
  framework,
  logEntries
}) => {
  framework.registerRoute({
    method: 'post',
    path: _log_entries.LOG_ENTRIES_SUMMARY_PATH,
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const payload = (0, _pipeable.pipe)(_log_entries.logEntriesSummaryRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const {
        sourceId,
        startTimestamp,
        endTimestamp,
        bucketSize,
        query
      } = payload;
      const buckets = await logEntries.getLogSummaryBucketsBetween(requestContext, sourceId, startTimestamp, endTimestamp, bucketSize, (0, _serialized_query.parseFilterQuery)(query));

      _usage_collector.UsageCollector.countLogs();

      return response.ok({
        body: _log_entries.logEntriesSummaryResponseRT.encode({
          data: {
            start: startTimestamp,
            end: endTimestamp,
            buckets
          }
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initLogEntriesSummaryRoute = initLogEntriesSummaryRoute;