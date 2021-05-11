"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntrySearchRequestStateRT = exports.logEntrySearchStrategyProvider = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _log_entry = require("../../../common/log_entry");

var _runtime_types = require("../../../common/runtime_types");

var _log_entry2 = require("../../../common/search_strategies/log_entries/log_entry");

var _typed_search_strategy = require("../../utils/typed_search_strategy");

var _log_entry3 = require("./queries/log_entry");

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


const logEntrySearchStrategyProvider = ({
  data,
  sources
}) => {
  const esSearchStrategy = data.search.getSearchStrategy('ese');
  return {
    search: (rawRequest, options, dependencies) => (0, _rxjs.defer)(() => {
      const request = (0, _runtime_types.decodeOrThrow)(asyncRequestRT)(rawRequest);
      const sourceConfiguration$ = (0, _rxjs.defer)(() => sources.getSourceConfiguration(dependencies.savedObjectsClient, request.params.sourceId)).pipe((0, _operators.shareReplay)(1));
      const recoveredRequest$ = (0, _rxjs.of)(request).pipe((0, _operators.filter)(asyncRecoveredRequestRT.is), (0, _operators.map)(({
        id: {
          esRequestId
        }
      }) => ({
        id: esRequestId
      })));
      const initialRequest$ = (0, _rxjs.of)(request).pipe((0, _operators.filter)(asyncInitialRequestRT.is), (0, _operators.concatMap)(({
        params
      }) => sourceConfiguration$.pipe((0, _operators.map)(({
        configuration
      }) => ({
        params: (0, _log_entry3.createGetLogEntryQuery)(configuration.logAlias, params.logEntryId, configuration.fields.timestamp, configuration.fields.tiebreaker)
      })))));
      return (0, _rxjs.concat)(recoveredRequest$, initialRequest$).pipe((0, _operators.take)(1), (0, _operators.concatMap)(esRequest => esSearchStrategy.search(esRequest, options, dependencies)), (0, _operators.map)(esResponse => ({ ...esResponse,
        rawResponse: (0, _runtime_types.decodeOrThrow)(_log_entry3.getLogEntryResponseRT)(esResponse.rawResponse)
      })), (0, _operators.map)(esResponse => {
        var _esResponse$rawRespon, _esResponse$rawRespon2;

        return { ...esResponse,
          ...(esResponse.id ? {
            id: logEntrySearchRequestStateRT.encode({
              esRequestId: esResponse.id
            })
          } : {}),
          rawResponse: _log_entry2.logEntrySearchResponsePayloadRT.encode({
            data: (_esResponse$rawRespon = esResponse.rawResponse.hits.hits.map(createLogEntryFromHit)[0]) !== null && _esResponse$rawRespon !== void 0 ? _esResponse$rawRespon : null,
            errors: ((_esResponse$rawRespon2 = esResponse.rawResponse._shards.failures) !== null && _esResponse$rawRespon2 !== void 0 ? _esResponse$rawRespon2 : []).map(_typed_search_strategy.createErrorFromShardFailure)
          })
        };
      }));
    }),
    cancel: async (id, options, dependencies) => {
      var _esSearchStrategy$can;

      const {
        esRequestId
      } = (0, _runtime_types.decodeOrThrow)(logEntrySearchRequestStateRT)(id);
      return await ((_esSearchStrategy$can = esSearchStrategy.cancel) === null || _esSearchStrategy$can === void 0 ? void 0 : _esSearchStrategy$can.call(esSearchStrategy, esRequestId, options, dependencies));
    }
  };
}; // exported for tests


exports.logEntrySearchStrategyProvider = logEntrySearchStrategyProvider;
const logEntrySearchRequestStateRT = rt.string.pipe(_typed_search_strategy.jsonFromBase64StringRT).pipe(rt.type({
  esRequestId: rt.string
}));
exports.logEntrySearchRequestStateRT = logEntrySearchRequestStateRT;
const {
  asyncInitialRequestRT,
  asyncRecoveredRequestRT,
  asyncRequestRT
} = (0, _typed_search_strategy.createAsyncRequestRTs)(logEntrySearchRequestStateRT, _log_entry2.logEntrySearchRequestParamsRT);

const createLogEntryFromHit = hit => {
  var _hit$fields;

  return {
    id: hit._id,
    index: hit._index,
    cursor: (0, _log_entry.getLogEntryCursorFromHit)(hit),
    fields: Object.entries((_hit$fields = hit.fields) !== null && _hit$fields !== void 0 ? _hit$fields : {}).map(([field, value]) => ({
      field,
      value
    }))
  };
};