"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEventsSearchQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildEventsSearchQuery = ({
  aggregations,
  index,
  from,
  to,
  filter,
  size,
  searchAfterSortId,
  sortOrder,
  timestampOverride,
  excludeDocsWithTimestampOverride
}) => {
  const defaultTimeFields = ['@timestamp'];
  const timestamps = timestampOverride != null ? [timestampOverride, ...defaultTimeFields] : defaultTimeFields;
  const docFields = timestamps.map(tstamp => ({
    field: tstamp,
    format: 'strict_date_optional_time'
  }));
  const sortField = timestampOverride != null && !excludeDocsWithTimestampOverride ? timestampOverride : '@timestamp';
  const rangeFilter = [{
    range: {
      [sortField]: {
        lte: to,
        gte: from,
        format: 'strict_date_optional_time'
      }
    }
  }];

  if (excludeDocsWithTimestampOverride) {
    rangeFilter.push({
      bool: {
        must_not: {
          exists: {
            field: timestampOverride
          }
        }
      }
    });
  }

  const filterWithTime = [filter, {
    bool: {
      filter: rangeFilter
    }
  }];
  const searchQuery = {
    allowNoIndices: true,
    index,
    size,
    ignoreUnavailable: true,
    body: {
      docvalue_fields: docFields,
      query: {
        bool: {
          filter: [...filterWithTime, {
            match_all: {}
          }]
        }
      },
      fields: [{
        field: '*',
        include_unmapped: true
      }],
      ...(aggregations ? {
        aggregations
      } : {}),
      sort: [{
        [sortField]: {
          order: sortOrder !== null && sortOrder !== void 0 ? sortOrder : 'asc'
        }
      }]
    }
  };

  if (searchAfterSortId) {
    return { ...searchQuery,
      body: { ...searchQuery.body,
        search_after: [searchAfterSortId]
      }
    };
  }

  return searchQuery;
};

exports.buildEventsSearchQuery = buildEventsSearchQuery;