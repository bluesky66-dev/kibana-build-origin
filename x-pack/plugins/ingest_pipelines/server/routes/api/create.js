"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;

var _i18n = require("@kbn/i18n");

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


const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  ..._pipeline_schema.pipelineSchema
});

const registerCreateRoute = ({
  router,
  license,
  lib: {
    isEsError
  }
}) => {
  router.post({
    path: _constants.API_BASE_PATH,
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.core.elasticsearch.legacy.client;
    const pipeline = req.body; // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      name,
      description,
      processors,
      version,
      on_failure
    } = pipeline;

    try {
      // Check that a pipeline with the same name doesn't already exist
      const pipelineByName = await callAsCurrentUser('ingest.getPipeline', {
        id: name
      });

      if (pipelineByName[name]) {
        return res.conflict({
          body: new Error(_i18n.i18n.translate('xpack.ingestPipelines.createRoute.duplicatePipelineIdErrorMessage', {
            defaultMessage: "There is already a pipeline with name '{name}'.",
            values: {
              name
            }
          }))
        });
      }
    } catch (e) {// Silently swallow error
    }

    try {
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

exports.registerCreateRoute = registerCreateRoute;