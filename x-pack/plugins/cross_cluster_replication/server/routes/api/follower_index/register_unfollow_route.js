"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUnfollowRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Unfollow follower index's leader index
 */


const registerUnfollowRoute = ({
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

  router.put({
    path: (0, _services.addBasePath)('/follower_indices/{id}/unfollow'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      id
    } = request.params;
    const ids = id.split(',');
    const itemsUnfollowed = [];
    const itemsNotOpen = [];
    const errors = [];

    const formatError = err => {
      if (isEsError(err)) {
        return response.customError(formatEsError(err));
      } // Case: default


      return response.internalError({
        body: err
      });
    };

    await Promise.all(ids.map(async _id => {
      try {
        // Try to pause follower, let it fail silently since it may already be paused
        try {
          await context.crossClusterReplication.client.callAsCurrentUser('ccr.pauseFollowerIndex', {
            id: _id
          });
        } catch (e) {// Swallow errors
        } // Close index


        await context.crossClusterReplication.client.callAsCurrentUser('indices.close', {
          index: _id
        }); // Unfollow leader

        await context.crossClusterReplication.client.callAsCurrentUser('ccr.unfollowLeaderIndex', {
          id: _id
        }); // Try to re-open the index, store failures in a separate array to surface warnings in the UI
        // This will allow users to query their index normally after unfollowing

        try {
          await context.crossClusterReplication.client.callAsCurrentUser('indices.open', {
            index: _id
          });
        } catch (e) {
          itemsNotOpen.push(_id);
        } // Push success


        itemsUnfollowed.push(_id);
      } catch (err) {
        errors.push({
          id: _id,
          error: formatError(err)
        });
      }
    }));
    return response.ok({
      body: {
        itemsUnfollowed,
        itemsNotOpen,
        errors
      }
    });
  }));
};

exports.registerUnfollowRoute = registerUnfollowRoute;