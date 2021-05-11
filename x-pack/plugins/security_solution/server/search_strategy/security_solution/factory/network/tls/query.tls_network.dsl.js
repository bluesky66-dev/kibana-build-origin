"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNetworkTlsQuery = void 0;

var _utility_types = require("../../../../../../common/utility_types");

var _build_query = require("../../../../../utils/build_query");

var _search_strategy = require("../../../../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAggs = (querySize, sort) => ({
  count: {
    cardinality: {
      field: 'tls.server.hash.sha1'
    }
  },
  sha1: {
    terms: {
      field: 'tls.server.hash.sha1',
      size: querySize,
      order: { ...getQueryOrder(sort)
      }
    },
    aggs: {
      issuers: {
        terms: {
          field: 'tls.server.issuer'
        }
      },
      subjects: {
        terms: {
          field: 'tls.server.subject'
        }
      },
      not_after: {
        terms: {
          field: 'tls.server.not_after'
        }
      },
      ja3: {
        terms: {
          field: 'tls.server.ja3s'
        }
      }
    }
  }
});

const buildNetworkTlsQuery = ({
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
  const defaultFilter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const filter = ip ? [...defaultFilter, {
    term: {
      [`${flowTarget}.ip`]: ip
    }
  }] : defaultFilter;
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    track_total_hits: false,
    body: {
      aggs: { ...getAggs(querySize, sort)
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

exports.buildNetworkTlsQuery = buildNetworkTlsQuery;

const getQueryOrder = sort => {
  switch (sort.field) {
    case _search_strategy.NetworkTlsFields._id:
      return {
        _key: sort.direction
      };

    default:
      return (0, _utility_types.assertUnreachable)(sort.field);
  }
};