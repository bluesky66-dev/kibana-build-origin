"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDeleteRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.post({
    path: (0, _services.addBasePath)('/delete'),
    validate: {
      body: _configSchema.schema.object({
        jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        jobIds
      } = request.body;
      const data = await Promise.all(jobIds.map(id => context.rollup.client.callAsCurrentUser('rollup.deleteJob', {
        id
      }))).then(() => ({
        success: true
      }));
      return response.ok({
        body: data
      });
    } catch (err) {
      // There is an issue opened on ES to handle the following error correctly
      // https://github.com/elastic/elasticsearch/issues/42908
      // Until then we'll modify the response here.
      if (err.response && err.response.includes('Job must be [STOPPED] before deletion')) {
        err.status = 400;
        err.statusCode = 400;
        err.displayName = 'Bad request';
        err.message = JSON.parse(err.response).task_failures[0].reason.reason;
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

exports.registerDeleteRoute = registerDeleteRoute;