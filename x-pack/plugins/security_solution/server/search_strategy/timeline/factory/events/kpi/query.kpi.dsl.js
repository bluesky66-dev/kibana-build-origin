"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTimelineKpiQuery = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildTimelineKpiQuery = ({
  defaultIndex,
  filterQuery,
  timerange
}) => {
  const filterClause = [...(0, _build_query.createQueryFilterClauses)(filterQuery)];

  const getTimerangeFilter = timerangeOption => {
    if (timerangeOption) {
      const {
        to,
        from
      } = timerangeOption;
      return !(0, _fp.isEmpty)(to) && !(0, _fp.isEmpty)(from) ? [{
        range: {
          '@timestamp': {
            gte: from,
            lte: to,
            format: 'strict_date_optional_time'
          }
        }
      }] : [];
    }

    return [];
  };

  const filter = [...filterClause, ...getTimerangeFilter(timerange), {
    match_all: {}
  }];
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    body: {
      aggs: {
        userCount: {
          cardinality: {
            field: 'user.id'
          }
        },
        destinationIpCount: {
          cardinality: {
            field: 'destination.ip'
          }
        },
        hostCount: {
          cardinality: {
            field: 'host.id'
          }
        },
        processCount: {
          cardinality: {
            field: 'process.entity_id'
          }
        },
        sourceIpCount: {
          cardinality: {
            field: 'source.ip'
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      track_total_hits: true
    }
  };
  return dslQuery;
};

exports.buildTimelineKpiQuery = buildTimelineKpiQuery;