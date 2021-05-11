"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStartRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerStartRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.post({
    path: (0, _services.addBasePath)('/start'),
    validate: {
      body: _configSchema.schema.object({
        jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
      }),
      query: _configSchema.schema.maybe(_configSchema.schema.object({
        waitForCompletion: _configSchema.schema.maybe(_configSchema.schema.string())
      }))
    }
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        jobIds
      } = request.body;
      const data = await Promise.all(jobIds.map(id => context.rollup.client.callAsCurrentUser('rollup.startJob', {
        id
      }))).then(() => ({
        success: true
      }));
      return response.ok({
        body: data
      });
    } catch (err) {
      // There is an issue opened on ES to handle the following error correctly
      // https://github.com/elastic/elasticsearch/issues/39845, which was addressed in 8.0
      // but not backported to 7.x because it's breaking. So we need to modify the response
      // here for 7.x.
      if (err.message.includes('Cannot start task for Rollup Job')) {
        err.status = 400;
        err.statusCode = 400;
        err.body.error.status = 400;
        err.displayName = 'Bad request';
      }

      if (isEsError(err)) {
        return response.customError({
          statusCode: err.statusCode,
          body: err
        });
      }

      return response.internalError({
        body: err
      });
    }
  }));
};

exports.registerStartRoute = registerStartRoute;