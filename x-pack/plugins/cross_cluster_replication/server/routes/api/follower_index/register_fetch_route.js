"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = void 0;

var _follower_index_serialization = require("../../../../common/services/follower_index_serialization");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns a list of all follower indices
 */


const registerFetchRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.get({
    path: (0, _services.addBasePath)('/follower_indices'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        follower_indices: followerIndices
      } = await context.crossClusterReplication.client.callAsCurrentUser('ccr.info', {
        id: '_all'
      });
      const {
        follow_stats: {
          indices: followerIndicesStats
        }
      } = await context.crossClusterReplication.client.callAsCurrentUser('ccr.stats');
      const followerIndicesStatsMap = followerIndicesStats.reduce((map, stats) => {
        map[stats.index] = stats;
        return map;
      }, {});
      const collatedFollowerIndices = followerIndices.map(followerIndex => {
        return { ...followerIndex,
          ...followerIndicesStatsMap[followerIndex.follower_index]
        };
      });
      return response.ok({
        body: {
          indices: (0, _follower_index_serialization.deserializeListFollowerIndices)(collatedFollowerIndices)
        }
      });
    } catch (err) {
      if (isEsError(err)) {
        return response.customError(formatEsError(err));
      } // Case: default


      return response.internalError({
        body: err
      });
    }
  }));
};

exports.registerFetchRoute = registerFetchRoute;