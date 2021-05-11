"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _pipeline_schema = require("./pipeline_schema");

var _shared = require("./shared");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object(_pipeline_schema.pipelineSchema);

const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

const registerUpdateRoute = ({
  router,
  license,
  lib: {
    isEsError
  }
}) => {
  router.put({
    path: `${_constants.API_BASE_PATH}/{name}`,
    validate: {
      body: bodySchema,
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.core.elasticsearch.legacy.client;
    const {
      name
    } = req.params; // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      description,
      processors,
      version,
      on_failure
    } = req.body;

    try {
      // Verify pipeline exists; ES will throw 404 if it doesn't
      await callAsCurrentUser('ingest.getPipeline', {
        id: name
      });
      const response = await callAsCurrentUser('ingest.putPipeline', {
        id: name,
        body: {
          description,
          processors,
          version,
          on_failure
        }
      });
      return res.ok({
        body: response
      });
    } catch (error) {
      if (isEsError(error)) {
        return res.customError({
          statusCode: error.statusCode,
          body: (0, _shared.isObjectWithKeys)(error.body) ? {
            message: error.message,
            attributes: error.body
          } : error
        });
      }

      return res.internalError({
        body: error
      });
    }
  }));
};

exports.registerUpdateRoute = registerUpdateRoute;