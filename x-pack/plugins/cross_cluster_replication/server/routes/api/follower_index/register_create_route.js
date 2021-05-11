"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _follower_index_serialization = require("../../../../common/services/follower_index_serialization");

var _services = require("../../../services");

var _utils = require("../../../../common/services/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Create a follower index
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
    name: _configSchema.schema.string(),
    remoteCluster: _configSchema.schema.string(),
    leaderIndex: _configSchema.schema.string(),
    maxReadRequestOperationCount: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxOutstandingReadRequests: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxReadRequestSize: _configSchema.schema.maybe(_configSchema.schema.string()),
    // byte value
    maxWriteRequestOperationCount: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxWriteRequestSize: _configSchema.schema.maybe(_configSchema.schema.string()),
    // byte value
    maxOutstandingWriteRequests: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxWriteBufferCount: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxWriteBufferSize: _configSchema.schema.maybe(_configSchema.schema.string()),
    // byte value
    maxRetryDelay: _configSchema.schema.maybe(_configSchema.schema.string()),
    // time value
    readPollTimeout: _configSchema.schema.maybe(_configSchema.schema.string()) // time value

  });

  router.post({
    path: (0, _services.addBasePath)('/follower_indices'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      name,
      ...rest
    } = request.body;
    const body = (0, _utils.removeEmptyFields)((0, _follower_index_serialization.serializeFollowerIndex)(rest));

    try {
      return response.ok({
        body: await context.crossClusterReplication.client.callAsCurrentUser('ccr.saveFollowerIndex', {
          name,
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