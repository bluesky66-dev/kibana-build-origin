"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;

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
 * Create an auto-follow pattern
 */


const registerCreateRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  const bodySchema = _configSchema.schema.object({
    id: _configSchema.schema.string(),
    remoteCluster: _configSchema.schema.string(),
    leaderIndexPatterns: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    followIndexPattern: _configSchema.schema.string()
  });

  router.post({
    path: (0, _services.addBasePath)('/auto_follow_patterns'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      id,
      ...rest
    } = request.body;
    const body = (0, _auto_follow_pattern_serialization.serializeAutoFollowPattern)(rest);
    /**
     * First let's make sure that an auto-follow pattern with
     * the same id does not exist.
     */

    try {
      await context.crossClusterReplication.client.callAsCurrentUser('ccr.autoFollowPattern', {
        id
      }); // If we get here it means that an auto-follow pattern with the same id exists

      return response.conflict({
        body: `An auto-follow pattern with the name "${id}" already exists.`
      });
    } catch (err) {
      if (err.statusCode !== 404) {
        if (isEsError(err)) {
          return response.customError(formatEsError(err));
        } // Case: default


        return response.internalError({
          body: err
        });
      }
    }

    try {
      return response.ok({
        body: await context.crossClusterReplication.client.callAsCurrentUser('ccr.saveAutoFollowPattern', {
          id,
          body
        })
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

exports.registerCreateRoute = registerCreateRoute;