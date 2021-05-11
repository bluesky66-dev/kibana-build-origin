"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostsKpiAuthenticationsQuery = void 0;

var _build_query = require("../../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildHostsKpiAuthenticationsQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    bool: {
      filter: [{
        term: {
          'event.category': 'authentication'
        }
      }]
    }
  }, {
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
      aggs: {
        authentication_success: {
          filter: {
            term: {
              'event.outcome': 'success'
            }
          }
        },
        authentication_success_histogram: {
          auto_date_histogram: {
            field: '@timestamp',
            buckets: '6'
          },
          aggs: {
            count: {
              filter: {
                term: {
                  'event.outcome': 'success'
                }
              }
            }
          }
        },
        authentication_failure: {
          filter: {
            term: {
              'event.outcome': 'failure'
            }
          }
        },
        authentication_failure_histogram: {
          auto_date_histogram: {
            field: '@timestamp',
            buckets: '6'
          },
          aggs: {
            count: {
              filter: {
                term: {
                  'event.outcome': 'failure'
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

exports.buildHostsKpiAuthenticationsQuery = buildHostsKpiAuthenticationsQuery;