"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDnsQuery = void 0;

var _build_query = require("../../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDnsQueryFilter = () => [{
  bool: {
    should: [{
      exists: {
        field: 'dns.question.name'
      }
    }, {
      term: {
        'suricata.eve.dns.type': {
          value: 'query'
        }
      }
    }, {
      exists: {
        field: 'zeek.dns.query'
      }
    }],
    minimum_should_match: 1
  }
}];

const buildDnsQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), ...getDnsQueryFilter(), {
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
    track_total_hits: true,
    body: {
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

exports.buildDnsQuery = buildDnsQuery;