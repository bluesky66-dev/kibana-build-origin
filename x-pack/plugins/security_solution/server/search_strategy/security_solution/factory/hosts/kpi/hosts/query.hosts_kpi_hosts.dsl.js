"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostsKpiHostsQuery = void 0;

var _build_query = require("../../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildHostsKpiHostsQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex
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
    index: defaultIndex,
    allowNoIndices: true,
    ignoreUnavailable: true,
    track_total_hits: false,
    body: {
      aggregations: {
        hosts: {
          cardinality: {
            field: 'host.name'
          }
        },
        hosts_histogram: {
          auto_date_histogram: {
            field: '@timestamp',
            buckets: '6'
          },
          aggs: {
            count: {
              cardinality: {
                field: 'host.name'
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

exports.buildHostsKpiHostsQuery = buildHostsKpiHostsQuery;