"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEqlSearchRequest = exports.getAllFilters = exports.getQueryFilter = void 0;

var _common = require("../../../../../src/plugins/data/common");

var _build_exceptions_filter = require("./build_exceptions_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getQueryFilter = (query, language, filters, index, lists, excludeExceptions = true) => {
  const indexPattern = {
    fields: [],
    title: index.join()
  };
  const config = {
    allowLeadingWildcards: true,
    queryStringOptions: {
      analyze_wildcard: true
    },
    ignoreFilterIfFieldNotInIndex: false,
    dateFormatTZ: 'Zulu'
  }; // Assume that `indices.query.bool.max_clause_count` is at least 1024 (the default value),
  // allowing us to make 1024-item chunks of exception list items.
  // Discussion at https://issues.apache.org/jira/browse/LUCENE-4835 indicates that 1024 is a
  // very conservative value.

  const exceptionFilter = (0, _build_exceptions_filter.buildExceptionFilter)({
    lists,
    excludeExceptions,
    chunkSize: 1024
  });
  const initialQuery = {
    query,
    language
  };
  const allFilters = getAllFilters(filters, exceptionFilter);
  return (0, _common.buildEsQuery)(indexPattern, initialQuery, allFilters, config);
};

exports.getQueryFilter = getQueryFilter;

const getAllFilters = (filters, exceptionFilter) => {
  if (exceptionFilter != null) {
    return [...filters, exceptionFilter];
  } else {
    return [...filters];
  }
};

exports.getAllFilters = getAllFilters;

const buildEqlSearchRequest = (query, index, from, to, size, timestampOverride, exceptionLists, eventCategoryOverride) => {
  const timestamp = timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp'; // Assume that `indices.query.bool.max_clause_count` is at least 1024 (the default value),
  // allowing us to make 1024-item chunks of exception list items.
  // Discussion at https://issues.apache.org/jira/browse/LUCENE-4835 indicates that 1024 is a
  // very conservative value.

  const exceptionFilter = (0, _build_exceptions_filter.buildExceptionFilter)({
    lists: exceptionLists,
    excludeExceptions: true,
    chunkSize: 1024
  });
  const indexString = index.join();
  const requestFilter = [{
    range: {
      [timestamp]: {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];

  if (exceptionFilter !== undefined) {
    requestFilter.push({
      bool: {
        must_not: {
          bool: exceptionFilter === null || exceptionFilter === void 0 ? void 0 : exceptionFilter.query.bool
        }
      }
    });
  }

  const baseRequest = {
    method: 'POST',
    path: `/${indexString}/_eql/search?allow_no_indices=true`,
    body: {
      size,
      query,
      filter: {
        bool: {
          filter: requestFilter
        }
      }
    }
  };

  if (eventCategoryOverride) {
    return { ...baseRequest,
      event_category_field: eventCategoryOverride
    };
  } else {
    return baseRequest;
  }
};

exports.buildEqlSearchRequest = buildEqlSearchRequest;