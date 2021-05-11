"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLogEntriesSummaryHighlightsRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _configSchema = require("@kbn/config-schema");

var _runtime_types = require("../../../common/runtime_types");

var _log_entries = require("../../../common/http_api/log_entries");

var _serialized_query = require("../../utils/serialized_query");

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

const initLogEntriesSummaryHighlightsRoute = ({
  framework,
  logEntries
}) => {
  framework.registerRoute({
    method: 'post',
    path: _log_entries.LOG_ENTRIES_SUMMARY_HIGHLIGHTS_PATH,
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const payload = (0, _pipeable.pipe)(_log_entries.logEntriesSummaryHighlightsRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const {
        sourceId,
        startTimestamp,
        endTimestamp,
        bucketSize,
        query,
        highlightTerms
      } = payload;
      const bucketsPerHighlightTerm = await logEntries.getLogSummaryHighlightBucketsBetween(requestContext, sourceId, startTimestamp, endTimestamp, bucketSize, highlightTerms, (0, _serialized_query.parseFilterQuery)(query));
      return response.ok({
        body: _log_entries.logEntriesSummaryHighlightsResponseRT.encode({
          data: bucketsPerHighlightTerm.map(buckets => ({
            start: startTimestamp,
            end: endTimestamp,
            buckets
          }))
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initLogEntriesSummaryHighlightsRoute = initLogEntriesSummaryHighlightsRoute;