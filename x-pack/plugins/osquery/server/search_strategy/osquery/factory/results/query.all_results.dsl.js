"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildResultsQuery = void 0;

var _build_query = require("../../../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildResultsQuery = ({
  actionId,
  filterQuery,
  pagination: {
    activePage,
    querySize
  },
  sort
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    match_phrase: {
      action_id: actionId
    }
  }];
  const dslQuery = {
    allowNoIndices: true,
    index: 'logs-elastic_agent.osquery*',
    ignoreUnavailable: true,
    body: {
      query: {
        bool: {
          filter
        }
      },
      from: activePage * querySize,
      size: querySize,
      track_total_hits: true,
      fields: ['agent.*', 'osquery.*']
    }
  };
  return dslQuery;
};

exports.buildResultsQuery = buildResultsQuery;