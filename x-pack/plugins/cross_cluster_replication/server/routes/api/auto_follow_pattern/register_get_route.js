"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _auto_follow_pattern_serialization = require("../../../../common/services/auto_follow_pattern_serialization");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get a single auto-follow pattern
 */


const registerGetRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  const paramsSchema = _configSchema.schema.object({
    id: _configSchema.schema.string()
  });

  router.get({
    path: (0, _services.addBasePath)('/auto_follow_patterns/{id}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      id
    } = request.params;

    try {
      const result = await context.crossClusterReplication.client.callAsCurrentUser('ccr.autoFollowPattern', {
        id
      });
      const autoFollowPattern = result.patterns[0];
      return response.ok({
        body: (0, _auto_follow_pattern_serialization.deserializeAutoFollowPattern)(autoFollowPattern)
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

exports.registerGetRoute = registerGetRoute;