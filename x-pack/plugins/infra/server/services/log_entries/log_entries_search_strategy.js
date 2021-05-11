"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntriesSearchRequestStateRT = exports.logEntriesSearchStrategyProvider = void 0;

var _std = require("@kbn/std");

var rt = _interopRequireWildcard(require("io-ts"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _log_sources = require("../../../common/http_api/log_sources");

var _log_entry = require("../../../common/log_entry");

var _runtime_types = require("../../../common/runtime_types");

var _log_entries = require("../../../common/search_strategies/log_entries/log_entries");

var _typed_search_strategy = require("../../utils/typed_search_strategy");

var _message = require("./message");

var _log_entries2 = require("./queries/log_entries");

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


const logEntriesSearchStrategyProvider = ({
  data,
  sources
}) => {
  const esSearchStrategy = data.search.getSearchStrategy('ese');
  return {
    search: (rawRequest, options, dependencies) => (0, _rxjs.defer)(() => {
      const request = (0, _runtime_types.decodeOrThrow)(asyncRequestRT)(rawRequest);
      const sourceConfiguration$ = (0, _rxjs.defer)(() => sources.getSourceConfiguration(dependencies.savedObjectsClient, request.params.sourceId)).pipe((0, _operators.take)(1), (0, _operators.shareReplay)(1));
      const messageFormattingRules$ = (0, _rxjs.defer)(() => sourceConfiguration$.pipe((0, _operators.map)(({
        configuration
      }) => (0, _message.compileFormattingRules)((0, _message.getBuiltinRules)(configuration.fields.message))))).pipe((0, _operators.take)(1), (0, _operators.shareReplay)(1));
      const recoveredRequest$ = (0, _rxjs.of)(request).pipe((0, _operators.filter)(asyncRecoveredRequestRT.is), (0, _operators.map)(({
        id: {
          esRequestId
        }
      }) => ({
        id: esRequestId
      })));
      const initialRequest$ = (0, _rxjs.of)(request).pipe((0, _operators.filter)(asyncInitialRequestRT.is), (0, _operators.concatMap)(({
        params
      }) => (0, _rxjs.forkJoin)([sourceConfiguration$, messageFormattingRules$]).pipe((0, _operators.map)(([{
        configuration
      }, messageFormattingRules]) => {
        var _params$columns;

        return {
          params: (0, _log_entries2.createGetLogEntriesQuery)(configuration.logAlias, params.startTimestamp, params.endTimestamp, pickRequestCursor(params), params.size + 1, configuration.fields.timestamp, configuration.fields.tiebreaker, getRequiredFields((_params$columns = params.columns) !== null && _params$columns !== void 0 ? _params$columns : configuration.logColumns, messageFormattingRules), params.query, params.highlightPhrase)
        };
      }))));
      const searchResponse$ = (0, _rxjs.concat)(recoveredRequest$, initialRequest$).pipe((0, _operators.take)(1), (0, _operators.concatMap)(esRequest => esSearchStrategy.search(esRequest, options, dependencies)));
      return (0, _rxjs.combineLatest)([searchResponse$, sourceConfiguration$, messageFormattingRules$]).pipe((0, _operators.map)(([esResponse, {
        configuration
      }, messageFormattingRules]) => {
        var _request$params$colum, _rawResponse$_shards$;

        const rawResponse = (0, _runtime_types.decodeOrThrow)(_log_entries2.getLogEntriesResponseRT)(esResponse.rawResponse);
        const entries = rawResponse.hits.hits.slice(0, request.params.size).map(getLogEntryFromHit((_request$params$colum = request.params.columns) !== null && _request$params$colum !== void 0 ? _request$params$colum : configuration.logColumns, messageFormattingRules));
        const sortDirection = (0, _log_entries2.getSortDirection)(pickRequestCursor(request.params));

        if (sortDirection === 'desc') {
          entries.reverse();
        }

        const hasMore = rawResponse.hits.hits.length > entries.length;
        const hasMoreBefore = sortDirection === 'desc' ? hasMore : undefined;
        const hasMoreAfter = sortDirection === 'asc' ? hasMore : undefined;
        const {
          topCursor,
          bottomCursor
        } = getResponseCursors(entries);
        const errors = ((_rawResponse$_shards$ = rawResponse._shards.failures) !== null && _rawResponse$_shards$ !== void 0 ? _rawResponse$_shards$ : []).map(_typed_search_strategy.createErrorFromShardFailure);
        return { ...esResponse,
          ...(esResponse.id ? {
            id: logEntriesSearchRequestStateRT.encode({
              esRequestId: esResponse.id
            })
          } : {}),
          rawResponse: _log_entries.logEntriesSearchResponsePayloadRT.encode({
            data: {
              entries,
              topCursor,
              bottomCursor,
              hasMoreBefore,
              hasMoreAfter
            },
            errors
          })
        };
      }));
    }),
    cancel: async (id, options, dependencies) => {
      var _esSearchStrategy$can;

      const {
        esRequestId
      } = (0, _runtime_types.decodeOrThrow)(logEntriesSearchRequestStateRT)(id);
      return await ((_esSearchStrategy$can = esSearchStrategy.cancel) === null || _esSearchStrategy$can === void 0 ? void 0 : _esSearchStrategy$can.call(esSearchStrategy, esRequestId, options, dependencies));
    }
  };
}; // exported for tests


exports.logEntriesSearchStrategyProvider = logEntriesSearchStrategyProvider;
const logEntriesSearchRequestStateRT = rt.string.pipe(_typed_search_strategy.jsonFromBase64StringRT).pipe(rt.type({
  esRequestId: rt.string
}));
exports.logEntriesSearchRequestStateRT = logEntriesSearchRequestStateRT;
const {
  asyncInitialRequestRT,
  asyncRecoveredRequestRT,
  asyncRequestRT
} = (0, _typed_search_strategy.createAsyncRequestRTs)(logEntriesSearchRequestStateRT, _log_entries.logEntriesSearchRequestParamsRT);

const getLogEntryFromHit = (columnDefinitions, messageFormattingRules) => hit => {
  const cursor = (0, _log_entry.getLogEntryCursorFromHit)(hit);
  return {
    id: hit._id,
    index: hit._index,
    cursor,
    columns: columnDefinitions.map(column => {
      if ('timestampColumn' in column) {
        return {
          columnId: column.timestampColumn.id,
          timestamp: cursor.time
        };
      } else if ('messageColumn' in column) {
        var _hit$fields;

        return {
          columnId: column.messageColumn.id,
          message: messageFormattingRules.format((_hit$fields = hit.fields) !== null && _hit$fields !== void 0 ? _hit$fields : {}, hit.highlight || {})
        };
      } else {
        var _hit$fields$column$fi, _hit$fields2, _hit$highlight$column, _hit$highlight;

        return {
          columnId: column.fieldColumn.id,
          field: column.fieldColumn.field,
          value: (_hit$fields$column$fi = (_hit$fields2 = hit.fields) === null || _hit$fields2 === void 0 ? void 0 : _hit$fields2[column.fieldColumn.field]) !== null && _hit$fields$column$fi !== void 0 ? _hit$fields$column$fi : [],
          highlights: (_hit$highlight$column = (_hit$highlight = hit.highlight) === null || _hit$highlight === void 0 ? void 0 : _hit$highlight[column.fieldColumn.field]) !== null && _hit$highlight$column !== void 0 ? _hit$highlight$column : []
        };
      }
    }),
    context: getContextFromHit(hit)
  };
};

const pickRequestCursor = params => {
  if (_log_entry.logEntryAfterCursorRT.is(params)) {
    return (0, _std.pick)(params, ['after']);
  } else if (_log_entry.logEntryBeforeCursorRT.is(params)) {
    return (0, _std.pick)(params, ['before']);
  }

  return null;
};

const getContextFromHit = hit => {
  var _hit$fields3, _hit$fields3$containe, _hit$fields4, _hit$fields4$hostNam, _hit$fields5, _hit$fields5$logFile; // Get all context fields, then test for the presence and type of the ones that go together


  const containerId = (_hit$fields3 = hit.fields) === null || _hit$fields3 === void 0 ? void 0 : (_hit$fields3$containe = _hit$fields3['container.id']) === null || _hit$fields3$containe === void 0 ? void 0 : _hit$fields3$containe[0];
  const hostName = (_hit$fields4 = hit.fields) === null || _hit$fields4 === void 0 ? void 0 : (_hit$fields4$hostNam = _hit$fields4['host.name']) === null || _hit$fields4$hostNam === void 0 ? void 0 : _hit$fields4$hostNam[0];
  const logFilePath = (_hit$fields5 = hit.fields) === null || _hit$fields5 === void 0 ? void 0 : (_hit$fields5$logFile = _hit$fields5['log.file.path']) === null || _hit$fields5$logFile === void 0 ? void 0 : _hit$fields5$logFile[0];

  if (typeof containerId === 'string') {
    return {
      'container.id': containerId
    };
  }

  if (typeof hostName === 'string' && typeof logFilePath === 'string') {
    return {
      'host.name': hostName,
      'log.file.path': logFilePath
    };
  }

  return {};
};

function getResponseCursors(entries) {
  const hasEntries = entries.length > 0;
  const topCursor = hasEntries ? entries[0].cursor : null;
  const bottomCursor = hasEntries ? entries[entries.length - 1].cursor : null;
  return {
    topCursor,
    bottomCursor
  };
}

const VIEW_IN_CONTEXT_FIELDS = ['log.file.path', 'host.name', 'container.id'];

const getRequiredFields = (columns, messageFormattingRules) => {
  const fieldsFromColumns = columns.reduce((accumulatedFields, logColumn) => {
    if (_log_sources.logSourceFieldColumnConfigurationRT.is(logColumn)) {
      return [...accumulatedFields, logColumn.fieldColumn.field];
    }

    return accumulatedFields;
  }, []);
  const fieldsFromFormattingRules = messageFormattingRules.requiredFields;
  return Array.from(new Set([...fieldsFromColumns, ...fieldsFromFormattingRules, ...VIEW_IN_CONTEXT_FIELDS]));
};