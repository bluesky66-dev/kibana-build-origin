"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostsQuery = void 0;

var _fp = require("lodash/fp");

var _search_strategy = require("../../../../../../common/search_strategy");

var _build_query = require("../../../../../utils/build_query");

var _utility_types = require("../../../../../../common/utility_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildHostsQuery = ({
  defaultIndex,
  docValueFields,
  filterQuery,
  pagination: {
    querySize
  },
  sort,
  timerange: {
    from,
    to
  }
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const agg = {
    host_count: {
      cardinality: {
        field: 'host.name'
      }
    }
  };
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    track_total_hits: false,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      aggregations: { ...agg,
        host_data: {
          terms: {
            size: querySize,
            field: 'host.name',
            order: getQueryOrder(sort)
          },
          aggs: {
            lastSeen: {
              max: {
                field: '@timestamp'
              }
            },
            os: {
              top_hits: {
                size: 1,
                sort: [{
                  '@timestamp': {
                    order: 'desc'
                  }
                }],
                _source: {
                  includes: ['host.os.*']
                }
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      size: 0
    }
  };
  return dslQuery;
};

exports.buildHostsQuery = buildHostsQuery;

const getQueryOrder = sort => {
  switch (sort.field) {
    case _search_strategy.HostsFields.lastSeen:
      return {
        lastSeen: sort.direction
      };

    case _search_strategy.HostsFields.hostName:
      return {
        _key: sort.direction
      };

    default:
      return (0, _utility_types.assertUnreachable)(sort.field);
  }
};