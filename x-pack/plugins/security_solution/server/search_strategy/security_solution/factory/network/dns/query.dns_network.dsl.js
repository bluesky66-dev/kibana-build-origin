"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDnsQuery = void 0;

var _fp = require("lodash/fp");

var _utility_types = require("../../../../../../common/utility_types");

var _search_strategy = require("../../../../../../common/search_strategy");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HUGE_QUERY_SIZE = 1000000;

const getQueryOrder = sort => {
  switch (sort.field) {
    case _search_strategy.NetworkDnsFields.queryCount:
      return {
        _count: {
          order: sort.direction
        }
      };

    case _search_strategy.NetworkDnsFields.dnsName:
      return {
        _key: {
          order: sort.direction
        }
      };

    case _search_strategy.NetworkDnsFields.uniqueDomains:
      return {
        unique_domains: {
          order: sort.direction
        }
      };

    case _search_strategy.NetworkDnsFields.dnsBytesIn:
      return {
        dns_bytes_in: {
          order: sort.direction
        }
      };

    case _search_strategy.NetworkDnsFields.dnsBytesOut:
      return {
        dns_bytes_out: {
          order: sort.direction
        }
      };
  }

  (0, _utility_types.assertUnreachable)(sort.field);
};

const getCountAgg = () => ({
  dns_count: {
    cardinality: {
      field: 'dns.question.registered_domain'
    }
  }
});

const createIncludePTRFilter = isPtrIncluded => isPtrIncluded ? {} : {
  must_not: [{
    term: {
      'dns.question.type': {
        value: 'PTR'
      }
    }
  }]
};

const buildDnsQuery = ({
  defaultIndex,
  docValueFields,
  filterQuery,
  isPtrIncluded,
  sort,
  pagination: {
    cursorStart,
    querySize
  },
  stackByField = 'dns.question.registered_domain',
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
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      aggregations: { ...getCountAgg(),
        dns_name_query_count: {
          terms: {
            field: stackByField,
            size: HUGE_QUERY_SIZE
          },
          aggs: {
            bucket_sort: {
              bucket_sort: {
                sort: [getQueryOrder(sort), {
                  _key: {
                    order: _search_strategy.Direction.asc
                  }
                }],
                from: cursorStart,
                size: querySize
              }
            },
            unique_domains: {
              cardinality: {
                field: 'dns.question.name'
              }
            },
            dns_bytes_in: {
              sum: {
                field: 'source.bytes'
              }
            },
            dns_bytes_out: {
              sum: {
                field: 'destination.bytes'
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter,
          ...createIncludePTRFilter(isPtrIncluded)
        }
      }
    },
    size: 0,
    track_total_hits: false
  };
  return dslQuery;
};

exports.buildDnsQuery = buildDnsQuery;