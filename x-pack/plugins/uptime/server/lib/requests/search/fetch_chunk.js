"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchChunk = void 0;

var _refine_potential_matches = require("./refine_potential_matches");

var _find_potential_matches = require("./find_potential_matches");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Fetches a single 'chunk' of data with a single query, then uses a secondary query to filter out erroneous matches.
 * Note that all returned data may be erroneous. If `searchAfter` is returned the caller should invoke this function
 * repeatedly with the new searchAfter value as there may be more matching data in a future chunk. If `searchAfter`
 * is falsey there is no more data to fetch.
 * @param queryContext the data and resources needed to perform the query
 * @param searchAfter indicates where Elasticsearch should continue querying on subsequent requests, if at all
 * @param size the minimum size of the matches to chunk
 */


const fetchChunk = async (queryContext, searchAfter, size) => {
  const {
    monitorIds,
    searchAfter: foundSearchAfter
  } = await (0, _find_potential_matches.findPotentialMatches)(queryContext, searchAfter, size);
  const matching = await (0, _refine_potential_matches.refinePotentialMatches)(queryContext, monitorIds);
  return {
    monitorSummaries: matching,
    searchAfter: foundSearchAfter
  };
};

exports.fetchChunk = fetchChunk;