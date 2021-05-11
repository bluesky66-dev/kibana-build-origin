"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStatsRoute = void 0;

var _services = require("../../../services");

var _ccr_stats_serialization = require("../../../lib/ccr_stats_serialization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns Auto-follow stats
 */


const registerStatsRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.get({
    path: (0, _services.addBasePath)('/stats/auto_follow'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        auto_follow_stats: autoFollowStats
      } = await context.crossClusterReplication.client.callAsCurrentUser('ccr.stats');
      return response.ok({
        body: (0, _ccr_stats_serialization.deserializeAutoFollowStats)(autoFollowStats)
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

exports.registerStatsRoute = registerStatsRoute;