"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogEntriesResponseRT = exports.logEntryHitRT = exports.getSortDirection = exports.createGetLogEntriesQuery = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _log_entry = require("../../../../common/log_entry");

var _typed_json = require("../../../../common/typed_json");

var _elasticsearch_runtime_types = require("../../../utils/elasticsearch_runtime_types");

var _common = require("./common");

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


const createGetLogEntriesQuery = (logEntriesIndex, startTimestamp, endTimestamp, cursor, size, timestampField, tiebreakerField, fields, query, highlightTerm) => {
  const sortDirection = getSortDirection(cursor);
  const highlightQuery = createHighlightQuery(highlightTerm, fields);
  return {
    index: logEntriesIndex,
    allow_no_indices: true,
    track_scores: false,
    track_total_hits: false,
    body: {
      size,
      query: {
        bool: {
          filter: [...(query ? [query] : []), ...(highlightQuery ? [highlightQuery] : []), ...(0, _common.createTimeRangeFilterClauses)(startTimestamp, endTimestamp, timestampField)]
        }
      },
      fields,
      _source: false,
      ...(0, _common.createSortClause)(sortDirection, timestampField, tiebreakerField),
      ...createSearchAfterClause(cursor),
      ...createHighlightClause(highlightQuery, fields)
    }
  };
};

exports.createGetLogEntriesQuery = createGetLogEntriesQuery;

const getSortDirection = cursor => _log_entry.logEntryBeforeCursorRT.is(cursor) ? 'desc' : 'asc';

exports.getSortDirection = getSortDirection;

const createSearchAfterClause = cursor => {
  if (_log_entry.logEntryBeforeCursorRT.is(cursor) && cursor.before !== 'last') {
    return {
      search_after: [cursor.before.time, cursor.before.tiebreaker]
    };
  } else if (_log_entry.logEntryAfterCursorRT.is(cursor) && cursor.after !== 'first') {
    return {
      search_after: [cursor.after.time, cursor.after.tiebreaker]
    };
  }

  return {};
};

const createHighlightClause = (highlightQuery, fields) => highlightQuery ? {
  highlight: {
    boundary_scanner: 'word',
    fields: fields.reduce((highlightFieldConfigs, fieldName) => ({ ...highlightFieldConfigs,
      [fieldName]: {}
    }), {}),
    fragment_size: 1,
    number_of_fragments: 100,
    post_tags: [''],
    pre_tags: [''],
    highlight_query: highlightQuery
  }
} : {};

const createHighlightQuery = (highlightTerm, fields) => {
  if (highlightTerm) {
    return {
      multi_match: {
        fields,
        lenient: true,
        query: highlightTerm,
        type: 'phrase'
      }
    };
  }
};

const logEntryHitRT = rt.intersection([_elasticsearch_runtime_types.commonHitFieldsRT, rt.type({
  sort: rt.tuple([rt.number, rt.number])
}), rt.partial({
  fields: rt.record(rt.string, _typed_json.jsonArrayRT),
  highlight: rt.record(rt.string, rt.array(rt.string))
})]);
exports.logEntryHitRT = logEntryHitRT;
const getLogEntriesResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  hits: rt.type({
    hits: rt.array(logEntryHitRT)
  })
})]);
exports.getLogEntriesResponseRT = getLogEntriesResponseRT;