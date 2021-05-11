"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOppositeField = exports.buildTopCountriesQuery = void 0;

var _build_query = require("../../../../../utils/build_query");

var _utility_types = require("../../../../../../common/utility_types");

var _search_strategy = require("../../../../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCountAgg = flowTarget => ({
  top_countries_count: {
    cardinality: {
      field: `${flowTarget}.geo.country_iso_code`
    }
  }
});

const buildTopCountriesQuery = ({
  defaultIndex,
  filterQuery,
  flowTarget,
  sort,
  pagination: {
    querySize
  },
  timerange: {
    from,
    to
  },
  ip
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
    body: {
      aggregations: { ...getCountAgg(flowTarget),
        ...getFlowTargetAggs(sort, flowTarget, querySize)
      },
      query: {
        bool: ip ? {
          filter,
          should: [{
            term: {
              [`${getOppositeField(flowTarget)}.ip`]: ip
            }
          }],
          minimum_should_match: 1
        } : {
          filter
        }
      }
    },
    size: 0,
    track_total_hits: false
  };
  return dslQuery;
};

exports.buildTopCountriesQuery = buildTopCountriesQuery;

const getFlowTargetAggs = (sort, flowTarget, querySize) => ({
  [flowTarget]: {
    terms: {
      field: `${flowTarget}.geo.country_iso_code`,
      size: querySize,
      order: { ...getQueryOrder(sort)
      }
    },
    aggs: {
      bytes_in: {
        sum: {
          field: `${getOppositeField(flowTarget)}.bytes`
        }
      },
      bytes_out: {
        sum: {
          field: `${flowTarget}.bytes`
        }
      },
      flows: {
        cardinality: {
          field: 'network.community_id'
        }
      },
      source_ips: {
        cardinality: {
          field: 'source.ip'
        }
      },
      destination_ips: {
        cardinality: {
          field: 'destination.ip'
        }
      }
    }
  }
});

const getOppositeField = flowTarget => {
  switch (flowTarget) {
    case _search_strategy.FlowTargetSourceDest.source:
      return _search_strategy.FlowTargetSourceDest.destination;

    case _search_strategy.FlowTargetSourceDest.destination:
      return _search_strategy.FlowTargetSourceDest.source;
  }

  (0, _utility_types.assertUnreachable)(flowTarget);
};

exports.getOppositeField = getOppositeField;

const getQueryOrder = networkTopCountriesSortField => {
  switch (networkTopCountriesSortField.field) {
    case _search_strategy.NetworkTopTablesFields.bytes_in:
      return {
        bytes_in: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.bytes_out:
      return {
        bytes_out: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.flows:
      return {
        flows: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.destination_ips:
      return {
        destination_ips: networkTopCountriesSortField.direction
      };

    case _search_strategy.NetworkTopTablesFields.source_ips:
      return {
        source_ips: networkTopCountriesSortField.direction
      };
  }

  (0, _utility_types.assertUnreachable)(networkTopCountriesSortField.field);
};