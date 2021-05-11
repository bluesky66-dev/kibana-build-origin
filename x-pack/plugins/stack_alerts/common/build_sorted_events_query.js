"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSortedEventsQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildSortedEventsQuery = ({
  aggs,
  index,
  from,
  to,
  filter,
  size,
  searchAfterSortId,
  sortOrder,
  timeField,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  track_total_hits
}) => {
  const sortField = timeField;
  const docFields = [timeField].map(tstamp => ({
    field: tstamp,
    format: 'strict_date_optional_time'
  }));
  const rangeFilter = [{
    range: {
      [timeField]: {
        lte: to,
        gte: from,
        format: 'strict_date_optional_time'
      }
    }
  }];
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
    track_total_hits: track_total_hits !== null && track_total_hits !== void 0 ? track_total_hits : false,
    body: {
      docvalue_fields: docFields,
      query: {
        bool: {
          filter: [...filterWithTime, {
            match_all: {}
          }]
        }
      },
      ...(aggs ? {
        aggs
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

exports.buildSortedEventsQuery = buildSortedEventsQuery;