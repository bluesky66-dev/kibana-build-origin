"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLogEntriesHighlightsRoute = void 0;

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

const initLogEntriesHighlightsRoute = ({
  framework,
  logEntries
}) => {
  framework.registerRoute({
    method: 'post',
    path: _log_entries.LOG_ENTRIES_HIGHLIGHTS_PATH,
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const payload = (0, _pipeable.pipe)(_log_entries.logEntriesHighlightsRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const {
        startTimestamp,
        endTimestamp,
        sourceId,
        query,
        size,
        highlightTerms
      } = payload;
      let entriesPerHighlightTerm;

      if ('center' in payload) {
        entriesPerHighlightTerm = await Promise.all(highlightTerms.map(highlightTerm => logEntries.getLogEntriesAround(requestContext, sourceId, {
          startTimestamp,
          endTimestamp,
          query: (0, _serialized_query.parseFilterQuery)(query),
          center: payload.center,
          size,
          highlightTerm
        })));
      } else {
        let cursor;

        if ('before' in payload) {
          cursor = {
            before: payload.before
          };
        } else if ('after' in payload) {
          cursor = {
            after: payload.after
          };
        }

        entriesPerHighlightTerm = await Promise.all(highlightTerms.map(highlightTerm => logEntries.getLogEntries(requestContext, sourceId, {
          startTimestamp,
          endTimestamp,
          query: (0, _serialized_query.parseFilterQuery)(query),
          cursor,
          size,
          highlightTerm
        })));
      }

      return response.ok({
        body: _log_entries.logEntriesHighlightsResponseRT.encode({
          data: entriesPerHighlightTerm.map(({
            entries
          }) => {
            if (entries.length > 0) {
              return {
                entries,
                topCursor: entries[0].cursor,
                bottomCursor: entries[entries.length - 1].cursor
              };
            } else {
              return {
                entries,
                topCursor: null,
                bottomCursor: null
              };
            }
          })
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initLogEntriesHighlightsRoute = initLogEntriesHighlightsRoute;