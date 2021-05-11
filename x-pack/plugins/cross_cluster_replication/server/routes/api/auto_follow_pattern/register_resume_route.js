"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResumeRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Resume auto-follow pattern(s)
 */


const registerResumeRoute = ({
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

  router.post({
    path: (0, _services.addBasePath)('/auto_follow_patterns/{id}/resume'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      id
    } = request.params;
    const ids = id.split(',');
    const itemsResumed = [];
    const errors = [];

    const formatError = err => {
      if (isEsError(err)) {
        return response.customError(formatEsError(err));
      } // Case: default


      return response.internalError({
        body: err
      });
    };

    await Promise.all(ids.map(_id => context.crossClusterReplication.client.callAsCurrentUser('ccr.resumeAutoFollowPattern', {
      id: _id
    }).then(() => itemsResumed.push(_id)).catch(err => {
      errors.push({
        id: _id,
        error: formatError(err)
      });
    })));
    return response.ok({
      body: {
        itemsResumed,
        errors
      }
    });
  }));
};

exports.registerResumeRoute = registerResumeRoute;