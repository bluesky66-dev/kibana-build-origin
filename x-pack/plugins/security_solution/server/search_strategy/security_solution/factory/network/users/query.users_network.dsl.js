"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUsersQuery = void 0;

var _utility_types = require("../../../../../../common/utility_types");

var _search_strategy = require("../../../../../../common/search_strategy");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildUsersQuery = ({
  ip,
  sort,
  filterQuery,
  flowTarget,
  pagination: {
    querySize
  },
  defaultIndex,
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
  }, {
    term: {
      [`${flowTarget}.ip`]: ip
    }
  }];
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    track_total_hits: false,
    body: {
      aggs: {
        user_count: {
          cardinality: {
            field: 'user.name'
          }
        },
        users: {
          terms: {
            field: 'user.name',
            size: querySize,
            order: { ...getQueryOrder(sort)
            }
          },
          aggs: {
            id: {
              terms: {
                field: 'user.id'
              }
            },
            groupId: {
              terms: {
                field: 'user.group.id'
              }
            },
            groupName: {
              terms: {
                field: 'user.group.name'
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter,
          must_not: [{
            term: {
              'event.category': 'authentication'
            }
          }]
        }
      },
      size: 0
    }
  };
  return dslQuery;
};

exports.buildUsersQuery = buildUsersQuery;

const getQueryOrder = sort => {
  switch (sort.field) {
    case _search_strategy.NetworkUsersFields.name:
      return {
        _key: sort.direction
      };

    case _search_strategy.NetworkUsersFields.count:
      return {
        _count: sort.direction
      };

    default:
      return (0, _utility_types.assertUnreachable)(sort.field);
  }
};